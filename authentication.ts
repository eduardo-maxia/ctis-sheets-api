import * as express from "express";

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  console.log("Authentication")
  let token;
  token = request.body?.apiKey || request.headers["x-api-key"] || request.query?.apiKey;

  if (token === process.env.API_KEY) {
    return Promise.resolve({
      perfil: 'gestao_vida'
    });
  } else {
    return Promise.reject({ message: "Unauthorized", statusCode: 401 });
  }
}
