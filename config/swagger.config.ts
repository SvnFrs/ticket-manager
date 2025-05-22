import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";
import type { Express } from "express";
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT || "";

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log(`Swagger UI available at localhost:${port}/api-docs`);
};
