import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda";

import http from "http";

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> => {
  console.log("[proxy] event: ", event);

  const { rawPath, body, headers, requestContext } = event;
  const baseUrl = `${process.env.API_BASE_URL}`;
  const targetUrl = `${baseUrl}${rawPath}`;

  const options = {
    method: requestContext.http.method,
    headers,
  };

  const makeRequest = (): Promise<APIGatewayProxyResult> =>
    new Promise((resolve, reject) => {
      const req = http.request(targetUrl, options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
        
          const sanitizedHeaders = Object.entries(res.headers).reduce((acc, [key, value]) => {
            if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
              acc[key] = value;
            } else if (Array.isArray(value)) {
              acc[key] = value.join(", ");
            }

            return acc;
          }, {} as { [key: string]: string | number | boolean });

          resolve({
            statusCode: res.statusCode || 500,
            headers: sanitizedHeaders,
            body: data,
          });
        });
      });

      req.on("error", (err) => {
        reject({
          statusCode: 500,
          body: JSON.stringify({ error: "Internal Server Error", details: err.message }),
        });
      });

      if (body) req.write(body);
      req.end();
    });

  try {
    return await makeRequest();
  } catch (error) {
   if (error instanceof Error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
    };
  }

  return {
    statusCode: 500,
    body: JSON.stringify({
      error: "Internal Server Error",
      details: "An unknown error occurred",
    }),
  };
  }
};
