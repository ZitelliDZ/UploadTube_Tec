import mongoose from "mongoose";
import bcrypt from "bcrypt";

//crea el esquema de Usuario
const usuarioSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    token: {
      type: String,
      required: false,
    },
    confirmado: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

//Antes de realizar el guardado de un usuario.. "pre." es un middleware de mongoose para ejecutar antes del (en este caso) save
usuarioSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    //Comprueba que no se quiere modificar el password
    next(); //avanza al siguiente middleware
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt); //Hash password
});

//Comprobar Password.. "methods." es una herramienta para crear funciones personalizadas del modelo
usuarioSchema.methods.comprobarPassword = async function (passwordForm) {
  return await bcrypt.compare(passwordForm, this.password);
};

//Borrado logico de las cuentas
usuarioSchema.pre("find", function () {
  this.where({ isDeleted: false });
});
usuarioSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario;

//SUAGGER

/**
 *  @swagger
 *  components:
 *  schemas:
 *    Usuario:
 *      type: object
 *      properties:
 *        nombre:
 *          type: String
 *          required: true
 *          trim: true
 *        password:
 *          type: String
 *          required: true
 *          trim: true
 *        email:
 *          type: String
 *          required: true
 *          trim: true
 *          unique: true
 *        token:
 *          type: String
 *          descripción: Token de 1 solo uso
 *        confirmado:
 *          type: Boolean
 *          default: false
 *        isDeleted:
 *          type: Boolean
 *          default: false
 *        timestamps:
 *          type: Date
 *          descripción: modelo con los atributos "createdAt" y "updatedAt"
 *      required:
 *        - nombre
 *        - password
 *        - email
 *      example:
 *        nombre: Diego Zitelli
 *        password: ABCD1234
 *        email: zite@gmail.es
 */
