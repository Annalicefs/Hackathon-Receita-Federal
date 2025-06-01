# api/permissions.py
from rest_framework import permissions
from .models import Instituicao # Necessário para a verificação em IsInstituicao

class IsReceitaFederal(permissions.BasePermission):
    """
    Permite acesso apenas a usuários autenticados do tipo 'Receita Federal'.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.tipo_usuario == 'Receita Federal')

class IsInstituicao(permissions.BasePermission):
    """
    Permite acesso apenas a usuários autenticados do tipo 'Instituicao'
    e que estejam vinculados a uma instituição aprovada.
    """
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated and request.user.tipo_usuario == 'Instituicao'):
            return False
        # Verifica se o usuário da instituição está vinculado a uma instituição APROVADA
        return Instituicao.objects.filter(id_usuario=request.user, status_cadastro='Aprovado').exists()

class IsPublicoOrAuthenticated(permissions.BasePermission):
    """
    Permite acesso para qualquer usuário autenticado, ou acesso de leitura se for público
    (útil para endpoints que podem ter diferentes permissões para leitura vs escrita).
    Para o caso do EstoqueComponentePublicoView, AllowAny é mais direto se não houver distinção
    baseada em autenticação para leitura. Se for apenas para permitir qualquer um, use AllowAny.
    Esta classe é mais para casos como "qualquer um pode ver, mas só autenticados podem interagir de outras formas".
    """
    def has_permission(self, request, view):
        # Se for uma view pública de leitura, permite
        if request.method in permissions.SAFE_METHODS: # GET, HEAD, OPTIONS
            return True
        # Para outros métodos, requer autenticação
        return bool(request.user and request.user.is_authenticated)


class IsOwnerInstituicaoRequisicao(permissions.BasePermission):
    """
    Permissão para verificar se o usuário da instituição é o "dono" da requisição.
    Usado para object-level permission.
    """
    def has_object_permission(self, request, view, obj):
        # Usuários da Receita Federal podem ver qualquer requisição (tratado em has_permission do viewset)
        if request.user.tipo_usuario == 'Receita Federal':
            return True # Se já passou pelo has_permission, aqui permite
        
        # Para usuários de Instituição, verifica se a requisição pertence à sua instituição
        if request.user.tipo_usuario == 'Instituicao':
            try:
                # obj aqui é uma instância de Requisicao
                instituicao_do_usuario = Instituicao.objects.get(id_usuario=request.user)
                return obj.id_instituicao == instituicao_do_usuario
            except Instituicao.DoesNotExist:
                return False
        return False
