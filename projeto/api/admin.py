from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    Usuario,
    Vape,
    Componente,
    VapeComponente,
    EstoqueComponente,
    HistoricoEstoque,
    Instituicao,
    Requisicao,
    ItemRequisicao
)

# --- Personalização para o modelo Usuario ---
@admin.register(Usuario)
class UsuarioAdmin(BaseUserAdmin):
    list_display = ('email', 'nome_completo', 'tipo_usuario', 'is_staff', 'is_active', 'data_cadastro')
    list_filter = ('tipo_usuario', 'is_staff', 'is_active')
    search_fields = ('email', 'nome_completo')
    ordering = ('-data_cadastro',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Informações Pessoais', {'fields': ('nome_completo', 'tipo_usuario')}),
        ('Permissões', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Datas Importantes', {'fields': ('last_login', 'data_cadastro')}),
    )
    readonly_fields = ('last_login', 'data_cadastro')

# --- Inlines para modelos relacionados ---

class VapeComponenteInline(admin.TabularInline): # Ou admin.StackedInline para um layout diferente
    model = VapeComponente
    extra = 1 # Quantidade de formulários extras para adicionar componentes
    autocomplete_fields = ['id_componente'] # Se você tiver muitos componentes, melhora a usabilidade


class ItemRequisicaoInline(admin.TabularInline):
    model = ItemRequisicao
    extra = 1
    autocomplete_fields = ['id_componente']

# --- Personalizações para os modelos principais ---

@admin.register(Vape)
class VapeAdmin(admin.ModelAdmin):
    list_display = ('id', 'tipo_vape', 'marca', 'modelo', 'quantidade', 'data_apreensao', 'id_usuario_cadastro')
    list_filter = ('data_apreensao', 'marca', 'id_usuario_cadastro__tipo_usuario')
    search_fields = ('tipo_vape', 'marca', 'modelo', 'observacoes', 'id_usuario_cadastro__email')
    ordering = ('-data_apreensao',)
    date_hierarchy = 'data_apreensao' # Navegação por datas
    inlines = [VapeComponenteInline]
    readonly_fields = ('id_usuario_cadastro',) # Geralmente preenchido automaticamente

    def save_model(self, request, obj, form, change):
        # Se o usuário de cadastro não estiver definido (ao criar um novo vape via admin)
        if not obj.pk or not obj.id_usuario_cadastro:
            obj.id_usuario_cadastro = request.user
        super().save_model(request, obj, form, change)


@admin.register(Componente)
class ComponenteAdmin(admin.ModelAdmin):
    list_display = ('nome_componente', 'unidade_medida', 'descricao_curta')
    search_fields = ('nome_componente', 'descricao')
    ordering = ('nome_componente',)

    def descricao_curta(self, obj):
        if obj.descricao and len(obj.descricao) > 50:
            return obj.descricao[:50] + "..."
        return obj.descricao
    descricao_curta.short_description = 'Descrição'


@admin.register(EstoqueComponente)
class EstoqueComponenteAdmin(admin.ModelAdmin):
    list_display = ('get_componente_nome', 'quantidade_total', 'data_ultima_atualizacao')
    search_fields = ('id_componente__nome_componente',)
    ordering = ('id_componente__nome_componente',)
    readonly_fields = ('data_ultima_atualizacao',)

    @admin.display(description='Componente', ordering='id_componente__nome_componente')
    def get_componente_nome(self, obj):
        return obj.id_componente.nome_componente


@admin.register(HistoricoEstoque)
class HistoricoEstoqueAdmin(admin.ModelAdmin):
    list_display = ('get_componente_nome', 'tipo_movimento', 'quantidade_movimentada', 'data_movimento', 'id_referencia_origem_formatado', 'observacoes_curtas')
    list_filter = ('tipo_movimento', 'data_movimento', 'id_componente')
    search_fields = ('id_componente__nome_componente', 'observacoes')
    ordering = ('-data_movimento',)
    date_hierarchy = 'data_movimento'
    readonly_fields = ('data_movimento',)

    @admin.display(description='Componente', ordering='id_componente__nome_componente')
    def get_componente_nome(self, obj):
        return obj.id_componente.nome_componente

    @admin.display(description='Ref. Origem')
    def id_referencia_origem_formatado(self, obj):
        if obj.tipo_movimento == 'Entrada': # Supondo que refere-se a um Vape ID
            return f"Vape ID: {obj.id_referencia_origem}"
        elif obj.tipo_movimento == 'Saida': # Supondo que refere-se a um ItemRequisicao ID
            return f"Item Req. ID: {obj.id_referencia_origem}"
        return obj.id_referencia_origem

    @admin.display(description='Observações')
    def observacoes_curtas(self, obj):
        if obj.observacoes and len(obj.observacoes) > 75:
            return obj.observacoes[:75] + "..."
        return obj.observacoes


@admin.register(Instituicao)
class InstituicaoAdmin(admin.ModelAdmin):
    list_display = ('nome_instituicao', 'cnpj', 'email_usuario_associado', 'status_cadastro', 'data_solicitacao', 'data_aprovacao', 'aprovador')
    list_filter = ('status_cadastro', 'data_solicitacao', 'data_aprovacao')
    search_fields = ('nome_instituicao', 'cnpj', 'id_usuario__email', 'area_atuacao')
    ordering = ('-data_solicitacao',)
    date_hierarchy = 'data_solicitacao'
    readonly_fields = ('data_solicitacao', 'data_aprovacao', 'id_usuario', 'id_usuario_aprovador')
    actions = ['aprovar_instituicoes', 'rejeitar_instituicoes']

    @admin.display(description='Email Usuário', ordering='id_usuario__email')
    def email_usuario_associado(self, obj):
        return obj.id_usuario.email

    @admin.display(description='Aprovador', ordering='id_usuario_aprovador__email')
    def aprovador(self, obj):
        if obj.id_usuario_aprovador:
            return obj.id_usuario_aprovador.email
        return "-"

    @admin.action(description='Aprovar instituições selecionadas')
    def aprovar_instituicoes(self, request, queryset):
        from django.utils import timezone # Import local para a action
        for instituicao in queryset.filter(status_cadastro='Pendente'):
            instituicao.status_cadastro = 'Aprovado'
            instituicao.data_aprovacao = timezone.now()
            instituicao.id_usuario_aprovador = request.user
            instituicao.save()
            # Lógica para mudar o tipo de usuário, se necessário
            usuario_associado = instituicao.id_usuario
            if usuario_associado.tipo_usuario == 'Publico':
                usuario_associado.tipo_usuario = 'Instituicao'
                usuario_associado.save(update_fields=['tipo_usuario'])
        self.message_user(request, f"{queryset.filter(status_cadastro='Aprovado').count()} instituições aprovadas com sucesso.")

    @admin.action(description='Rejeitar instituições selecionadas')
    def rejeitar_instituicoes(self, request, queryset):
        # Idealmente, você teria um formulário intermediário para coletar 'observacoes_receita'
        from django.utils import timezone
        for instituicao in queryset.filter(status_cadastro__in=['Pendente', 'Aprovado']): # Pode rejeitar mesmo se já aprovada
            instituicao.status_cadastro = 'Rejeitado'
            # instituicao.observacoes_receita = "Rejeitado via admin action" # Adicionar observação
            instituicao.data_aprovacao = None # Limpar data de aprovação
            instituicao.id_usuario_aprovador = request.user
            instituicao.save()
        self.message_user(request, f"{queryset.filter(status_cadastro='Rejeitado').count()} instituições rejeitadas.")


@admin.register(Requisicao)
class RequisicaoAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_nome_instituicao', 'status_requisicao', 'data_requisicao', 'get_analista_email', 'data_analise_formatada')
    list_filter = ('status_requisicao', 'data_requisicao', 'id_instituicao')
    search_fields = ('id_instituicao__nome_instituicao', 'finalidade_projeto', 'observacoes_receita')
    ordering = ('-data_requisicao',)
    date_hierarchy = 'data_requisicao'
    inlines = [ItemRequisicaoInline]
    readonly_fields = ('data_requisicao', 'data_analise', 'id_instituicao', 'id_usuario_analise') # Campos preenchidos por lógica
    actions = ['aprovar_requisicoes', 'rejeitar_requisicoes', 'atender_requisicoes']

    @admin.display(description='Instituição', ordering='id_instituicao__nome_instituicao')
    def get_nome_instituicao(self, obj):
        return obj.id_instituicao.nome_instituicao

    @admin.display(description='Analista', ordering='id_usuario_analise__email')
    def get_analista_email(self, obj):
        if obj.id_usuario_analise:
            return obj.id_usuario_analise.email
        return "-"

    @admin.display(description='Data Análise/Atend.')
    def data_analise_formatada(self, obj):
        if obj.data_analise:
            return obj.data_analise.strftime("%d/%m/%Y %H:%M")
        return "-"

    # Actions para Requisicao (aprovar, rejeitar, atender)
    # Estas são simplificadas; o ideal seria usar a lógica das views/serializers para consistência.
    # No entanto, para operações em massa no admin, podem ser úteis.
    # CUIDADO: Estas actions podem não disparar toda a lógica de negócio (ex: atualização de estoque)
    # que está nas suas views. Considere redirecionar para as actions da API ou replicar a lógica aqui.

    @admin.action(description='Aprovar requisições selecionadas')
    def aprovar_requisicoes(self, request, queryset):
        from django.utils import timezone
        updated_count = 0
        for req in queryset.filter(status_requisicao='Pendente'):
            req.status_requisicao = 'Aprovada'
            req.id_usuario_analise = request.user
            req.data_analise = timezone.now()
            req.save()
            updated_count += 1
        self.message_user(request, f"{updated_count} requisições aprovadas.")

    @admin.action(description='Rejeitar requisições selecionadas')
    def rejeitar_requisicoes(self, request, queryset):
        from django.utils import timezone
        updated_count = 0
        for req in queryset.filter(status_requisicao='Pendente'):
            req.status_requisicao = 'Rejeitada'
            req.id_usuario_analise = request.user
            req.data_analise = timezone.now()
            # req.observacoes_receita = "Rejeitada via admin action" # Adicionar observação
            req.save()
            updated_count += 1
        self.message_user(request, f"{updated_count} requisições rejeitadas.")

    @admin.action(description='Marcar como Atendidas (CUIDADO: SEM BAIXA DE ESTOQUE AQUI)')
    def atender_requisicoes(self, request, queryset):
        # ATENÇÃO: Esta action de exemplo NÃO executa a lógica de baixa de estoque.
        # A lógica de baixa de estoque está na sua API.
        # Para uma funcionalidade completa no admin, seria necessário replicar essa lógica
        # ou criar um mecanismo para chamar a lógica da API.
        from django.utils import timezone
        updated_count = 0
        for req in queryset.filter(status_requisicao='Aprovada'):
            req.status_requisicao = 'Atendida'
            # Não estamos atualizando id_usuario_analise aqui, pois poderia ser diferente do aprovador
            req.data_analise = timezone.now() # Ou uma nova data de atendimento
            req.save()
            updated_count += 1
        self.message_user(request, f"{updated_count} requisições marcadas como atendidas (sem baixa de estoque automática via admin).")


# Registro simples para modelos que não necessitam de personalização complexa imediata
# ou são melhor gerenciados como inlines.
# admin.site.register(VapeComponente) # Já está como inline em VapeAdmin
# admin.site.register(ItemRequisicao) # Já está como inline em RequisicaoAdmin
