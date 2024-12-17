import { APIGatewayAuthorizerEvent, CustomAuthorizerResult, StatementEffect } from "aws-lambda";

import { AttributeListType } from "aws-sdk/clients/cognitoidentityserviceprovider";
import { CognitoIdentityServiceProvider } from "aws-sdk";

const cognito = new CognitoIdentityServiceProvider();

export const handler = async (event: any): Promise<CustomAuthorizerResult> => {
    console.log("[authorizer] event: ", event);
    const isCreateClient = event.requestContext.http.path === "/clients" && event.requestContext.http.method === "POST";
    const accessToken = event?.headers?.authorization;  
    
    if (!accessToken) {
        console.log("No accessToken provided");
        return denyAccess(event.routeArn);
    }

    try {
        const decoded = await validateJWT(accessToken);
        console.log("[authorizer] decoded JWT: ", decoded);

        if (decoded.sub || isCreateClient) {
            console.log("[authorizer]: allowed");

            return allowAccess(event.routeArn, decoded);
        } else {
            
            console.log("[authorizer]: denied");
            return denyAccess(event.routeArn);
        }

    } catch (error) {
        console.log("Error validating token: ", error);
        return denyAccess(event.routeArn);
    }
};


const validateJWT = async (accessToken: string) => {
    try {
        const params = {
            AccessToken: accessToken, 
        };
        
        const result = await cognito.getUser(params).promise();
        const convertAttributesToObject = (attributes: AttributeListType) => {
            return attributes.reduce((acc, attribute) => {
              acc[attribute.Name] = attribute.Value;
              return acc;
            }, {} as any);
          };
        return convertAttributesToObject(result.UserAttributes);
    } catch (error) {
        throw new Error(`Invalid token or user not found: error : ${error}`);
    }
};

const allowAccess = (resource: string, decoded: any): CustomAuthorizerResult => {
    return {
        principalId: decoded.sub, 
        policyDocument: {
            Version: "2012-10-17",
            Statement: [
                {
                    Action: "execute-api:Invoke",
                    Effect: "Allow" as StatementEffect,
                    Resource: resource,
                },
            ],
        },
    };
};

const denyAccess = (resource: string): CustomAuthorizerResult => {
    return {
        principalId: "anonymous", 
        policyDocument: {
            Version: "2012-10-17",
            Statement: [
                {
                    Action: "execute-api:Invoke",
                    Effect: "Deny" as StatementEffect,
                    Resource: resource,
                },
            ],
        },
    };
};
