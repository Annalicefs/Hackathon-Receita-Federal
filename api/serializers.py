from rest_framework import serializers
from .models import (
    Usuario, Vape, Componente, VapeComponente, EstoqueComponente,
    HistoricoEstoque, Instituicao, Requisicao, ItemRequisicao
)

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nome_completo', 'email', 'tipo_usuario', 'data_cadastro']
        read_only_fields = ['tipo_usuario', 'data_cadastro'] 

class UsuarioRegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = Usuario
        fields = ['nome_completo', 'email', 'password'] 

    def create(self, validated_data):
        user = Usuario.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            nome_completo=validated_data['nome_completo'],
            tipo_usuario='Publico' 
        )
        return user

class VapeComponenteSerializer(serializers.ModelSerializer):
    nome_componente = serializers.CharField(source='id_componente.nome_componente', read_only=True)
    unidade_medida = serializers.CharField(source='id_componente.unidade_medida', read_only=True)

    class Meta:
        model = VapeComponente
        fields = ['id_componente', 'nome_componente', 'unidade_medida', 'quantidade_por_vape']

class VapeComponenteInputSerializer(serializers.Serializer):
    id_componente = serializers.IntegerField()
    quantidade_por_vape = serializers.IntegerField(min_value=1)

class VapeSerializer(serializers.ModelSerializer):
    componentes_do_vape = VapeComponenteInputSerializer(
        many=True, 
        write_only=True,
        required=False
    )
    componentes_associados = VapeComponenteSerializer(source='vapecomponente_set', many=True, read_only=True)


    class Meta:
        model = Vape
        fields = [
            'id', 'tipo_vape', 'marca', 'modelo', 'quantidade', 'data_apreensao',
            'observacoes', 'id_usuario_cadastro', 'componentes_do_vape', 'componentes_associados'
        ]
        read_only_fields = ['id_usuario_cadastro']

class ComponenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Componente
        fields = '__all__'

class EstoqueComponenteSerializer(serializers.ModelSerializer):
    nome_componente = serializers.CharField(source='id_componente.nome_componente', read_only=True)
    unidade_medida = serializers.CharField(source='id_componente.unidade_medida', read_only=True)

    class Meta:
        model = EstoqueComponente
        fields = ['id_componente', 'nome_componente', 'unidade_medida', 'quantidade_total', 'data_ultima_atualizacao']

class HistoricoEstoqueSerializer(serializers.ModelSerializer):
    nome_componente = serializers.CharField(source='id_componente.nome_componente', read_only=True)

    class Meta:
        model = HistoricoEstoque
        fields = '__all__'

class InstituicaoSerializer(serializers.ModelSerializer):
    usuario_email = serializers.EmailField(source='id_usuario.email', read_only=True)
    usuario_nome_completo = serializers.CharField(source='id_usuario.nome_completo', read_only=True)
    aprovador_email = serializers.EmailField(source='id_usuario_aprovador.email', read_only=True, allow_null=True)

    class Meta:
        model = Instituicao
        fields = '__all__'
        read_only_fields = ['status_cadastro', 'data_solicitacao', 'data_aprovacao', 'id_usuario_aprovador', 'id_usuario']


class InstituicaoCriarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instituicao
        fields = [
            'nome_instituicao', 'cnpj', 'endereco',
            'telefone', 'email_contato', 'area_atuacao',
            'assinatura_solicitante_pdf',
            'estatuto_registrado_pdf',
            'ata_eleicao_dirigente_pdf',
            'comprovante_endereco_entidade_pdf',
            'declaracao_regularidade_conformidade_pdf'
        ]

class ItemRequisicaoSerializer(serializers.ModelSerializer):
    nome_componente = serializers.CharField(source='id_componente.nome_componente', read_only=True)
    unidade_medida = serializers.CharField(source='id_componente.unidade_medida', read_only=True)

    class Meta:
        model = ItemRequisicao
        fields = ['id', 'id_componente', 'nome_componente', 'unidade_medida', 'quantidade_solicitada']


class RequisicaoCriarSerializer(serializers.ModelSerializer):
    itens = ItemRequisicaoSerializer(many=True) 

    class Meta:
        model = Requisicao
        fields = [
            'finalidade_projeto', 'itens'
        ]

    def create(self, validated_data):
        itens_data = validated_data.pop('itens')
        requisicao = Requisicao.objects.create(**validated_data)
        for item_data in itens_data:
            ItemRequisicao.objects.create(id_requisicao=requisicao, **item_data)
        return requisicao

class RequisicaoDetalheSerializer(serializers.ModelSerializer):
    itens = ItemRequisicaoSerializer(many=True, read_only=True)
    nome_instituicao = serializers.CharField(source='id_instituicao.nome_instituicao', read_only=True)
    analista_email = serializers.EmailField(source='id_usuario_analise.email', read_only=True, allow_null=True)
    cnpj_instituicao = serializers.CharField(source='id_instituicao.cnpj', read_only=True)


    class Meta:
        model = Requisicao
        fields = '__all__'
        read_only_fields = [
            'status_requisicao', 'data_requisicao', 'observacoes_receita',
            'id_usuario_analise', 'data_analise', 'id_instituicao'
        ]