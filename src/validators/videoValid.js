import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { body, param } from "express-validator";

import {
  validateResult,
  validateVideoResult,
} from "../helpers/validateHelper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Documentacion para mas validaciones https://github.com/validatorjs/validator.js#sanitizers
const validateNuevoVideo = [
  body("titulo")
    .exists()
    .withMessage("Envía el título por favor!.")
    .isString()
    .withMessage("Título no válido!.")
    .not()
    .isEmpty()
    .withMessage("El título es requerido!."),
  body("descripcion")
    .exists()
    .withMessage("Envía el descripción por favor!.")
    .isString()
    .withMessage("Descripción no válido!.")
    .not()
    .isEmpty()
    .withMessage("El descripción es requerido!."),
  body("creditos")
    .exists()
    .withMessage("Envía los creditos por favor!.")
    .isString()
    .withMessage("Creditos no válidos!.")
    .not()
    .isEmpty()
    .withMessage("Los creditos son requerido!."),
  body("privado")
    .exists()
    .withMessage("Envía el campo privado por favor!.")
    .isBoolean()
    .not()
    .isEmpty()
    .withMessage("El campo privado es requerido!."),

  (req, res, next) => {
    const path = `${join(__dirname, `../uploads/videos/${req.file.filename}`)}`;
    validateVideoResult(req, res, next, path);
  },
];

const validateObtenerVideo = [
  param("id").isMongoId().withMessage("Id no válido!."),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];
const validateEditarVideo = [
  param("id").isMongoId().withMessage("Id no válido!."),
  body("titulo")
    .exists()
    .withMessage("Envía el título por favor!.")
    .isString()
    .withMessage("Título no válido!.")
    .not()
    .isEmpty()
    .withMessage("El título es requerido!."),
  body("descripcion")
    .exists()
    .withMessage("Envía el descripción por favor!.")
    .isString()
    .withMessage("Descripción no válido!.")
    .not()
    .isEmpty()
    .withMessage("El descripción es requerido!."),
  body("creditos")
    .exists()
    .withMessage("Envía los creditos por favor!.")
    .isString()
    .withMessage("Creditos no válidos!.")
    .not()
    .isEmpty()
    .withMessage("Los creditos son requerido!."),
  body("privado")
    .exists()
    .withMessage("Envía el campo privado por favor!.")
    .isBoolean()
    .not()
    .isEmpty()
    .withMessage("El campo privado es requerido!."),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

const validateEliminarVideo = [
  param("id").isMongoId().withMessage("Id no válido!."),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

const validateObtenerMejoresVideos = [
  param("cantidad")
    .isNumeric()
    .withMessage("Ingrese una Cantidad numerica!.")
    .isInt({ min: 1, max: 20 })
    .withMessage("La cantidad debe estar entre 1 y 20!."),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

export {
  validateNuevoVideo,
  validateObtenerVideo,
  validateEditarVideo,
  validateEliminarVideo,
  validateObtenerMejoresVideos,
};
