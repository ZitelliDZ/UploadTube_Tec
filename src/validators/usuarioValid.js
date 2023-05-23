import { check, body, param } from "express-validator";

import validateResult from "../helpers/validateHelper.js";
import { verificarJWT } from "../helpers/generarJWT.js";

//Documentacion para mas validaciones https://github.com/validatorjs/validator.js#sanitizers
const validateRegistrar = [
  body("email")
    .exists()
    .withMessage("Envía el email por favor!.")
    .isEmail()
    .withMessage("Email no válido!.")
    .not()
    .isEmpty()
    .withMessage("El email es requerido!."),

  body("nombre")
    .exists()
    .withMessage("Envía el nombre por favor!.")
    .not()
    .isEmpty()
    .withMessage("El nombre es requerido!."),

  body("password")
    .exists()
    .withMessage("Envía el password por favor!.")
    .isAlphanumeric()
    .withMessage("Ingrese solo caracteres Alfanumericos!.")
    .not()
    .isEmpty()
    .withMessage("El password es requerido!."),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

const validateAutenticar = [
  body("email")
    .exists()
    .withMessage("Envía el email por favor!.")
    .isEmail()
    .withMessage("Email no válido!.")
    .not()
    .isEmpty()
    .withMessage("El email es requerido!."),
  body("password")
    .exists()
    .withMessage("Envía el password por favor!.")
    .isAlphanumeric()
    .withMessage("Ingrese solo caracteres Alfanumericos!.")
    .not()
    .isEmpty()
    .withMessage("El password es requerido!."),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

const validateConfirmarEmail = [
  param("token").isAlphanumeric().withMessage("Token no válido!."),

  (req, res, next) => {
    validateResult(req, res, next);
  },
];

const validateResetPassword = [
  body("email")
    .exists()
    .withMessage("Envía el email por favor!.")
    .isEmail()
    .withMessage("Email no válido!.")
    .not()
    .isEmpty()
    .withMessage("El email es requerido!."),

  (req, res, next) => {
    validateResult(req, res, next);
  },
];
const validateComprobarToken = [
  param("token").isAlphanumeric().withMessage("Token no válido!."),

  (req, res, next) => {
    validateResult(req, res, next);
  },
];
const validateNuevoPassword = [
  param("token").isAlphanumeric().withMessage("Token no válido!."),

  body("password")
    .exists()
    .withMessage("Envía el password por favor!.")
    .isAlphanumeric()
    .withMessage("Ingrese solo caracteres Alfanumericos!.")
    .not()
    .isEmpty()
    .withMessage("El password es requerido!."),

  (req, res, next) => {
    validateResult(req, res, next);
  },
];

//No es Necesario Realizar el control de la autorizacion en cada endpoint debido a que si un dia Cambia
//se deben modificar todas las validaciones.. es mucho mas seguro realizarlo en Auth
const validatePerfil = [
  check("authorization")
    .custom(async (value, { _req }) => {
      const token = value.split(" ")[1];
      verificarJWT(token);
    })
    .withMessage("Token mal formateado!."),

  (req, res, next) => {
    validateResult(req, res, next);
  },
];

export {
  validateRegistrar,
  validateAutenticar,
  validateConfirmarEmail,
  validateResetPassword,
  validateComprobarToken,
  validateNuevoPassword,
  validatePerfil,
};
