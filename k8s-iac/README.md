# EKS Cluster com Terraform

Este repositório contém os arquivos necessários para criar um cluster Kubernetes no Amazon EKS (Elastic Kubernetes Service) utilizando o Terraform.

## Descrição

O objetivo deste repositório é automatizar a criação de um cluster EKS na AWS utilizando o Terraform, uma ferramenta de infraestrutura como código. O repositório organiza os arquivos de configuração em módulos distintos para facilitar a manutenção e personalização da infraestrutura.

## Estrutura dos Arquivos

- **cluster.tf**: Configuração do cluster EKS e seus componentes principais.
- **nodes.tf**: Configuração dos nós do EKS, incluindo o grupo de nós e suas propriedades.
- **vpc.tf**: Configuração da VPC (Virtual Private Cloud), sub-redes e outros recursos de rede necessários para o cluster.
- **variables.tf**: Declaração das variáveis para personalizar a configuração do cluster, como tamanhos de instâncias, regiões e nomes.
- **outputs.tf**: Definição de variáveis de saída, como o endpoint e o ARN do cluster EKS.
- **providers.tf**: Configuração do provedor AWS para autenticação e interação com a conta 


### 1. Inicialize o Terraform

Antes de aplicar qualquer configuração, inicialize o Terraform para baixar os provedores e dependências necessários:

```bash
terraform init
```

### 2. Verifique o plano de execução

Antes de aplicar as mudanças, você pode revisar o plano de execução para garantir que tudo esteja correto:

```bash
terraform plan
```

### 3. Aplique a configuração

Para criar os recursos, aplique o plano do Terraform. Isso criará o cluster EKS e todos os componentes necessários na AWS:

```bash
terraform apply
```

### 4. Limpeza

Para destruir os recursos criados pelo Terraform e evitar custos adicionais, basta rodar o seguinte comando:

```bash
terraform destroy
```