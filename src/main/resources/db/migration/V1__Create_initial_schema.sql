-- Tabela PerfilUsuario
CREATE TABLE PerfilUsuario (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao VARCHAR(255)
);

-- Tabela Usuario
CREATE TABLE Usuario (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    nomeCompleto VARCHAR(100) NOT NULL,
    login VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL, -- Armazenar o hash da senha
    email VARCHAR(100) NOT NULL UNIQUE,
    perfil_id BIGINT NOT NULL,
    ativo BIT NOT NULL DEFAULT 1,
    dataCadastro DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Usuario_Perfil FOREIGN KEY (perfil_id) REFERENCES PerfilUsuario(id)
);

-- Tabela Fornecedor
CREATE TABLE Fornecedor (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    razaoSocial VARCHAR(150) NOT NULL,
    nomeFantasia VARCHAR(150),
    cnpj VARCHAR(18) UNIQUE, -- Formato XX.XXX.XXX/XXXX-XX
    contatoPrincipalNome VARCHAR(100),
    contatoPrincipalTelefone VARCHAR(20),
    contatoPrincipalEmail VARCHAR(100),
    endereco VARCHAR(255),
    observacoes VARCHAR(MAX),
    ativo BIT NOT NULL DEFAULT 1
);

-- Tabela TipoProduto
CREATE TABLE TipoProduto (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE, -- Ex: Reagente Químico, Vidraria, EPI, Limpeza
    descricao VARCHAR(255)
);

-- Tabela Produto
CREATE TABLE Produto (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao VARCHAR(MAX),
    codigoInterno VARCHAR(50) UNIQUE,
    numeroLote VARCHAR(50),
    marca VARCHAR(100),
    fabricante VARCHAR(100),
    fornecedor_id BIGINT,
    tipo_produto_id BIGINT, -- Chave estrangeira para TipoProduto
    unidadeMedida VARCHAR(20),
    quantidadeEstoque INT NOT NULL DEFAULT 0,
    estoqueMinimo INT NOT NULL DEFAULT 0,
    dataValidade DATE,
    dataEntrada DATETIME2, -- Data da primeira entrada ou da entrada do lote atual
    localizacao VARCHAR(100),
    observacoes VARCHAR(MAX),
    ativo BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_Produto_Fornecedor FOREIGN KEY (fornecedor_id) REFERENCES Fornecedor(id),
    CONSTRAINT FK_Produto_TipoProduto FOREIGN KEY (tipo_produto_id) REFERENCES TipoProduto(id)
);

-- Tabela MovimentacaoEstoque
CREATE TABLE MovimentacaoEstoque (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    produto_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    tipoMovimentacao VARCHAR(20) NOT NULL,
    quantidade INT NOT NULL,
    dataMovimentacao DATETIME2 NOT NULL DEFAULT GETDATE(),
    justificativa VARCHAR(255),
    projetoAssociado VARCHAR(100),
    observacoes VARCHAR(MAX),
    CONSTRAINT FK_Movimentacao_Produto FOREIGN KEY (produto_id) REFERENCES Produto(id),
    CONSTRAINT FK_Movimentacao_Usuario FOREIGN KEY (usuario_id) REFERENCES Usuario(id),
    CONSTRAINT CK_TipoMovimentacao CHECK (tipoMovimentacao IN (
        'ENTRADA', 
        'SAIDA_USO', 
        'SAIDA_DESCARTE', 
        'AJUSTE_POSITIVO', 
        'AJUSTE_NEGATIVO'
    ))
);

-- Tabela Alerta
CREATE TABLE Alerta (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    produto_id BIGINT NOT NULL,
    tipoAlerta VARCHAR(20) NOT NULL,
    dataGeracao DATETIME2 NOT NULL DEFAULT GETDATE(),
    mensagem VARCHAR(500) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    dataVisualizacao DATETIME2,
    dataResolucao DATETIME2,
    CONSTRAINT FK_Alerta_Produto FOREIGN KEY (produto_id) REFERENCES Produto(id),
    CONSTRAINT CK_TipoAlerta CHECK (tipoAlerta IN ('ESTOQUE_MINIMO', 'VALIDADE_PROXIMA')),
    CONSTRAINT CK_StatusAlerta CHECK (status IN ('PENDENTE', 'VISUALIZADO', 'RESOLVIDO'))
);

-- Inserções iniciais opcionais para PerfilUsuario
INSERT INTO PerfilUsuario (nome, descricao) VALUES ('Administrador', 'Acesso total ao sistema');
INSERT INTO PerfilUsuario (nome, descricao) VALUES ('Supervisor', 'Pode cadastrar produtos, atualizar estoque, receber alertas e emitir relatórios');
INSERT INTO PerfilUsuario (nome, descricao) VALUES ('Funcionário', 'Pode apenas registrar retiradas de estoque e consultar produtos');

-- Inserções iniciais opcionais para TipoProduto
INSERT INTO TipoProduto (nome, descricao) VALUES ('Reagente Químico', 'Substâncias utilizadas em reações químicas.');
INSERT INTO TipoProduto (nome, descricao) VALUES ('Vidraria', 'Equipamentos de vidro utilizados em laboratório.');
INSERT INTO TipoProduto (nome, descricao) VALUES ('EPI', 'Equipamentos de Proteção Individual.');
INSERT INTO TipoProduto (nome, descricao) VALUES ('Material de Limpeza', 'Produtos utilizados para limpeza e higienização do laboratório.');
INSERT INTO TipoProduto (nome, descricao) VALUES ('Material de Escritório', 'Itens de escritório para uso no laboratório.');

PRINT 'Tabelas criadas com sucesso (versão com TipoProduto normalizado)!';