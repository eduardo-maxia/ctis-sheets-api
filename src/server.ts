import express, { json, urlencoded, Response as ExResponse, Request as ExRequest, NextFunction } from "express";
import { RegisterRoutes } from "../dist/routes";
import swaggerUi from "swagger-ui-express";
import { ValidateError } from "tsoa";
import 'dotenv/config'

export const app = express();

// Use body parser to read sent json payloads
app.use(
  urlencoded({
    extended: true,
  })
);
app.use(json());
app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
  return res.send(
    swaggerUi.generateHTML(await import("../dist/swagger.json"))
  );
});

RegisterRoutes(app);

type ObjectError = {
  status: number;
  message: string;
}
function isObjectError(obj: unknown): obj is ObjectError {
  return (obj as ObjectError).status !== undefined && (obj as ObjectError).message !== undefined;
}
// Handle Input Validation Errors
app.use(function errorHandler(
  err: unknown,
  req: ExRequest,
  res: ExResponse,
  next: NextFunction
): ExResponse | void {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }

  if (isObjectError(err)) {
    return res.status(err!.status).json({
      message: err.message,
    });
  }
  
  if (err instanceof Error) {
    console.log(err)
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }

  next();
});

// Handle missing route error
app.use(function notFoundHandler(_req, res: ExResponse) {
  res.status(404).send({
    message: "Not Found",
  });
});

const port = process.env.PORT || 8085;

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}/docs`)
);