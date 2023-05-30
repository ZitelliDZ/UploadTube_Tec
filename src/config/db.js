import mongoose from "mongoose";
import { loggerCustomDefaul } from "./logsConfig.js";

//Crea la conexion a la base de datos de mongoDB
const conectarDB = async () => {
  try {
    //crea la conexion
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    //url para imprimir en la consola
    const url = `${connection.connection.host}:${connection.connection.port}`;
    console.log(`🌱 Servidor MongoDB Conectado a:  ${url}`);

  } catch (error) {
    //termina cualquier proceso que corra la aplicacion ya que se considera recurso de primera necesidad
    loggerCustomDefaul.error(error);
    process.exit(1);
  }
};

export default conectarDB;
