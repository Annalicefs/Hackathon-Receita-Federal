from django.shortcuts import render

from django.utils import timezone 
from django.db import transaction
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

from .models import (
    Usuario, Vape, Componente, VapeComponente, EstoqueComponente,
    HistoricoEstoque, Instituicao, Requisicao, ItemRequisicao
)
from .serializers import (
    UsuarioRegistroSerializer, UsuarioSerializer, VapeSerializer,
    ComponenteSerializer, EstoqueComponenteSerializer, HistoricoEstoqueSerializer,
    InstituicaoSerializer, InstituicaoCriarSerializer,
    RequisicaoCriarSerializer, RequisicaoDetalheSerializer, # Ajustado para usar os novos serializers
    ItemRequisicaoSerializer
)
from .permissions import IsReceitaFederal, IsInstituicao, IsPublicoOrAuthenticated, IsOwnerInstituicaoRequisicao


# --- Autenticação e Registro ---
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Adicionar informações customizadas ao token
        token['user_id'] = user.id
        token['email'] = user.email
        token['tipo_usuario'] = user.tipo_usuario
        token['nome_completo'] = user.nome_completo
        
        # Se for instituição, adicionar ID da instituição e CNPJ
        if user.tipo_usuario == 'Instituicao':
            try:
                instituicao = Instituicao.objects.get(id_usuario=user, status_cadastro='Aprovado')
                token['instituicao_id'] = instituicao.id
                token['instituicao_cnpj'] = instituicao.cnpj
                token['instituicao_nome'] = instituicao.nome_instituicao
            except Instituicao.DoesNotExist:
                pass # Usuário do tipo Instituição mas sem instituição aprovada ou vinculada
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Adicionar informações do usuário à resposta do login (além do token)
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'nome_completo': self.user.nome_completo,
            'tipo_usuario': self.user.tipo_usuario
        }
        # Adicionar informações da instituição se aplicável
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
    permission_classes = [AllowAny] # Permite que qualquer um se registre
    serializer_class = UsuarioRegistroSerializer

class UsuarioDetailView(generics.RetrieveAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated] # Só usuários logados podem ver detalhes de usuários (geralmente si mesmos)

    def get_object(self):
        # Permite que o usuário pegue apenas seus próprios detalhes, ou admin/RF veja qualquer um.
        # Se for para o usuário ver apenas a si mesmo:
        if self.request.user.is_authenticated:
             # Se for RF, pode buscar por ID na URL
            if self.request.user.tipo_usuario == 'Receita Federal' and 'pk' in self.kwargs:
                return self.get_queryset().get(pk=self.kwargs['pk'])
            # Senão, retorna o próprio usuário
            return self.request.user
        raise PermissionDenied("Usuário não autenticado.")


# --- Views de Consulta Pública ---
class EstoqueComponentePublicoView(generics.ListAPIView):
    queryset = EstoqueComponente.objects.select_related('id_componente').filter(id_componente__isnull=False).order_by('id_componente__nome_componente')
    serializer_class = EstoqueComponenteSerializer
    permission_classes = [AllowAny] # Acesso público

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
        componentes_data = serializer.validated_data.pop('componentes_do_vape', []) # Usa o campo do serializer
        
        with transaction.atomic():
            vape = serializer.save(id_usuario_cadastro=self.request.user)

            for comp_data in componentes_data:
                componente_id = comp_data.get('id_componente')
                quantidade_por_unidade_vape = comp_data.get('quantidade_por_vape') # Renomeado para clareza

                if not componente_id or quantidade_por_unidade_vape is None:
                    # Isso deveria ser pego pela validação do serializer se 'required=True'
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
                    defaults={'quantidade_total': 0} # Garante que o default seja aplicado se criado
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

    # perform_update pode precisar de lógica similar se componentes_do_vape puderem ser alterados.

