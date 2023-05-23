import express from "express";

import uploadFile from "../middleware/fileHandle.js";
import { checkAuth, checkUsuario } from "../middleware/checkAuth.js";

import {
  obtenerVideos,
  obtenerVideo,
  nuevoVideo,
  editarVideo,
  eliminarVideo,
  obtenerMejoresVideos,
} from "../controllers/videoController.js";

import {
  validateNuevoVideo,
  validateObtenerVideo,
  validateEditarVideo,
  validateEliminarVideo,
  validateObtenerMejoresVideos,
} from "../validators/videoValid.js";

const router = express.Router();

router
  .route("/")
  // /api/videos - Devuelve todos los videos publicos
  .get(checkUsuario, obtenerVideos)
  // /api/videos - Guardar nuevo Video
  .post(checkAuth, uploadFile, validateNuevoVideo, nuevoVideo);

router
  .route("/:id")
  // /api/videos/{id} - Obtener Video
  .get(validateObtenerVideo, checkUsuario, obtenerVideo)
  // /api/videos/{id} - Editar Video
  .put(validateEditarVideo, checkAuth, editarVideo)
  // /api/videos/{id} - Eliminar video
  .delete(validateEliminarVideo, checkAuth, eliminarVideo);

router
  .route("/top/:cantidad")
  // /api/videos/{cantidad} - Devuelve "cantidad" Top de videos publicos
  .get(validateObtenerMejoresVideos, checkUsuario, obtenerMejoresVideos);

export default router;

//SUAGGER

/**
 *  @swagger
 *  /api/videos:
 *  post:
 *    summary: Guardar nuevo Video
 *    tags: [Video]
 *    requestBody:
 *      required: true
 *      content:
 *        form-data:
 *          charset: utf-8
 *          schema:
 *            type: object
 *            properties:
 *              video:
 *                type: file
 *                required: true
 *              titulo:
 *                type: String
 *                required: true
 *              description:
 *                type: String
 *                required: false
 *              path:
 *                type: String
 *                required: true
 *              creditos:
 *                type: String
 *                trim: true
 *                required: false
 *              privado:
 *                type: Boolean
 *                default: true
 *              creador:
 *                type: string
 *                required: true
 *            required:
 *              - video
 *              - titulo
 *              - path
 *              - creador
 *            example:
 *              titulo: Video Documentacion Swagger
 *              path: /public/videos/videoSwagger.mp4
 *              creador: 646a9a09edb1c614dd8646
 *    responses:
 *      200:
 *        description: Video guardado.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Video'
 *      500:
 *        description: Error al almacenar el video!.
 */
/**
 * @swagger
 * /api/videos:
 *  get:
 *    summary: Devuelve todos los videos publicos y los videos del propio usuario || Si no esta logueado solo devuelve los videos publicos
 *    tags: [Video]
 *    responses:
 *      200:
 *        description: Video guardado.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                example:
 *                  _id: 646a46e99baad56d3085155d
 *                  likes: 0
 *                  comentarios: []
 *                  descripcion: el video de la entrevista para la prueba tecnica
 *                  titulo: Video Documentacion Swagger
 *                  path: /public/videos/videoSwagger.mp4
 *                  creador: 646a9a09edb1c614dd864689
 *      500:
 *        description: Error al buscar los videos!.
 */

/**
 * @swagger
 * /api/videos/{id}:
 *  get:
 *    summary: Obtener Video
 *    tags: [Video]
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
 *        description: Video
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example:
 *                _id: 646a46e99baad56d3085155d
 *                likes: 0
 *                comentarios: []
 *                descripcion: el video de la entrevista para la prueba tecnica
 *                titulo: Video Documentacion Swagger
 *                path: /public/videos/videoSwagger.mp4
 *                creador: 646a9a09edb1c614dd864689
 *      403:
 *        description: Acción no válida!. || No tienes permisos!.
 *      404:
 *        description: El video no existe!.
 *      500:
 *        description: Error al buscar el video!.
 */
/**
 *  @swagger
 *  /api/videos/{id}:
 *  put:
 *    summary: Editar Video
 *    tags: [Video]
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
 *              titulo:
 *                type: String
 *                required: true
 *              descripcion:
 *                type: String
 *                required: true
 *              creditos:
 *                type: String
 *                required: true
 *              privado:
 *                type: String
 *                required: true
 *            required:
 *              - privado
 *            example:
 *              titulo: Nuevo titulo
 *              descripcion: Nueva Descripcion
 *              creditos: Nuevos Creditos
 *              privado: 'false'
 *    responses:
 *      200:
 *        description: Video actualizado.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example:
 *                _id: 646a46e99baad56d3085155d
 *                likes: 0
 *                comentarios: []
 *                descripcion: el video de la entrevista para la prueba tecnica
 *                titulo: Video Documentacion Swagger
 *                path: /public/videos/videoSwagger.mp4
 *                creador: 646a9a09edb1c614dd864689
 *      403:
 *        description: Acción no válida!. || No tienes permisos!.
 *      404:
 *        description: El Viedo no existe!.
 *      500:
 *        description: Error al actualizar el video!.
 */
/**
 *  @swagger
 *  /api/videos/{id}:
 *  delete:
 *    summary: Eliminar video
 *    tags: [Video]
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
 *        description: Video Eliminado!.
 *      403:
 *        description: Acción no válida!. || No tienes permisos!.
 *      404:
 *        description: El Viedo no existe!.
 *      500:
 *        description: Error al eliminar el video!.
 */
/**
 *  @swagger
 *  /api/videos/top/{cantidad}:
 *  get:
 *    summary: Devuelve "cantidad" Top de videos publicos (y privados del usuario)
 *    tags: [Video]
 *    parameters:
 *      - in: path
 *        name: cantidad
 *        schema:
 *          type: string
 *          required: true
 *        description: Cantidad max de videos que puede traer
 *        example:
 *          5
 *    responses:
 *      200:
 *        description: Videos.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                example:
 *                  _id: 646a46e99baad56d3085155d
 *                  likes: 0
 *                  comentarios: []
 *                  descripcion: el video de la entrevista para la prueba tecnica
 *                  titulo: Video Documentacion Swagger
 *                  path: /public/videos/videoSwagger.mp4
 *                  creador: 646a9a09edb1c614dd864689
 *      403:
 *        description: Cantidad no válida!.
 *      500:
 *        description: Error al buscar los videos!.
 */
