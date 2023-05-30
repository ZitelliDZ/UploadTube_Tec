import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";
import swaggerJsDoc from "swagger-jsdoc";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Metadata info sobre la Api
const optionsSwagger = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Sistema Gestor de Asistencia UGD",
      version: "1.0.0",
      description: "Api del Sistema de Gestion de Asistencia UGD",
    },

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: process.env.APP_URL + ":" + process.env.APP_PORT,
      },
    ],
  },
  apis: [
    `${join(__dirname, "../routes/*.js")}`,
    `${join(__dirname, "../models/*.js")}`,
  ],
};

//Docs en Json format
const swaggerSpec = swaggerJsDoc(optionsSwagger);

export default swaggerSpec;