class InstituicaoViewSet(viewsets.ModelViewSet):
    queryset = Instituicao.objects.select_related('id_usuario', 'id_usuario_aprovador').all().order_by('-data_solicitacao')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return InstituicaoCriarSerializer
        return InstituicaoSerializer

    def get_permissions(self):
        if self.action == 'create': # Solicitar cadastro de instituição
            # Permite que qualquer usuário autenticado com tipo 'Publico' crie uma solicitação
            # A verificação se já existe uma instituição para o usuário é feita no perform_create
            permission_classes = [IsAuthenticated]
        elif self.action in ['aprovar', 'rejeitar', 'destroy'] or (self.action == 'update' and self.request.user.tipo_usuario == 'Receita Federal'): # Gerenciamento pela Receita
            permission_classes = [IsAuthenticated, IsReceitaFederal]
        elif self.action == 'list': # Listar (RF vê todas, Instituição vê a sua se for o caso)
             permission_classes = [IsAuthenticated]
        elif self.action == 'retrieve' or self.action == 'update': # Ver ou atualizar (dono da instituição)
            permission_classes = [IsAuthenticated] # A lógica de propriedade será verificada em get_object ou has_object_permission
        else:
            permission_classes = [IsAuthenticated] # Padrão seguro
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.tipo_usuario == 'Receita Federal':
                return Instituicao.objects.select_related('id_usuario', 'id_usuario_aprovador').all().order_by('-data_solicitacao')
            elif user.tipo_usuario == 'Instituicao' or user.tipo_usuario == 'Publico':
                # Usuário Instituição ou Público pode ver/editar sua própria solicitação/instituição
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
        serializer.save(id_usuario=user, status_cadastro='Pendente') # Define o usuário e o status inicial

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
            if usuario_associado.tipo_usuario == 'Publico': # Só atualiza se for Publico
                usuario_associado.tipo_usuario = 'Instituicao'
                usuario_associado.save(update_fields=['tipo_usuario'])

            return Response(InstituicaoSerializer(instituicao, context={'request': request}).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['put'], permission_classes=[IsAuthenticated, IsReceitaFederal])
    def rejeitar(self, request, pk=None):
        instituicao = self.get_object()
        # Poderia permitir rejeitar mesmo se já rejeitado, para atualizar observações
        # if instituicao.status_cadastro == 'Rejeitado':
        #     return Response({"detail": "Instituição já está rejeitada."}, status=status.HTTP_400_BAD_REQUEST)

        observacoes = request.data.get('observacoes_receita', instituicao.observacoes_receita) # Permite atualizar observacoes

        with transaction.atomic():
            instituicao.status_cadastro = 'Rejeitado'
            # instituicao.data_aprovacao = None # Limpar data de aprovação se houver
            instituicao.data_analise = timezone.now() # Usar um campo genérico para data da última análise/decisão
            instituicao.id_usuario_aprovador = request.user
            instituicao.observacoes_receita = observacoes
            instituicao.save()

            # Se uma instituição é rejeitada, o usuário associado volta a ser 'Publico'?
            # Isso depende da regra de negócio. Por ora, vamos manter o tipo_usuario.
            # Se a regra for reverter:
            # usuario_associado = instituicao.id_usuario
            # if usuario_associado.tipo_usuario == 'Instituicao':
            #     usuario_associado.tipo_usuario = 'Publico'
            #     usuario_associado.save(update_fields=['tipo_usuario'])

            return Response(InstituicaoSerializer(instituicao, context={'request': request}).data, status=status.HTTP_200_OK)


