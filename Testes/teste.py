import pandas as pd
from datetime import datetime


csv_path = 'REAG._SÓLIDOS.csv'


colunas = [
    'descricao',                 
    'codigo',                     
    'nome',                       
    'fabricante',                 
    'quantidadeMedida',                   
    'ocorrencia',
    'dataValidade',                              
    'quantidadeEstoqueFechado',  # Ex: 0
    'estoqueMinimo',             # Ex: 1
    'localizacao',
    'ativo',                     # Ex: False
    'dataVerificacao',           # Ex: 2024-01-01
    'observacoes'                # Texto livre
]

# Carregar CSV sem cabeçalho original
df = pd.read_csv(csv_path, header=None, names=colunas, skiprows=3)

#Formatações
def format_str(s):
    if pd.isna(s) or str(s).strip() == '':
        return 'NULL'
    s = str(s).replace("'", "''")  
    return f"'{s}'"

def format_int(x):
    try:
        return int(x)
    except:
        return 0

def format_bool(x):
    if str(x).strip().lower() in ['true', '1']:
        return 1
    return 0

def format_date(x):
    try:
        d = pd.to_datetime(x, dayfirst=True, errors='coerce')
        if pd.isnull(d):
            return 'NULL'
        return f"'{d.strftime('%Y-%m-%d %H:%M:%S')}'"
    except:
        return 'NULL'

# Valores fixos
fornecedor_id = 'NULL'       
tipo_produto_id = 1

# Gerar comandos SQL
sql_lines = ["-- Inserindo dados em Produto"]
for _, row in df.iterrows():
    values = [
        format_str(row['descricao']),
        format_str(row['codigo']),
        format_str(row['nome']),
        format_str(row['fabricante']),
        format_str(row['quantidadeMedida']),
        format_str(row['ocorrencia']),
        format_date(row['dataValidade']),
        format_str(row['quantidadeEstoqueFechado']),
        format_str(row['estoqueMinimo']),
        format_str(row['localizacao']),
        format_bool(row['ativo']),
        format_date(row['dataVerificacao']),  
        format_str(row['observacoes']),
        fornecedor_id,
        tipo_produto_id
    ]
    
    sql = f"INSERT INTO Produto (descricao, codigo, nome, fabricante, quantidadeMedida, ocorrencia, dataValidade, quantidadeEstoqueFechado, estoqueMinimo, localizacao, ativo, dataVerificacao, observacoes, fornecedor_id, tipo_produto_id) VALUES ({', '.join(map(str, values))});"
    sql_lines.append(sql)

# Escrever para arquivo .sql
with open('inserir_produtos.sql', 'w', encoding='utf-8') as f:
    f.write('\n'.join(sql_lines))

print("Arquivo SQL gerado com sucesso: inserir_produtos.sql")