import winston from "winston";
import expressWinston from "express-winston";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Creacion del log Winston



// Configurar el log de Winston Personalizado
const logConfigCustom = (path) => winston.createLogger({
  level: "error", // Nivel de registro mínimo para errores
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }), // Agregar el seguimiento de pila
    winston.format.json()
  ), // Formato del registro
  transports: [
    new winston.transports.File({
      filename: `${join(__dirname, path)}`,
      level: "error",
    }), // Archivo de registro de errores
  ],
});



const logConfig = (path) => expressWinston.errorLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: `${join(__dirname, path)}`,
      level: "error",
    }), 
  ],
});



const loggerCustom500 = logConfigCustom(`../logs/errorCustom500.log`);
const loggerCustom400 = logConfigCustom(`../logs/errorCustom400.log`);
const loggerCustomDefaul = logConfigCustom(`../logs/errorCustomDefault.log`);
const logger = logConfig(`../logs/error.log`);

export {
  loggerCustom500,
  loggerCustom400,
  loggerCustomDefaul,
  logger,
};




