from django.contrib import admin

from django.contrib import admin
from .models import (
    Usuario, Vape, Componente, VapeComponente, EstoqueComponente,
    HistoricoEstoque, Instituicao, Requisicao, ItemRequisicao
)

admin.site.register(Usuario)
admin.site.register(Vape)
admin.site.register(Componente)
admin.site.register(VapeComponente)
admin.site.register(EstoqueComponente)
admin.site.register(HistoricoEstoque)
admin.site.register(Instituicao)
admin.site.register(Requisicao)
admin.site.register(ItemRequisicao)