# API Gateway Serverless

Este projeto utiliza o **Serverless Framework** para criar uma API Gateway com autenticação e proxy, hospedada na AWS. Ele integra o **Amazon Cognito** para gerenciar usuários e autenticação, além de definir limites de requisições.

## Estrutura

- **AWS Lambda Functions:**
  - `auth`: Endpoint para autenticação de usuários (`POST /auth`).
  - `proxy`: Proxy para redirecionar requisições para outros serviços com autorização customizada.
  - `authorizerFn`: Função personalizada para autorizar requisições.

- **API Gateway:**
  - Configurado com um limite de requisições mensais (10.000) e throttling (200 requisições simultâneas, 50 por segundo).
  - Suporta CORS e usa um **custom authorizer**.

- **Cognito:**
  - **UserPool** e **UserPoolClient** são criados para gerenciar usuários.
  - **IdentityPool** é configurado para permitir autenticação via Cognito.

## Recursos Criados

- **Cognito User Pool**: Para gerenciamento de usuários.
- **Cognito User Pool Client**: Configuração para o acesso do aplicativo ao pool de usuários.
- **Cognito Identity Pool**: Permite autenticação com identidades de usuários.

## Ambiente

As variáveis de ambiente são configuradas para:

- `API_BASE_URL`: URL base da API.
- `COGNITO_USER_POOL_ID`: ID do User Pool do Cognito.
- `COGNITO_APP_CLIENT_ID`: ID do Client do Cognito.

## Requisitos

- **Node.js 20.x**
- **AWS CLI configurado**
- **Serverless Framework** instalado

## Comandos úteis

- Para rodar localmente:  
  `serverless offline start`
  
- Para implantar na AWS:  
  `serverless deploy`

## Configuração de Quotas e Limites

A API possui limites de requisições configurados no **usagePlan**:

- **Limite mensal**: 10.000 requisições.
- **Limite de requisições simultâneas**: 200 requisições.
- **Limite de requisições por segundo**: 50 requisições.

---

Esse arquivo README oferece uma visão geral do projeto, configurando as funções Lambda, API Gateway, e integração com o Cognito para autenticação e controle de acesso.
