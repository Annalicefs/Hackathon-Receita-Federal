from django.shortcuts import render

from django.utils import timezone 
from django.db import transaction
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import (
    Usuario, Vape, Componente, VapeComponente, EstoqueComponente,
    HistoricoEstoque, Instituicao, Requisicao, ItemRequisicao
)
from .serializers import (
    UsuarioRegistroSerializer, UsuarioSerializer, VapeSerializer,
    ComponenteSerializer, EstoqueComponenteSerializer, HistoricoEstoqueSerializer,
    InstituicaoSerializer, InstituicaoCriarSerializer,
    RequisicaoCriarSerializer, RequisicaoDetalheSerializer,
    ItemRequisicaoSerializer
)
from .permissions import IsReceitaFederal, IsInstituicao, IsPublicoOrAuthenticated, IsOwnerInstituicaoRequisicao


# --- Autenticação e Registro ---
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['user_id'] = user.id
        token['email'] = user.email
        token['tipo_usuario'] = user.tipo_usuario
        token['nome_completo'] = user.nome_completo
        
        if user.tipo_usuario == 'Instituicao':
            try:
                instituicao = Instituicao.objects.get(id_usuario=user, status_cadastro='Aprovado')
                token['instituicao_id'] = instituicao.id
                token['instituicao_cnpj'] = instituicao.cnpj
                token['instituicao_nome'] = instituicao.nome_instituicao
            except Instituicao.DoesNotExist:
                pass 
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'nome_completo': self.user.nome_completo,
            'tipo_usuario': self.user.tipo_usuario
        }
        if self.user.tipo_usuario == 'Instituicao':
            try:
                instituicao = Instituicao.objects.get(id_usuario=self.user, status_cadastro='Aprovado')
                data['user']['instituicao'] = {
                    'id': instituicao.id,
                    'nome': instituicao.nome_instituicao,
                    'cnpj': instituicao.cnpj,
                }
            except Instituicao.DoesNotExist:
                data['user']['instituicao'] = None
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UsuarioRegistroView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UsuarioRegistroSerializer

class UsuarioDetailView(generics.RetrieveAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated] 

    def get_object(self):
        if self.request.user.is_authenticated:
            if self.request.user.tipo_usuario == 'Receita Federal' and 'pk' in self.kwargs:
                return self.get_queryset().get(pk=self.kwargs['pk'])
            return self.request.user
        raise PermissionDenied("Usuário não autenticado.")


# --- Views de Consulta Pública ---
class EstoqueComponentePublicoView(generics.ListAPIView):
    queryset = EstoqueComponente.objects.select_related('id_componente').filter(id_componente__isnull=False).order_by('id_componente__nome_componente')
    serializer_class = EstoqueComponenteSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        nome_componente = self.request.query_params.get('nome_componente', None)
        if nome_componente:
            queryset = queryset.filter(id_componente__nome_componente__icontains=nome_componente)
        return queryset

# --- Views da Receita Federal ---
class VapeViewSet(viewsets.ModelViewSet):
    queryset = Vape.objects.select_related('id_usuario_cadastro').prefetch_related('vapecomponente_set__id_componente').all()
    serializer_class = VapeSerializer
    permission_classes = [IsAuthenticated, IsReceitaFederal]

    def perform_create(self, serializer):
        componentes_data = serializer.validated_data.pop('componentes_do_vape', [])
        
        with transaction.atomic():
            vape = serializer.save(id_usuario_cadastro=self.request.user)

            for comp_data in componentes_data:
                componente_id = comp_data.get('id_componente')
                quantidade_por_unidade_vape = comp_data.get('quantidade_por_vape') 

                if not componente_id or quantidade_por_unidade_vape is None:
                    raise serializers.ValidationError("Dados de componente inválidos no Vape.")

                try:
                    componente = Componente.objects.get(pk=componente_id)
                except Componente.DoesNotExist:
                    raise serializers.ValidationError(f"Componente com ID {componente_id} não encontrado.")
                
                VapeComponente.objects.create(
                    id_vape=vape,
                    id_componente=componente,
                    quantidade_por_vape=quantidade_por_unidade_vape
                )

                estoque_comp, created = EstoqueComponente.objects.get_or_create(
                    id_componente=componente,
                    defaults={'quantidade_total': 0}
                )
                quantidade_total_componentes_entrada = vape.quantidade * quantidade_por_unidade_vape
                estoque_comp.quantidade_total += quantidade_total_componentes_entrada
                estoque_comp.save()

                HistoricoEstoque.objects.create(
                    id_componente=componente,
                    tipo_movimento='Entrada',
                    quantidade_movimentada=quantidade_total_componentes_entrada,
                    id_referencia_origem=vape.id,
                    observacoes=f"Entrada via apreensão do Vape ID: {vape.id} ({vape.quantidade} unidades de vape, {quantidade_por_unidade_vape} do componente por unidade)"
                )

