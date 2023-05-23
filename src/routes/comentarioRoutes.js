import express from "express";

import { checkAuth, checkUsuario } from "../middleware/checkAuth.js";

import {
  agregarComentario,
  obtenerComentario,
  editarComentario,
  eliminarComentario,
  darLikeComentario,
} from "../controllers/comentarioController.js";

import {
  validateAgregarComentario,
  validateObtenerComentario,
  validateEditarComentario,
  validateEliminarComentario,
  validateDarLikeComentario,
} from "../validators/comentarioValid.js";

const router = express.Router();

// /api/comentarios - Agrega un comentario al video
router.post("/", validateAgregarComentario, checkUsuario, agregarComentario);

router
  .route("/:id")
  // /api/comentarios/{id} - Obtener Comentario
  .get(validateObtenerComentario, checkUsuario, obtenerComentario)
  // /api/comentarios/{id} - Editar comentario
  .put(validateEditarComentario, checkAuth, editarComentario)
  // /api/comentarios/{id} - Eliminar comentario
  .delete(validateEliminarComentario, checkAuth, eliminarComentario);

router
  .route("/like/:comentario")
  // /api/comentarios/like/{comentario} - Dar Like al comentario
  .get(validateDarLikeComentario, checkUsuario, darLikeComentario);

export default router;

//SUAGGER

/**
 *  @swagger
 *  /api/comentarios/like/{comentario}:
 *  get:
 *    summary: Dar Like al comentario
 *    tags: [Comentario]
 *    parameters:
 *      - in: path
 *        name: comentario
 *        schema:
 *          type: string
 *          required: true
 *        description: Id asignado en la base de datos
 *        example:
 *          03jvd7qf5k81h106jdlt
 *    responses:
 *      200:
 *        description: Like!.
 *      403:
 *        description: Acción no válida!. || No tienes permisos!.
 *      404:
 *        description: El comentario no existe!.
 *      500:
 *        description: Error al actualizar el comentario!.
 */
/**
 *  @swagger
 *  /api/comentarios:
 *  post:
 *    summary: Agrega un comentario al video
 *    tags: [Comentario]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          charset: utf-8
 *          schema:
 *            type: object
 *            properties:
 *              comentario:
 *                type: String
 *                required: true
 *              video:
 *                type: String
 *                required: true
 *            required:
 *              - comentario
 *              - video
 *            example:
 *              comentario: Excelente Video
 *              video: 646a9a09edb1c614dd864689
 *    responses:
 *      200:
 *        description: Comentario guardado.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Comentario'
 *      403:
 *        description: Acción no válida!. || No tienes permisos!.
 *      404:
 *        description: El video no existe!.
 *      500:
 *        description: Error al guardar el comentario!.
 */
/**
 * @swagger
 * /api/comentarios/{id}:
 *  get:
 *    summary: Obtener Comentario
 *    tags: [Comentario]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          required: true
 *        description: Id asignado en la base de datos
 *        example:
 *          03jvd7qf5k81h106jdlt
 *    responses:
 *      200:
 *        description: Comentario guardado.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Comentario'
 *      403:
 *        description: Acción no válida!. || No tienes permisos!.
 *      404:
 *        description: El Comentario no existe!.
 */
/**
 *  @swagger
 *  /api/comentarios/{id}:
 *  put:
 *    summary: Editar comentario
 *    tags: [Comentario]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          required: true
 *        description: Id asignado en la base de datos
 *        example:
 *          id: 03jvd7qf5k81h106jdlt
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          charset: utf-8
 *          schema:
 *            type: object
 *            properties:
 *              comentario:
 *                type: String
 *                required: true
 *            required:
 *              - comentario
 *            example:
 *              comentario: Excelente video
 *    responses:
 *      200:
 *        description: Comentario guardado.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Comentario'
 *      403:
 *        description: Acción no válida!. || No tienes permisos!. || El comentario es anonimo!.
 *      404:
 *        description: El comentario no existe!.
 *      500:
 *        description: Error al actualizar el comentario!.
 */
/**
 *  @swagger
 *  /api/comentarios/{id}:
 *  delete:
 *    summary: Eliminar comentario
 *    tags: [Comentario]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          required: true
 *        description: Id asignado en la base de datos
 *        example:
 *          id: 03jvd7qf5k81h106jdlt
 *    responses:
 *      200:
 *        description: Comentario Eliminado!.
 *      403:
 *        description: Acción no válida!. || No tienes permisos!.
 *      404:
 *        description: El comentario no existe!.
 *      500:
 *        description: Error al eliminar el comentario!.
 */
