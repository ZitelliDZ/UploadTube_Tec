import { check, body, param } from "express-validator";

import validateResult from "../helpers/validateHelper.js";

//Documentacion para mas validaciones https://github.com/validatorjs/validator.js#sanitizers
const validateAgregarComentario = [
  body("comentario")
    .exists()
    .withMessage("Envía el comentario por favor!.")
    .isString()
    .withMessage("Comentario no válido!.")
    .not()
    .isEmpty()
    .withMessage("El comentario es requerido!."),

  body("video")
    .exists()
    .withMessage("Envía el video por favor!.")
    .isMongoId()
    .withMessage("video no válido!.")
    .not()
    .isEmpty()
    .withMessage("El video es requerido!."),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

const validateObtenerComentario = [
  param("id").isMongoId().withMessage("Id no válido!."),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];
const validateEditarComentario = [
  param("id").isMongoId().withMessage("Id no válido!."),

  body("comentario")
    .exists()
    .withMessage("Envía el comentario por favor!.")
    .isString()
    .withMessage("Comentario no válido!.")
    .not()
    .isEmpty()
    .withMessage("El comentario es requerido!."),

  (req, res, next) => {
    validateResult(req, res, next);
  },
];
const validateEliminarComentario = [
  param("id").isMongoId().withMessage("Id no válido!."),

  (req, res, next) => {
    validateResult(req, res, next);
  },
];

const validateDarLikeComentario = [
  param("comentario").isMongoId().withMessage("Id no válido!."),

  (req, res, next) => {
    validateResult(req, res, next);
  },
];

export {
  validateAgregarComentario,
  validateObtenerComentario,
  validateEditarComentario,
  validateEliminarComentario,
  validateDarLikeComentario,
};
