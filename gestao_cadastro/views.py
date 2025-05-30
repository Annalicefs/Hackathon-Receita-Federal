from django.shortcuts import render

# Create your views here.
def nova_solicitacao(request):
    return render(request, 'gestao_cadastro/nova_solicitacao.html')