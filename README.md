# Hackathon-Receita-Federal

## Sistema de Gerenciamento de Vapes Apreendidos e Componentes (Backend API)

Este projeto é uma API backend desenvolvida em Python com Django e Django REST Framework para gerenciar vapes apreendidos, seus componentes, o estoque desses componentes, e o processo de requisição por instituições, com diferentes níveis de acesso e funcionalidades para usuários da Receita Federal, Instituições e público em geral.

## Funcionalidades Principais

* **Gerenciamento de Usuários e Autenticação:**
    * Registro de usuários (Público, Instituição, Receita Federal).
    * Autenticação baseada em JWT (JSON Web Tokens) com tokens de acesso e atualização.
    * Endpoint para visualização de dados do próprio usuário (`/auth/me/`).
* **Cadastro e Gerenciamento de Vapes:**
    * Registro de vapes apreendidos (tipo, marca, modelo, quantidade, data da apreensão).
    * Associação de componentes a cada vape registrado.
* **Controle de Componentes e Estoque:**
    * Cadastro de tipos de componentes de vapes (nome, unidade de medida).
    * Atualização automática do estoque de componentes com base no registro de vapes (entrada) e atendimento de requisições (saída).
    * Consulta pública do estoque de componentes.
* **Histórico de Movimentação de Estoque:**
    * Registro de todas as entradas, saídas e ajustes no estoque de componentes.
* **Gerenciamento de Instituições:**
    * Solicitação de cadastro de instituições por usuários do tipo "Público".
    * Aprovação ou rejeição de cadastros de instituições por usuários da "Receita Federal".
    * Atualização do tipo de usuário para "Instituição" após aprovação.
* **Sistema de Requisições de Componentes:**
    * Criação de requisições de componentes por instituições aprovadas.
    * Listagem e visualização de requisições com filtros por status e instituição.
    * Análise (aprovação, rejeição) e atendimento de requisições pela "Receita Federal".
    * Atualização do estoque ao atender uma requisição.
* **Controle de Acesso Baseado em Papéis (RBAC):**
    * Permissões granulares para diferentes tipos de usuários (Público, Instituição, Receita Federal) em cada endpoint e ação.
* **API RESTful:**
    * Endpoints bem definidos para todas as funcionalidades, utilizando as melhores práticas do DRF.
    * Paginação, filtros e ordenação para listagens.

## Tech Stack

* **Linguagem:** Python 3.x
* **Framework Backend:** Django
* **API:** Django REST Framework (DRF)
* **Autenticação:** Django REST Framework Simple JWT
* **Banco de Dados:** MySQL (configurado para SQLite para desenvolvimento inicial)
* **Gerenciamento de Dependências:** Pip

## Estrutura do Projeto

O projeto segue a estrutura padrão do Django:

* `core_project/`: Diretório principal do projeto Django, contendo as configurações (`settings.py`, `urls.py` principal).
* `api/`: Aplicação Django que contém toda a lógica de negócio, modelos, views, serializers e URLs da API.
* `manage.py`: Utilitário de linha de comando do Django.

## Configuração e Instalação Local

Siga os passos abaixo para configurar e rodar o projeto localmente:

**Pré-requisitos:**

* Python 3.8+
* Pip (gerenciador de pacotes Python)
* Git
* (Opcional, mas recomendado) Um ambiente virtual (venv ou conda)

