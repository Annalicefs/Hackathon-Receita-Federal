from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from .managers import CustomUserManager

# Exemplo de customização de usuário (opcional, mas recomendado para tipo_usuario)
class Usuario(AbstractUser):
    # Sobrescreve o campo username para usar email como login
    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['nome_completo']

    # Modifique o campo 'username' herdado para ser nulo e em branco
    # O AbstractUser já define 'username', então precisamos sobrescrevê-lo.
    username = models.CharField(
        max_length=150, # Tamanho padrão do username
        unique=True,
        blank=True,    # Permite que seja vazio em formulários
        null=True,     # Permite que seja NULL no banco de dados
        default=None,  # Garante que não seja uma string vazia, mas NULL
        verbose_name="Nome de Usuário (opcional)"
    )


    TIPO_USUARIO_CHOICES = (
        ('Receita Federal', 'Receita Federal'),
        ('Instituicao', 'Instituição'),
        ('Publico', 'Público'),
    )
    nome_completo = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    tipo_usuario = models.CharField(
        max_length=50,
        choices=TIPO_USUARIO_CHOICES,
        default='Publico'
    )
    data_cadastro = models.DateTimeField(auto_now_add=True)

    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name="usuario_set",
        related_query_name="usuario",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="usuario_set",
        related_query_name="usuario",
    )

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    class Meta:
        db_table = 'USUARIOS'
        
class Vape(models.Model):
    tipo_vape = models.CharField(max_length=100)
    marca = models.CharField(max_length=100, blank=True, null=True)
    modelo = models.CharField(max_length=100, blank=True, null=True)
    quantidade = models.IntegerField() # Quantidade de unidades físicas de Vapes
    data_apreensao = models.DateField()
    observacoes = models.TextField(blank=True, null=True)
    id_usuario_cadastro = models.ForeignKey(Usuario, on_delete=models.PROTECT) # Evita deletar usuário com vapes cadastrados

    class Meta:
        db_table = 'VAPES'

class Componente(models.Model):
    nome_componente = models.CharField(max_length=100, unique=True)
    tipo_do_componente = models.CharField(max_length=50, default="Outros")
    modelo_do_componente = models.CharField(max_length=50, blank=True, null=True)
    fabricante_do_componente = models.CharField(max_length=100, blank=True, null=True)
    descricao = models.TextField(blank=True, null=True)
    unidade_medida = models.CharField(max_length=50)

    def __str__(self):
        return self.nome_componente

    class Meta:
        db_table = 'COMPONENTES'

class VapeComponente(models.Model):
    id_vape = models.ForeignKey(Vape, on_delete=models.CASCADE) # Se o vape for deletado, a ligação é deletada
    id_componente = models.ForeignKey(Componente, on_delete=models.PROTECT) # Protege o componente
    quantidade_por_vape = models.IntegerField()

    class Meta:
        db_table = 'VAPE_COMPONENTE'
        unique_together = ('id_vape', 'id_componente') # Garante par único

class EstoqueComponente(models.Model):
    id_componente = models.OneToOneField(Componente, on_delete=models.CASCADE, primary_key=True) # 1:1 com Componente
    quantidade_total = models.IntegerField(default=0)
    data_ultima_atualizacao = models.DateTimeField(auto_now=True) # Atualiza automaticamente na modificação

    class Meta:
        db_table = 'ESTOQUE_COMPONENTES'

class HistoricoEstoque(models.Model):
    TIPO_MOVIMENTO_CHOICES = (
        ('Entrada', 'Entrada'),
        ('Saida', 'Saída'),
        ('Ajuste', 'Ajuste'),
    )
    id_componente = models.ForeignKey(Componente, on_delete=models.PROTECT)
    tipo_movimento = models.CharField(max_length=50, choices=TIPO_MOVIMENTO_CHOICES)
    quantidade_movimentada = models.IntegerField()
    data_movimento = models.DateTimeField(auto_now_add=True)
    id_referencia_origem = models.IntegerField(null=True, blank=True) # Referência flexível
    observacoes = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'HISTORICO_ESTOQUE'

class Instituicao(models.Model):
    id_usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, unique=True) 
    nome_instituicao = models.CharField(max_length=255, unique=True)
    cnpj = models.CharField(max_length=18, unique=True) 
    endereco = models.CharField(max_length=255)
    telefone = models.CharField(max_length=20, blank=True, null=True)
    email_contato = models.EmailField(blank=True, null=True)
    area_atuacao = models.TextField()

    STATUS_CHOICES = (
        ('Pendente', 'Pendente'),
        ('Aprovado', 'Aprovado'),
        ('Rejeitado', 'Rejeitado'),
    )
    status_cadastro = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Pendente')
    data_solicitacao = models.DateTimeField(auto_now_add=True)
    data_aprovacao = models.DateTimeField(null=True, blank=True)
    id_usuario_aprovador = models.ForeignKey(Usuario, on_delete=models.PROTECT, null=True, blank=True, related_name='instituicoes_aprovadas')

     #CAMPOS DE arquivo como input
    assinatura_solicitante_pdf = models.FileField(
        upload_to='instituicoes/assinaturas/',
        blank=True,
        null=True,
        verbose_name="Assinatura do Solicitante (PDF)"
    )
    estatuto_registrado_pdf = models.FileField(
        upload_to='instituicoes/estatutos/',
        blank=True,
        null=True,
        verbose_name="Estatuto Registrado e Alterações (PDF)"
    )
    ata_eleicao_dirigente_pdf = models.FileField(
        upload_to='instituicoes/atas_eleicao/',
        blank=True,
        null=True,
        verbose_name="Ata de Eleição do Quadro Dirigente (PDF)"
    )
    comprovante_endereco_entidade_pdf = models.FileField(
        upload_to='instituicoes/comprovantes_endereco/',
        blank=True,
        null=True,
        verbose_name="Comprovante de Endereço da Entidade (PDF)"
    )
    declaracao_regularidade_conformidade_pdf = models.FileField(
        upload_to='instituicoes/declaracoes_regularidade/',
        blank=True,
        null=True,
        verbose_name="Declaração de Regularidade e Conformidade (PDF)"
    )

    class Meta:
        db_table = 'INSTITUICOES'

class Requisicao(models.Model):
    id_instituicao = models.ForeignKey(Instituicao, on_delete=models.PROTECT)
    data_requisicao = models.DateTimeField(auto_now_add=True)
    STATUS_CHOICES = (
        ('Pendente', 'Pendente'),
        ('Aprovada', 'Aprovada'),
        ('Rejeitada', 'Rejeitada'),
        ('Atendida', 'Atendida'),
        ('Cancelada', 'Cancelada'),
    )
    status_requisicao = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Pendente')
    finalidade_projeto = models.TextField()
    observacoes_receita = models.TextField(blank=True, null=True) # Observações da Receita sobre a requisição
    id_usuario_analise = models.ForeignKey(Usuario, on_delete=models.PROTECT, null=True, blank=True, related_name='requisicoes_analisadas')
    data_analise = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'REQUISICOES'

class ItemRequisicao(models.Model):
    id_requisicao = models.ForeignKey(Requisicao, on_delete=models.CASCADE, related_name='itens') # Se a requisição for deletada, os itens são deletados
    id_componente = models.ForeignKey(Componente, on_delete=models.PROTECT)
    quantidade_solicitada = models.IntegerField()

    class Meta:
        db_table = 'ITENS_REQUISICAO'
        unique_together = ('id_requisicao', 'id_componente')


