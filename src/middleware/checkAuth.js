import { fileURLToPath } from "url";

import Usuario from "../models/Usuario.js";
import { verificarJWT } from "../helpers/generarJWT.js";

const path = fileURLToPath(import.meta.url);

//Verificar que el usuario este Autenticado
const checkAuth = async (req, _res, next) => {
  let token;
  //verificar la autenticacion por el header (procesamiento mas rapido que agregandolo en otras partes)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    let decoded;
    //verifica y decodifica el token
    try {
      token = req.headers.authorization.split(" ")[1];
      decoded = verificarJWT(token);
    } catch (error) {
      return next({ error, code: 403, msg: "Token no válido!.", path });
    }

    //trae el usuario de la base de datos y elimina el token de recuperacion de cuenta
    try {
      //usuario para usarlo a parti de los siguientes middleware
      req.usuario = await Usuario.findById(decoded.id).select(
        "-password -confirmado -token -createdAt -updatedAt -isDeleted -__v"
      );

      let usuariosave = await Usuario.findById(decoded.id);
      usuariosave.token = "";
      await usuariosave.save();

      return next();
    } catch (error) {
      return next({
        error,
        code: 500,
        msg: "Error al Autenticar el usuario!.",
        path,
      });
    }
  }

  if (!token) {
    const error = new Error("No esta Autenticado!.");
    return next({ error, code: 403, msg: "No esta Autenticado!.", path });
  }

  next();
};

//Verificar el usuario - si existe o no
const checkUsuario = async (req, _res, next) => {
  let token;
  //verificar la autenticacion por el header (procesamiento mas rapido que agregandolo en otras partes)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    let decoded;
    //verifica y decodifica el token
    try {
      token = req.headers.authorization.split(" ")[1];
      decoded = verificarJWT(token);
    } catch (error) {
      return next({ error, code: 403, msg: "Token no válido!.", path });
    }

    //trae el usuario de la base de datos y elimina el token de recuperacion de cuenta
    //usuario para usarlo a parti de los siguientes middleware
    req.usuario = await Usuario.findById(decoded.id).select(
      "-password -confirmado -token -createdAt -updatedAt -isDeleted -__v"
    );

    try {
      let usuariosave = await Usuario.findById(decoded.id);
      usuariosave?.token && "";
      await usuariosave.save();

      return next();
    } catch (error) {
      return next({
        error,
        code: 500,
        msg: "Error al Autenticar el usuario!.",
        path,
      });
    }
  }
  next();
};

export default checkAuth;

export { checkAuth, checkUsuario };
