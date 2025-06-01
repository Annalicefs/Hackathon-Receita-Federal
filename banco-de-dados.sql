-- Tabela de Usuários
CREATE TABLE USUARIOS (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    -- 'Publico' é o tipo inicial para quem se cadastra visando se tornar Instituição.
    -- O 'tipo_usuario' de um Usuário pode ser atualizado para 'Instituicao' após a aprovação da instituição.
    tipo_usuario VARCHAR(50) NOT NULL CHECK (tipo_usuario IN ('Receita Federal', 'Instituicao', 'Publico')),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Vapes
CREATE TABLE VAPES (
    id_vape INT AUTO_INCREMENT PRIMARY KEY,
    tipo_vape VARCHAR(100) NOT NULL,
    marca VARCHAR(100),
    modelo VARCHAR(100),
    quantidade INTEGER NOT NULL CHECK (quantidade > 0), -- Quantidade de unidades físicas de Vapes
    data_apreensao DATE NOT NULL,
    observacoes TEXT,
    id_usuario_cadastro INTEGER NOT NULL,
    CONSTRAINT fk_usuario_cadastro
        FOREIGN KEY (id_usuario_cadastro)
        REFERENCES USUARIOS(id_usuario)
);

-- Tabela de Componentes
CREATE TABLE COMPONENTES (
    id_componente INT AUTO_INCREMENT PRIMARY KEY,
    nome_componente VARCHAR(100) UNIQUE NOT NULL,
    descricao TEXT,
    unidade_medida VARCHAR(50) NOT NULL -- Ex: 'unidades', 'gramas', 'ml'
);

-- Tabela de Ligação entre Vapes e Componentes (Vape_Componente)
CREATE TABLE VAPE_COMPONENTE (
    id_vape_componente INT AUTO_INCREMENT PRIMARY KEY,
    id_vape INTEGER NOT NULL,
    id_componente INTEGER NOT NULL,
    quantidade_por_vape INTEGER NOT NULL CHECK (quantidade_por_vape >= 0),
    CONSTRAINT fk_vape
        FOREIGN KEY (id_vape)
        REFERENCES VAPES(id_vape),
    CONSTRAINT fk_componente
        FOREIGN KEY (id_componente)
        REFERENCES COMPONENTES(id_componente),
    UNIQUE (id_vape, id_componente) -- Garante que um par vape-componente é único
);

-- Tabela de Estoque de Componentes
CREATE TABLE ESTOQUE_COMPONENTES (
    id_estoque_componente INT AUTO_INCREMENT PRIMARY KEY,
    id_componente INTEGER UNIQUE NOT NULL,
    quantidade_total INTEGER NOT NULL CHECK (quantidade_total >= 0),
    data_ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_componente_estoque
        FOREIGN KEY (id_componente)
        REFERENCES COMPONENTES(id_componente)
);

-- Nova Tabela: Histórico de Estoque
CREATE TABLE HISTORICO_ESTOQUE (
    id_historico_estoque INT AUTO_INCREMENT PRIMARY KEY,
    id_componente INTEGER NOT NULL,
    tipo_movimento VARCHAR(50) NOT NULL CHECK (tipo_movimento IN ('Entrada', 'Saida', 'Ajuste')),
    quantidade_movimentada INTEGER NOT NULL CHECK (quantidade_movimentada > 0),
    data_movimento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- id_referencia_origem pode apontar para id_vape_componente (entrada) ou id_item_requisicao (saída).
    -- Não é uma FK estrita no nível do DB porque pode referenciar duas tabelas diferentes.
    -- A validação de qual tabela ele referencia e se o ID existe deve ser feita na aplicação.
    id_referencia_origem INTEGER,
    observacoes TEXT,
    CONSTRAINT fk_componente_historico
        FOREIGN KEY (id_componente)
        REFERENCES COMPONENTES(id_componente)
);

-- Tabela de Instituições
CREATE TABLE INSTITUICOES (
    id_instituicao INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INTEGER UNIQUE NOT NULL,
    nome_instituicao VARCHAR(255) UNIQUE NOT NULL, -- Nome oficial / Razão Social
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    email_contato VARCHAR(255),
    area_atuacao TEXT NOT NULL,
    status_cadastro VARCHAR(50) NOT NULL CHECK (status_cadastro IN ('Pendente', 'Aprovado', 'Rejeitado')),
    data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_aprovacao TIMESTAMP,
    id_usuario_aprovador INTEGER,
    -- Para o formulário/documento de solicitação de cadastro da instituição assinado
    path_solicitacao_cadastro_assinada VARCHAR(255),
    -- Campos para documentos (são opcionais dependendo do tipo de entidade)
    -- A aplicação avisará sobre a necessidade para OSCs.
    path_estatuto VARCHAR(255),
    path_ata_eleicao_dirigentes VARCHAR(255),
    path_comprovante_endereco_funcionamento VARCHAR(255),
    path_declaracao_regularidade VARCHAR(255),
    CONSTRAINT fk_usuario_instituicao
        FOREIGN KEY (id_usuario)
        REFERENCES USUARIOS(id_usuario),
    CONSTRAINT fk_usuario_aprovador_instituicao
        FOREIGN KEY (id_usuario_aprovador)
        REFERENCES USUARIOS(id_usuario)
);

-- Tabela de Requisições (Representa a requisição geral)
CREATE TABLE REQUISICOES (
    id_requisicao INT AUTO_INCREMENT PRIMARY KEY,
    id_instituicao INTEGER NOT NULL,
    responsavel_solicitacao VARCHAR(255) NOT NULL,
    justificativa TEXT,
    titulo_projeto VARCHAR(100),
    data_requisicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_requisicao VARCHAR(50) NOT NULL CHECK (status_requisicao IN ('Pendente', 'Aprovada', 'Rejeitada', 'Atendida', 'Cancelada')),
    finalidade_projeto TEXT NOT NULL,
    observacoes_receita TEXT,
    id_usuario_analise INTEGER, -- FK para o usuário da Receita Federal que analisou a requisição
    data_analise TIMESTAMP,
    path_documento_solicitacao_assinada VARCHAR(255), -- Para o documento de solicitação assinado, se houver
    CONSTRAINT fk_instituicao_requisicao
        FOREIGN KEY (id_instituicao)
        REFERENCES INSTITUICOES(id_instituicao),
    CONSTRAINT fk_usuario_analise_requisicao
        FOREIGN KEY (id_usuario_analise)
        REFERENCES USUARIOS(id_usuario)
);

-- Tabela: Itens da Requisição (Detalhes dos componentes solicitados em cada requisição)
CREATE TABLE ITENS_REQUISICAO (
    id_item_requisicao INT AUTO_INCREMENT PRIMARY KEY,
    id_requisicao INTEGER NOT NULL,         -- Chave estrangeira para REQUISICOES
    id_componente INTEGER NOT NULL,         -- Chave estrangeira para COMPONENTES
    quantidade_solicitada INTEGER NOT NULL CHECK (quantidade_solicitada > 0),
    CONSTRAINT fk_requisicao_item
        FOREIGN KEY (id_requisicao)
        REFERENCES REQUISICOES(id_requisicao) ON DELETE CASCADE, -- Se a requisição for deletada, seus itens também são.
    CONSTRAINT fk_componente_item
        FOREIGN KEY (id_componente)
        REFERENCES COMPONENTES(id_componente),
    UNIQUE (id_requisicao, id_componente) -- Garante que um componente seja solicitado apenas uma vez por requisição
);

-- Índices para otimização de consultas comuns
-- É importante que as tabelas existam antes de criar os índices.
-- Portanto, execute os CREATE TABLE primeiro e depois os CREATE INDEX.

CREATE INDEX idx_vapes_data_apreensao ON VAPES (data_apreensao);
CREATE INDEX idx_estoque_componentes_componente ON ESTOQUE_COMPONENTES (id_componente);
CREATE INDEX idx_historico_estoque_componente ON HISTORICO_ESTOQUE (id_componente);
CREATE INDEX idx_instituicoes_status_cadastro ON INSTITUICOES (status_cadastro);
CREATE INDEX idx_requisicoes_instituicao ON REQUISICOES (id_instituicao);
CREATE INDEX idx_requisicoes_status ON REQUISICOES (status_requisicao);
CREATE INDEX idx_itens_requisicao_requisicao ON ITENS_REQUISICAO (id_requisicao);
CREATE INDEX idx_itens_requisicao_componente ON ITENS_REQUISICAO (id_componente);