**Passos:**

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO_GIT>
    cd <NOME_DA_PASTA_DO_PROJETO>
    ```

2.  **Crie e ative um ambiente virtual:**
    ```bash
    python -m venv venv
    # No Windows
    venv\Scripts\activate
    # No macOS/Linux
    source venv/bin/activate
    ```

3.  **Instale as dependências:**
    Instale:
    ```bash
    pip install -r requirements.txt
    ```
    As dependências principais são: `django`, `djangorestframework`, `djangorestframework-simplejwt`, `mysqlclient`

4.  **Configure as Variáveis de Ambiente e o `settings.py`:**
    * **Chave Secreta:** Abra o arquivo `core_project/settings.py` e defina uma `SECRET_KEY` segura.
        ```python
        SECRET_KEY = 'sua-chave-secreta-super-forte-aqui!'
        ```
    * **Banco de Dados:** Configure a seção `DATABASES` em `core_project/settings.py` para o seu banco de dados (MySQL ou outro). O padrão está configurado para SQLite (`db.sqlite3`) para facilitar o início. Crie seu banco de dados utilizando o script banco-de-dados.sql.

5.  **Aplique as migrações do banco de dados:**
    ```bash
    python manage.py makemigrations api
    python manage.py migrate
    ```

6.  **Crie um superusuário (para acesso ao Django Admin):**
    ```bash
    python manage.py createsuperuser
    ```
    Siga as instruções para definir nome de usuário, email e senha.

7.  **Rode o servidor de desenvolvimento:**
    ```bash
    python manage.py runserver
    ```
    A API estará acessível em `http://127.0.0.1:8000/api/v1/`.

## Visão Geral dos Endpoints da API

A API está versionada e acessível sob o prefixo `/api/v1/`.

**Autenticação e Usuários:**

* `POST /api/v1/auth/register/`: Registro de novos usuários (padrão: Público).
* `POST /api/v1/auth/login/`: Login para obter tokens JWT.
* `POST /api/v1/auth/refresh/`: Obter um novo token de acesso usando um token de atualização.
* `GET /api/v1/auth/me/`: Detalhes do usuário autenticado.
* `GET /api/v1/usuarios/<id>/`: (Receita Federal) Detalhes de um usuário específico.

**Público:**

* `GET /api/v1/estoque-componentes/publico/`: Lista pública do estoque de componentes.

**Vapes (Acesso: Receita Federal):**

* `GET, POST /api/v1/vapes/`
* `GET, PUT, PATCH, DELETE /api/v1/vapes/<id>/`

**Componentes (Acesso: Receita Federal):**

* `GET, POST /api/v1/componentes/`
* `GET, PUT, PATCH, DELETE /api/v1/componentes/<id>/`

**Instituições:**

* `POST /api/v1/instituicoes/`: (Usuário Público Autenticado) Solicitar cadastro de instituição.
* `GET /api/v1/instituicoes/`: (Receita Federal) Listar todas as instituições; (Usuário Instituição/Público) Ver sua própria instituição/solicitação.
* `GET, PUT, PATCH /api/v1/instituicoes/<id>/`: (Receita Federal ou Dono) Ver, atualizar detalhes.
* `DELETE /api/v1/instituicoes/<id>/`: (Receita Federal) Deletar instituição.
* `PUT /api/v1/instituicoes/<id>/aprovar/`: (Receita Federal) Aprovar cadastro de instituição.
* `PUT /api/v1/instituicoes/<id>/rejeitar/`: (Receita Federal) Rejeitar cadastro de instituição.

**Requisições de Componentes:**

* `POST /api/v1/requisicoes/`: (Instituição Aprovada) Criar nova requisição.
* `GET /api/v1/requisicoes/`: (Receita Federal) Listar todas; (Instituição) Listar as suas.
* `GET, PUT, PATCH /api/v1/requisicoes/<id>/`: (Receita Federal ou Dono da Instituição sob condições) Ver, atualizar detalhes.
    * Instituições podem apenas cancelar requisições pendentes.
* `DELETE /api/v1/requisicoes/<id>/`: (Receita Federal ou Dono da Instituição sob condições).
* `PUT /api/v1/requisicoes/<id>/aprovar/`: (Receita Federal) Aprovar requisição.
* `PUT /api/v1/requisicoes/<id>/rejeitar/`: (Receita Federal) Rejeitar requisição.
* `PUT /api/v1/requisicoes/<id>/atender/`: (Receita Federal) Marcar requisição como atendida e dar baixa no estoque.

**Histórico de Estoque (Acesso: Receita Federal):**

* `GET /api/v1/historico-estoque/`: Listar histórico de movimentações, com filtros por componente, tipo de movimento e data.


```bash
python manage.py test api