class InstituicaoViewSet(viewsets.ModelViewSet):
    queryset = Instituicao.objects.select_related('id_usuario', 'id_usuario_aprovador').all().order_by('-data_solicitacao')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return InstituicaoCriarSerializer
        return InstituicaoSerializer

    def get_permissions(self):
        if self.action == 'create': 
            permission_classes = [IsAuthenticated]
        elif self.action in ['aprovar', 'rejeitar', 'destroy'] or (self.action == 'update' and self.request.user.tipo_usuario == 'Receita Federal'):
            permission_classes = [IsAuthenticated, IsReceitaFederal]
        elif self.action == 'list': 
             permission_classes = [IsAuthenticated]
        elif self.action == 'retrieve' or self.action == 'update':
            permission_classes = [IsAuthenticated] 
        else:
            permission_classes = [IsAuthenticated] 
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.tipo_usuario == 'Receita Federal':
                return Instituicao.objects.select_related('id_usuario', 'id_usuario_aprovador').all().order_by('-data_solicitacao')
            elif user.tipo_usuario == 'Instituicao' or user.tipo_usuario == 'Publico':
                return Instituicao.objects.filter(id_usuario=user).select_related('id_usuario', 'id_usuario_aprovador')
        return Instituicao.objects.none()


    def perform_create(self, serializer):
        user = self.request.user
        if user.tipo_usuario != 'Publico':
            raise serializers.ValidationError(
                {"detail": "Apenas usuários com tipo 'Público' podem solicitar cadastro de instituição."},
                code=status.HTTP_403_FORBIDDEN
            )
        if Instituicao.objects.filter(id_usuario=user).exists():
            raise serializers.ValidationError(
                {"detail": "Este usuário já solicitou ou possui cadastro de uma instituição."},
                code=status.HTTP_400_BAD_REQUEST
            )
        serializer.save(id_usuario=user, status_cadastro='Pendente') 

    @action(detail=True, methods=['put'], permission_classes=[IsAuthenticated, IsReceitaFederal])
    def aprovar(self, request, pk=None):
        instituicao = self.get_object()
        if instituicao.status_cadastro == 'Aprovado':
            return Response({"detail": "Instituição já está aprovada."}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            instituicao.status_cadastro = 'Aprovado'
            instituicao.data_aprovacao = timezone.now()
            instituicao.id_usuario_aprovador = request.user
            instituicao.save()

            usuario_associado = instituicao.id_usuario
            if usuario_associado.tipo_usuario == 'Publico': 
                usuario_associado.tipo_usuario = 'Instituicao'
                usuario_associado.save(update_fields=['tipo_usuario'])

            return Response(InstituicaoSerializer(instituicao, context={'request': request}).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['put'], permission_classes=[IsAuthenticated, IsReceitaFederal])
    def rejeitar(self, request, pk=None):
        instituicao = self.get_object()
        observacoes = request.data.get('observacoes_receita', instituicao.observacoes_receita) 

        with transaction.atomic():
            instituicao.status_cadastro = 'Rejeitado'
            instituicao.data_analise = timezone.now() 
            instituicao.id_usuario_aprovador = request.user
            instituicao.observacoes_receita = observacoes
            instituicao.save()

            return Response(InstituicaoSerializer(instituicao, context={'request': request}).data, status=status.HTTP_200_OK)


class RequisicaoViewSet(viewsets.ModelViewSet):
    queryset = Requisicao.objects.all().select_related('id_instituicao', 'id_usuario_analise').prefetch_related('itens__id_componente').order_by('-data_requisicao')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return RequisicaoCriarSerializer
        return RequisicaoDetalheSerializer 

    def get_permissions(self):
        permission_classes = [IsAuthenticated]
        if self.action == 'create':
            permission_classes.append(IsInstituicao)
        elif self.action in ['aprovar', 'rejeitar', 'atender']: 
            permission_classes.append(IsReceitaFederal)
        elif self.action in ['list', 'retrieve']:
            pass 
        elif self.action in ['update', 'partial_update', 'destroy']:
            if self.request.user.tipo_usuario == 'Instituicao':
                 permission_classes.append(IsOwnerInstituicaoRequisicao) 
            elif self.request.user.tipo_usuario == 'Receita Federal':
                 permission_classes.append(IsReceitaFederal)
            else: 
                return [IsAuthenticated(), IsReceitaFederal()]
        return [permission() for permission in permission_classes]

    def get_object(self):
        obj = super().get_object()

        if self.action not in ['aprovar', 'rejeitar', 'atender']:
            if self.request.user.tipo_usuario == 'Instituicao':
                self.check_object_permissions(self.request, obj)
        return obj

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Requisicao.objects.none()

        if user.tipo_usuario == 'Receita Federal':
            return Requisicao.objects.all().select_related('id_instituicao__id_usuario', 'id_usuario_analise').prefetch_related('itens__id_componente').order_by('-data_requisicao')
        elif user.tipo_usuario == 'Instituicao':
            try:
                instituicao = Instituicao.objects.get(id_usuario=user, status_cadastro='Aprovado')
                return Requisicao.objects.filter(id_instituicao=instituicao).select_related('id_instituicao__id_usuario', 'id_usuario_analise').prefetch_related('itens__id_componente').order_by('-data_requisicao')
            except Instituicao.DoesNotExist:
                return Requisicao.objects.none()
        return Requisicao.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        try:
            instituicao = Instituicao.objects.get(id_usuario=user, status_cadastro='Aprovado')
        except Instituicao.DoesNotExist:
            raise serializers.ValidationError(
                {"detail": "Apenas instituições aprovadas podem fazer requisições, ou sua instituição não foi encontrada."},
                code=status.HTTP_403_FORBIDDEN
            )

        if not serializer.validated_data.get('itens'):
            raise serializers.ValidationError(
                {"itens": ["A lista de itens não pode ser vazia."]},
                code=status.HTTP_400_BAD_REQUEST
            )

        serializer.save(id_instituicao=instituicao, status_requisicao='Pendente')

    def perform_update(self, serializer):
        requisicao = self.get_object()
        user = self.request.user

        if user.tipo_usuario == 'Instituicao':
            if requisicao.status_requisicao != 'Pendente':
                raise serializers.ValidationError(
                    {"detail": "Só é possível modificar requisições com status 'Pendente'."},
                    code=status.HTTP_403_FORBIDDEN
                )

            novo_status = serializer.validated_data.get('status_requisicao')
            if novo_status and novo_status == 'Cancelada':
                 serializer.save(status_requisicao='Cancelada', id_usuario_analise=user, data_analise=timezone.now())
                 return
            else: 
                raise serializers.ValidationError(
                    {"detail": "Instituições só podem cancelar requisições pendentes."},
                    code=status.HTTP_403_FORBIDDEN
                )
        elif user.tipo_usuario == 'Receita Federal':
            serializer.save(id_usuario_analise=user, data_analise=timezone.now())


    @action(detail=True, methods=['put'], permission_classes=[IsAuthenticated, IsReceitaFederal])
    def aprovar(self, request, pk=None):
        requisicao = self.get_object()
        if requisicao.status_requisicao != 'Pendente':
            return Response({"detail": "Apenas requisições pendentes podem ser aprovadas."}, status=status.HTTP_400_BAD_REQUEST)

        requisicao.status_requisicao = 'Aprovada'
        requisicao.id_usuario_analise = request.user
        requisicao.data_analise = timezone.now()
        requisicao.observacoes_receita = request.data.get('observacoes_receita', requisicao.observacoes_receita)
        requisicao.save()
        return Response(RequisicaoDetalheSerializer(requisicao, context={'request': request}).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['put'], permission_classes=[IsAuthenticated, IsReceitaFederal])
    def rejeitar(self, request, pk=None):
        requisicao = self.get_object()
        if requisicao.status_requisicao != 'Pendente':
            return Response({"detail": "Apenas requisições pendentes podem ser rejeitadas."}, status=status.HTTP_400_BAD_REQUEST)
        
        observacoes = request.data.get('observacoes_receita')
        if not observacoes:
            return Response({"observacoes_receita": ["Este campo é obrigatório para rejeitar."]}, status=status.HTTP_400_BAD_REQUEST)

        requisicao.status_requisicao = 'Rejeitada'
        requisicao.observacoes_receita = observacoes
        requisicao.id_usuario_analise = request.user
        requisicao.data_analise = timezone.now()
        requisicao.save()
        return Response(RequisicaoDetalheSerializer(requisicao, context={'request': request}).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['put'], permission_classes=[IsAuthenticated, IsReceitaFederal])
    def atender(self, request, pk=None):
        requisicao = self.get_object()
        if requisicao.status_requisicao != 'Aprovada':
            return Response({"detail": "Apenas requisições aprovadas podem ser atendidas."}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            itens_requisicao = requisicao.itens.select_related('id_componente').all()
            erros_estoque = []

            for item in itens_requisicao:
                try:
                    estoque_comp = EstoqueComponente.objects.select_for_update().get(id_componente=item.id_componente)
                    if estoque_comp.quantidade_total < item.quantidade_solicitada:
                        erros_estoque.append(
                            f"Estoque insuficiente para {item.id_componente.nome_componente}. Disponível: {estoque_comp.quantidade_total}, Solicitado: {item.quantidade_solicitada}"
                        )
                    else:
                        pass
                except EstoqueComponente.DoesNotExist:
                     erros_estoque.append(f"Componente {item.id_componente.nome_componente} não possui registro de estoque.")
            
            if erros_estoque:
                raise serializers.ValidationError({"detail": "Erros de estoque encontrados.", "erros": erros_estoque}, code=status.HTTP_400_BAD_REQUEST)
            for item in itens_requisicao:
                estoque_comp = EstoqueComponente.objects.get(id_componente=item.id_componente) 
                estoque_comp.quantidade_total -= item.quantidade_solicitada
                estoque_comp.save()

                HistoricoEstoque.objects.create(
                    id_componente=item.id_componente,
                    tipo_movimento='Saida',
                    quantidade_movimentada=item.quantidade_solicitada,
                    id_referencia_origem=item.id, 
                    observacoes=f"Saída para Requisição ID: {requisicao.id} (Instituição: {requisicao.id_instituicao.nome_instituicao}), Item: {item.id_componente.nome_componente}"
                )

            requisicao.status_requisicao = 'Atendida'
            requisicao.id_usuario_analise = request.user
            requisicao.data_analise = timezone.now() 
            requisicao.save()

            return Response(RequisicaoDetalheSerializer(requisicao, context={'request': request}).data, status=status.HTTP_200_OK)


class ComponenteViewSet(viewsets.ModelViewSet):
    queryset = Componente.objects.all().order_by('nome_componente')
    serializer_class = ComponenteSerializer
    filter_backends = [DjangoFilterBackend] 
     
    filterset_fields = {
        'nome_componente': ['exact', 'icontains'],
        'tipo_do_componente': ['exact', 'icontains'],
        'modelo_do_componente': ['exact', 'icontains'], 
        'fabricante_do_componente': ['exact', 'icontains'], 
    }
    permission_classes = [IsAuthenticated, IsReceitaFederal]

    def get_queryset(self):
        queryset = super().get_queryset()
        print(f"DEBUG: Query Params recebidos para Componente: {self.request.query_params}")
        return queryset

class HistoricoEstoqueViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HistoricoEstoque.objects.select_related('id_componente').all().order_by('-data_movimento')
    serializer_class = HistoricoEstoqueSerializer
    permission_classes = [IsAuthenticated, IsReceitaFederal]

    def get_queryset(self):
        queryset = super().get_queryset()
        componente_id = self.request.query_params.get('componente_id', None)
        tipo_movimento = self.request.query_params.get('tipo_movimento', None)
        data_inicio = self.request.query_params.get('data_inicio', None)
        data_fim = self.request.query_params.get('data_fim', None)

        if componente_id:
            queryset = queryset.filter(id_componente_id=componente_id)
        if tipo_movimento:
            queryset = queryset.filter(tipo_movimento__iexact=tipo_movimento)
        if data_inicio:
            queryset = queryset.filter(data_movimento__date__gte=data_inicio)
        if data_fim:
            queryset = queryset.filter(data_movimento__date__lte=data_fim)
            
        return queryset