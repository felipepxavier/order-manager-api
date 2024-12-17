import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { CognitoIdentityServiceProvider } from "aws-sdk";
import fetch from "node-fetch";

const cognito = new CognitoIdentityServiceProvider();

type UserDataProps = {
  account_id: string;
  cpf: string;
  email: string;
  name: string;
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("[authenticate] event: ", event);
  const { cpf } = JSON.parse(event.body || "{}");

  if (!cpf) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "CPF is required" }),
    };
  }

  try {
    const userData = await getUserByCPF(cpf);
    console.log("[authenticate] userData: ", userData);

    if (!userData) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: `User with CPF ${cpf} not found in external API` }),
      };
    }

    const cognitoUserExists = await checkCognitoUserExists(cpf);

    let authResult;
    if (!cognitoUserExists) {
      console.log("[authenticate] Creating Cognito user");
      await createCognitoUser(userData);

      authResult = await authenticateWithCognito(cpf, "ProvisionalPassword123!");
    } else {
      console.log("[authenticate] User exists, generating JWT");
      authResult = await authenticateWithCognito(cpf, "NewPassword123!");
    }

    const idToken = authResult?.AccessToken;
    if (!idToken) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to authenticate user in Cognito" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Authentication successful",
        jwt: idToken,
      }),
    };
  } catch (error: any) {
    console.error("[authenticate] Error: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
    };
  }
};

const getUserByCPF = async (cpf: string): Promise<UserDataProps> => {
  const baseUrl = `${process.env.API_BASE_URL}`;
  const response = await fetch(`${baseUrl}/clients/cpf/${cpf}`);

  if (!response.ok) {
    throw new Error("Error fetching user data from external API");
  }

  const data = await response.json() as UserDataProps;
  return data;
};

const checkCognitoUserExists = async (cpf: string): Promise<boolean> => {
  try {
    const params = {
      Username: cpf,
      UserPoolId: process.env.COGNITO_USER_POOL_ID!,
    };

    await cognito.adminGetUser(params).promise();
    return true; // Usuário encontrado no Cognito
  } catch (error: any) {
    if (error.code === "UserNotFoundException") {
      return false; // Usuário não encontrado
    }
    throw error;
  }
};

const createCognitoUser = async (userData: UserDataProps) => {
  const params = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID!,
    Username: userData.cpf,
    UserAttributes: [
      {
        Name: "email",
        Value: userData.email,
      },
      {
        Name: "name",
        Value: userData.name,
      },
    ],
    TemporaryPassword: "ProvisionalPassword123!",
    MessageAction: "SUPPRESS",  // Não enviar e-mail de boas-vindas
  };

  try {
    await cognito.adminCreateUser(params).promise();
  } catch (error: any) {
    throw new Error(`Error creating Cognito user: ${error.message}`);
  }
};

const authenticateWithCognito = async (cpf: string, currentPassword: string) => {
  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: process.env.COGNITO_APP_CLIENT_ID!,
    AuthParameters: {
      USERNAME: cpf,
      PASSWORD: currentPassword, 
    },
  };

  try {
    const authResult = await cognito.initiateAuth(params).promise();
    console.log("[authenticateWithCognito] authResult: ", authResult);
   

    if (authResult.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
      const challengeParams = {
        ChallengeName: 'NEW_PASSWORD_REQUIRED',
        ClientId: process.env.COGNITO_APP_CLIENT_ID!,
        ChallengeResponses: {
          USERNAME: cpf,
          NEW_PASSWORD: 'NewPassword123!', 
        },
        Session: authResult.Session, 
      };

      const challengeResult = await cognito.respondToAuthChallenge(challengeParams).promise();
      console.log("[authenticateWithCognito] challengeResult: ", challengeResult);

      return challengeResult.AuthenticationResult;
    }

    return authResult.AuthenticationResult;
  } catch (error: any) {
    console.error("[authenticateWithCognito] Error: ", error);
    throw new Error(`Error authenticating with Cognito: ${error.message}`);
  }
};