class RequisicaoViewSet(viewsets.ModelViewSet):
    queryset = Requisicao.objects.all().select_related('id_instituicao', 'id_usuario_analise').prefetch_related('itens__id_componente').order_by('-data_requisicao')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return RequisicaoCriarSerializer
        return RequisicaoDetalheSerializer # Para list, retrieve, update, etc.

    def get_permissions(self):
        permission_classes = [IsAuthenticated]
        if self.action == 'create':
            permission_classes.append(IsInstituicao)
        elif self.action in ['aprovar', 'rejeitar', 'atender']: # Ações da Receita Federal
            permission_classes.append(IsReceitaFederal)
        elif self.action in ['list', 'retrieve']:
             # Receita vê todas, Instituição vê as suas. Implementado em get_queryset.
             # IsOwnerInstituicaoRequisicao será para has_object_permission em retrieve, update, destroy.
            pass # IsAuthenticated já está lá
        elif self.action in ['update', 'partial_update', 'destroy']:
            # Apenas o dono da requisição (instituição) pode modificar/cancelar SE PENDENTE
            # Ou Receita Federal pode ter mais poderes.
            # Para simplificar, RF pode gerenciar, Instituição pode gerenciar as suas PENDENTES.
            if self.request.user.tipo_usuario == 'Instituicao':
                 permission_classes.append(IsOwnerInstituicaoRequisicao) # E precisa verificar o status PENDENTE
            elif self.request.user.tipo_usuario == 'Receita Federal':
                 permission_classes.append(IsReceitaFederal)
            else: # Ninguém mais
                return [IsAuthenticated(), IsReceitaFederal()] # Bloqueia
        return [permission() for permission in permission_classes]

    def get_object(self):
        obj = super().get_object()
        # Verifica permissão de objeto para retrieve, update, destroy para dono da instituição
        if self.action not in ['aprovar', 'rejeitar', 'atender']: # Ações de RF não precisam dessa checagem aqui
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
            # Garante que a requisição seja feita pela instituição APROVADA do usuário logado
            instituicao = Instituicao.objects.get(id_usuario=user, status_cadastro='Aprovado')
        except Instituicao.DoesNotExist:
            raise serializers.ValidationError(
                {"detail": "Apenas instituições aprovadas podem fazer requisições, ou sua instituição não foi encontrada."},
                code=status.HTTP_403_FORBIDDEN
            )
        
        # Verificar se há itens na requisição
        if not serializer.validated_data.get('itens'):
            raise serializers.ValidationError(
                {"itens": ["A lista de itens não pode ser vazia."]},
                code=status.HTTP_400_BAD_REQUEST
            )

        serializer.save(id_instituicao=instituicao, status_requisicao='Pendente')

    # Adicionar lógica para update (cancelar requisição se PENDENTE pela instituição)
    def perform_update(self, serializer):
        requisicao = self.get_object()
        user = self.request.user

        if user.tipo_usuario == 'Instituicao':
            if requisicao.status_requisicao != 'Pendente':
                raise serializers.ValidationError(
                    {"detail": "Só é possível modificar requisições com status 'Pendente'."},
                    code=status.HTTP_403_FORBIDDEN
                )
            # Instituições só podem cancelar (mudar status para 'Cancelada') ou talvez editar itens.
            # Aqui, vamos focar no cancelamento.
            novo_status = serializer.validated_data.get('status_requisicao')
            if novo_status and novo_status == 'Cancelada':
                 serializer.save(status_requisicao='Cancelada', id_usuario_analise=user, data_analise=timezone.now())
                 return
            else: # Se não for para cancelar, impede outras edições por instituição neste fluxo simples
                raise serializers.ValidationError(
                    {"detail": "Instituições só podem cancelar requisições pendentes."},
                    code=status.HTTP_403_FORBIDDEN
                )
        elif user.tipo_usuario == 'Receita Federal':
            # RF pode ter mais flexibilidade para editar, mas as actions são mais apropriadas para status.
            # Se RF for editar outros campos, a lógica vai aqui.
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
                    # Usar select_for_update para lock da linha de estoque durante a transação
                    estoque_comp = EstoqueComponente.objects.select_for_update().get(id_componente=item.id_componente)
                    if estoque_comp.quantidade_total < item.quantidade_solicitada:
                        erros_estoque.append(
                            f"Estoque insuficiente para {item.id_componente.nome_componente}. Disponível: {estoque_comp.quantidade_total}, Solicitado: {item.quantidade_solicitada}"
                        )
                    else:
                        # Esta parte será executada apenas se não houver rollback
                        pass
                except EstoqueComponente.DoesNotExist:
                     erros_estoque.append(f"Componente {item.id_componente.nome_componente} não possui registro de estoque.")
            
            if erros_estoque:
                # Não precisa de transaction.set_rollback(True) explicitamente,
                # levantar uma exceção dentro do `with transaction.atomic()` já faz o rollback.
                raise serializers.ValidationError({"detail": "Erros de estoque encontrados.", "erros": erros_estoque}, code=status.HTTP_400_BAD_REQUEST)

            # Se chegou aqui, todos os itens têm estoque suficiente (ou foram criados se não existiam)
            for item in itens_requisicao:
                estoque_comp = EstoqueComponente.objects.get(id_componente=item.id_componente) # Re-get para garantir que estamos com o objeto correto
                estoque_comp.quantidade_total -= item.quantidade_solicitada
                estoque_comp.save()

                HistoricoEstoque.objects.create(
                    id_componente=item.id_componente,
                    tipo_movimento='Saida',
                    quantidade_movimentada=item.quantidade_solicitada,
                    id_referencia_origem=item.id, # ID do ItemRequisicao
                    observacoes=f"Saída para Requisição ID: {requisicao.id} (Instituição: {requisicao.id_instituicao.nome_instituicao}), Item: {item.id_componente.nome_componente}"
                )

            requisicao.status_requisicao = 'Atendida'
            requisicao.id_usuario_analise = request.user
            requisicao.data_analise = timezone.now() # Data do atendimento
            requisicao.save()

            return Response(RequisicaoDetalheSerializer(requisicao, context={'request': request}).data, status=status.HTTP_200_OK)


class ComponenteViewSet(viewsets.ModelViewSet):
    queryset = Componente.objects.all().order_by('nome_componente')
    serializer_class = ComponenteSerializer
    permission_classes = [IsAuthenticated, IsReceitaFederal] # Apenas Receita Federal gerencia componentes

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