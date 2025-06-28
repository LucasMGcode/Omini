-- Adiciona a coluna 'controlado_pela_PF' à tabela Produto
ALTER TABLE Produto
ADD controlado_pela_PF BIT NOT NULL DEFAULT 0;