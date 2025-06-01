from rest_framework import permissions
from .models import Instituicao 

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
        if request.method in permissions.SAFE_METHODS: # GET, HEAD, OPTIONS
            return True
        return bool(request.user and request.user.is_authenticated)


class IsOwnerInstituicaoRequisicao(permissions.BasePermission):
    """
    Permissão para verificar se o usuário da instituição é o "dono" da requisição.
    Usado para object-level permission.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.tipo_usuario == 'Receita Federal':
            return True

        if request.user.tipo_usuario == 'Instituicao':
            try:
                instituicao_do_usuario = Instituicao.objects.get(id_usuario=request.user)
                return obj.id_instituicao == instituicao_do_usuario
            except Instituicao.DoesNotExist:
                return False
        return False