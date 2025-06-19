import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from "swagger-ui-express";
import type { Express } from "express";
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT || 4000;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Simple Ticket API',
      version: '1.0.0',
      description: 'API for managing users and tickets in a movie booking system',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
        },
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.ts'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  console.log(`Swagger UI available at localhost:${port}/api-docs`);
};
