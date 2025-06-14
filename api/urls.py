from django.urls import path
from . import views

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioRegistroView,
    CustomTokenObtainPairView,
    UsuarioDetailView,
    EstoqueComponentePublicoView,
    VapeViewSet,
    InstituicaoViewSet,
    RequisicaoViewSet,
    ComponenteViewSet,
    HistoricoEstoqueViewSet
)
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'vapes', VapeViewSet, basename='vape')
router.register(r'componentes', ComponenteViewSet, basename='componente')
router.register(r'instituicoes', InstituicaoViewSet, basename='instituicao')
router.register(r'requisicoes', RequisicaoViewSet, basename='requisicao')
router.register(r'historico-estoque', HistoricoEstoqueViewSet, basename='historicoestoque')

urlpatterns = [
    # Rotas de Autenticação e Usuário
    path('auth/register/', UsuarioRegistroView.as_view(), name='usuario_registro'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', UsuarioDetailView.as_view(), name='usuario_detalhe'), 
    path('usuarios/<int:pk>/', UsuarioDetailView.as_view(), name='usuario_detalhe_por_pk'),
    path('estoque-componentes/publico/', EstoqueComponentePublicoView.as_view(), name='estoque_publico'),
    path('', include(router.urls)),
]
