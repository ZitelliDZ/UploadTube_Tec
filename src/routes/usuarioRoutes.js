import express from "express";

import checkAuth from "../middleware/checkAuth.js";

import {
  registrar,
  autenticar,
  confirmarEmail,
  resetPassword,
  comprobarToken,
  nuevoPassword,
  perfil,
} from "../controllers/usuarioController.js";

import {
  validateRegistrar,
  validateAutenticar,
  validateConfirmarEmail,
  validateResetPassword,
  validateComprobarToken,
  validateNuevoPassword,
  validatePerfil,
} from "../validators/usuarioValid.js";

const router = express.Router();

// /api/usuarios - Registro de usuario
router.post("/", validateRegistrar, registrar);
// /api/usuarios/login - Autenticación de usuario y creacion de token de session
router.post("/login", validateAutenticar, autenticar);
// /api/usuarios/confirmar/{token} - Confirmar registro de usuario
router.get("/confirmar/:token", validateConfirmarEmail, confirmarEmail);

// /api/usuarios/reset-password - Envío de email para recuperación de password
router.post("/reset-password", validateResetPassword, resetPassword);

router
  .route("/reset-password/:token")
  // /api/usuarios/reset-password/{token} - Verificar token
  .get(validateComprobarToken, comprobarToken)
  // /api/usuarios/reset-password/{token} - Cambiar Password
  .post(validateNuevoPassword, nuevoPassword);

// /api/usuarios/perfil - Buscar perfil del usuario
router.get("/perfil", validatePerfil, checkAuth, perfil);

export default router;

//SUAGGER

/**
 *  @swagger
 *  /api/usuarios:
 *  post:
 *    summary: Registro de usuario
 *    tags: [Usuario]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          charset: utf-8
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Usuario'
 *    responses:
 *      200:
 *        description: Usuario almacenado correctamente, Revisa tu email para confirmar tu cuenta!.
 *      409:
 *        description: Usuario ya registrado.!
 *      500:
 *        description: Error al registrar el usuario!.
 */

/**
 *  @swagger
 *  /api/usuarios/login:
 *  post:
 *    summary: Autenticación de usuario y creacion de token de session
 *    tags: [Usuario]
 *    requestBody:
 *      content:
 *        application/json:
 *          charset: utf-8
 *          schema:
 *            type: object
 *            properties:
 *              password:
 *                type: String,
 *                required: true,
 *              email:
 *                type: String,
 *                required: true,
 *            required:
 *              - password
 *              - email
 *            example:
 *              password: ABCD1234
 *              email: zite@gmail.es
 *    responses:
 *      200:
 *        description: Logueado con Exito!.
 *      401:
 *        description: El email o el password es incorrecto!.
 *      403:
 *        description: Tu cuenta no ha sido confirmada!.
 *      404:
 *        description: Usuario no está registrado!.
 */
/**
 *  @swagger
 *  /api/usuarios/confirmar/{token}:
 *  get:
 *    summary: Confirmar registro de usuario
 *    tags: [Usuario]
 *    parameters:
 *      - in: path
 *        name: token
 *        schema:
 *          type: string
 *          required: true
 *        descripción: Token de recuperación único que se envia por email
 *        example:
 *          03jvd7qf5k81h106jdlt
 *    responses:
 *      200:
 *        description: Usuario confirmado correctamente!.
 *      403:
 *        description: Token no válido!.
 *      500:
 *        description: Error al confirmar el email!.
 */

/**
 *  @swagger
 *  /api/usuarios/reset-password:
 *  post:
 *    summary: Envío de email para recuperación de password
 *    tags: [Usuario]
 *    requestBody:
 *      content:
 *        application/json:
 *          charset: utf-8
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: String,
 *                required: true,
 *            required:
 *              - email
 *            example:
 *              email: zite@gmail.es
 *    responses:
 *      200:
 *        description: Se ha enviado un email para el cambio de contraseña!.
 *      401:
 *        description: Usuario no está registrado!.
 *      500:
 *        description: Error al generar el restablecimiento de password!.
 */

/**
 *  @swagger
 *  /api/usuarios/reset-password/{token}:
 *  post:
 *    summary: Cambiar Password
 *    tags: [Usuario]
 *    parameters:
 *      - in: path
 *        name: token
 *        schema:
 *          type: string
 *          required: true
 *        descripción: Token de recuperación único que se envia por email
 *        example:
 *          token: 03jvd7qf5k81h106jdlt
 *    requestBody:
 *      content:
 *        application/json:
 *          charset: utf-8
 *          schema:
 *            type: object
 *            properties:
 *              password:
 *                type: String,
 *                required: true,
 *            required:
 *              - password
 *            example:
 *              password: 1234ABCD
 *    responses:
 *      200:
 *        description: Password modificado con exito!.
 *      401:
 *        description: El token no es válido!.
 *      500:
 *        description: Error al modificar el password!.
 */
/**
 *  @swagger
 *  /api/usuarios/reset-password/{token}:
 *  get:
 *    summary: Verificar token
 *    tags: [Usuario]
 *    parameters:
 *      - in: path
 *        name: token
 *        schema:
 *          type: string
 *          required: true
 *        descripción: Token de recuperación único que se envia por email
 *        example:
 *          03jvd7qf5k81h106jdlt
 *    responses:
 *      200:
 *        description: Token válido y usuario existe!.
 *      401:
 *        description: El token no es válido!.
 */

/**
 *  @swagger
 *  /api/usuarios/perfil:
 *  get:
 *    summary: Buscar perfil del usuario
 *    tags: [Usuario]
 *    responses:
 *      200:
 *        description: Perfil de usuario.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                _id:
 *                  type: String,
 *                  required: true,
 *                  trim: true,
 *                nombre:
 *                  type: String,
 *                  required: true,
 *                  trim: true,
 *                email:
 *                  type: String,
 *                  required: true,
 *                  trim: true,
 *                  unique: true,
 */
