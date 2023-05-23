import mongoose from "mongoose";
import Comentario from "./Comentario.js";

const videosSchema = mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: false,
    },
    path: {
      type: String,
      required: true,
    },
    creditos: {
      type: String,
      trim: true,
      required: false,
    },
    likes: {
      type: Number,
      integer: true,
      default: 0,
    },
    privado: {
      type: Boolean,
      default: true,
    },
    creador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    comentarios: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comentario",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.model("Video", videosSchema);

export default Video;

//SUAGGER

/**
 *  @swagger
 *  components:
 *  schemas:
 *    Video:
 *      type: object
 *      properties:
 *        titulo:
 *          type: String
 *          required: true
 *        description:
 *          type: String
 *          required: false
 *        path:
 *          type: String
 *          required: true
 *        creditos:
 *          type: String
 *          trim: true
 *          required: false
 *        likes:
 *          type: Number
 *          integer: true
 *          default: 0
 *        privado:
 *          type: Boolean
 *          default: true
 *        creador:
 *          type: string
 *          required: true
 *          $ref: '#/components/schemas/Usuario'
 *        comentarios:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Comentario'
 *          required: false
 *        timestamps:
 *          type: Date
 *          description: modelo con los atributos "createdAt" y "updatedAt"
 *      required:
 *        - titulo
 *        - path
 *        - creador
 *      example:
 *        titulo: Video Documentacion Swagger
 *        path: /public/videos/videoSwagger.mp4
 *        creador: 646a9a09edb1c614dd864689
 */
