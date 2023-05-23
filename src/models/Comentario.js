import mongoose from "mongoose";

const comentariosSchema = mongoose.Schema(
  {
    comentario: {
      type: String,
      trim: true,
      required: true,
    },
    likes: {
      type: Number,
      integer: true,
      default: 0,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: false,
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comentario = mongoose.model("Comentario", comentariosSchema);

export default Comentario;

//SUAGGER

/**
 *  @swagger
 *  components:
 *  schemas:
 *    Comentario:
 *      type: object
 *      properties:
 *        comentario:
 *          type: String
 *          trim: true
 *          required: true
 *        likes:
 *          type: Number
 *          integer: true
 *          default: 0
 *        usuario:
 *          type: object
 *          $ref: '#/components/schemas/Usuario'
 *          required: false
 *        video:
 *          type: object
 *          ref: 'Video'
 *          required: true
 *          $ref: '#/components/schemas/Video'
 *        timestamps:
 *          type: Date
 *          description: modelo con los atributos "createdAt" y "updatedAt"
 *      required:
 *        - comentario
 *        - video
 */
