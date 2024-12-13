# Repositórios

## 1. **API Rest** (`api-rest`)

Este repositório contém a implementação de uma API RESTful para o gerenciamento de pedidos, desenvolvida utilizando as melhores práticas de design de software, incluindo **Domain-Driven Design (DDD)**, **Arquitetura Hexagonal**, **Clean Architecture** e padrões de projeto como **State Design Pattern**. A API está configurada para ser executada com Docker Compose.


## 2. **Kubernetes Infrastructure as Code (`k8s-iac`)

Este repositório contém a infraestrutura necessária para criar um cluster Kubernetes no Amazon EKS utilizando o Terraform. Ele automatiza o processo de provisionamento e configuração da infraestrutura na AWS, com arquivos separados para a configuração do cluster, nós e rede.

- **Estrutura**: Contém arquivos `.tf` para criação do cluster EKS, VPC e configuração dos nós.
- **Instruções de execução**: Execute o Terraform para inicializar, aplicar e destruir a infraestrutura.

## 3. **RDS Infrastructure as Code**  (`rds-iac`)

Este repositório contém a configuração do Terraform para criar uma instância RDS e um grupo de sub-redes (subnet group) na AWS. A configuração cria um grupo de sub-redes privadas e uma instância de banco de dados dentro desse grupo de sub-redes.

---

Cada repositório foca em uma parte do projeto.