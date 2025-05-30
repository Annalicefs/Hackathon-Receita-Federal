from django.urls import path
from . import views

urlpatterns = [
    path('nova/', views.nova_solicitacao, name='nova_solicitacao'),
]
