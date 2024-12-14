# RDS Instance and Subnet Group Setup

Este repositório contém a configuração do Terraform para criar uma instância RDS e um grupo de sub-redes (subnet group) na AWS. A configuração cria um grupo de sub-redes privadas e uma instância de banco de dados dentro desse grupo de sub-redes.

## Componentes

### 1. `aws_db_subnet_group`
- Cria um grupo de sub-redes (subnet group) dentro de uma VPC para ser utilizado por uma instância RDS.
- As sub-redes privadas são recuperadas através do datasource da AWS.

### 2. `aws_db_instance`
- Cria uma instância RDS com configurações personalizáveis, como o nome do banco de dados, classe da instância, tipo de banco de dados e credenciais de acesso.
- A instância é criada dentro do grupo de sub-redes definido anteriormente.

## Variáveis de Entrada

### `var.prefix`
- Prefixo utilizado para nomear recursos, como grupos de sub-redes e a instância RDS.

### `var.private_subnet_ids`
- IDs das sub-redes privadas dentro da VPC onde o banco de dados será criado.

### `var.db_name`
- Nome do banco de dados inicial a ser criado na instância RDS.

### `var.engine`
- O motor do banco de dados (ex: `postgres`, `mysql`).

### `var.engine_version`
- A versão do motor do banco de dados.

### `var.instance_class`
- Classe da instância RDS (ex: `db.t3.micro`).

### `var.db_username`
- Nome de usuário do banco de dados.

### `var.db_password`
- Senha do banco de dados.

