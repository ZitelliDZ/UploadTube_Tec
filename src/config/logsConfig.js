import winston from "winston";
import expressWinston from "express-winston";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurar el logger de Winston
const loggerPersonalizado500 = winston.createLogger({
  level: "error", // Nivel de registro mínimo para errores
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }), // Agregar el seguimiento de pila
    winston.format.json()
  ), // Formato del registro
  transports: [
    new winston.transports.File({
      filename: `${join(__dirname, "../logs/errorPer500.log")}`,
      level: "error",
    }), // Archivo de registro de errores
  ],
});

const loggerPersonalizado400 = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: `${join(__dirname, "../logs/errorPer400.log")}`,
      level: "error",
    }),
  ],
});

const loggerPersonalizadoDefault = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: `${join(__dirname, "../logs/errorPerDefault.log")}`,
      level: "error",
    }),
  ],
});

const logger = expressWinston.errorLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: `${join(__dirname, "../logs/error.log")}`,
      level: "error",
    }), // Archivo de registro de errores
  ],
});

export {
  loggerPersonalizado500,
  loggerPersonalizado400,
  loggerPersonalizadoDefault,
  logger,
};
