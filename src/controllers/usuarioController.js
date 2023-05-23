import { fileURLToPath } from "url";

import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/email.js";

const path = fileURLToPath(import.meta.url);

//registra un nuevo usuario
const registrar = async (req, res, next) => {
  //Comprobar que no exista alguien registrado
  const { email } = req.body;
  const existeUsuario = await Usuario.findOne({ email: email });

  if (existeUsuario) {
    const error = new Error("Usuario ya registrado!.");
    return next({ error, code: 409, msg: "Usuario ya registrado!.", path });
  }

  //registrar
  try {
    const usuario = new Usuario(req.body);
    usuario.token = generarId(); //Crea el token unico
    const usuarioAlmacenado = await usuario.save();

    emailRegistro({
      email: usuarioAlmacenado.email,
      nombre: usuarioAlmacenado.nombre,
      token: usuarioAlmacenado.token,
    });

    res.json({
      msg: "Usuario almacenado correctamente, Revisa tu email para confirmar tu cuenta!.",
    });
  } catch (error) {
    return next({
      error,
      code: 500,
      msg: "Error al registrar el usuario!.",
      path,
    });
  }
};

const autenticar = async (req, res, next) => {
  //funcion para autenticar el usuario

  //Comporbar si el usuario existe
  const { email, password } = req.body;
  const usuario = await Usuario.findOne({ email: email });

  if (!usuario) {
    const error = new Error("Usuario no está registrado!.");
    return next({
      error,
      code: 404,
      msg: "Usuario no está registrado!.",
      path,
    });
  }

  //Comprobar si confirmo email
  if (!usuario.confirmado) {
    const error = new Error("Tu cuenta no ha sido confirmada!.");
    return next({
      error,
      code: 403,
      msg: "Tu cuenta no ha sido confirmada!.",
      path,
    });
  }

  //Comprobar su password
  if (await usuario.comprobarPassword(password)) {
    res.json({
      msg: "Logueado con Exito!.",
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id),
    });
  } else {
    const error = new Error("El email o el password es incorrecto!.");
    return next({
      error,
      code: 401,
      msg: "El email o el password es incorrecto!.",
      path,
    });
  }
};

//confirma su cuenta mediante el email
const confirmarEmail = async (req, res, next) => {
  const { token } = req.params;
  const usuarioConfirmar = await Usuario.findOne({ token: token });

  //confirmar que exista el token del usuario dentro de la base de datos
  if (!usuarioConfirmar) {
    const error = new Error("Token no válido!.");
    return next({ error, code: 403, msg: "Token no válido!.", path });
  }

  //confirma y elimina el token de 1 solo uso
  try {
    usuarioConfirmar.confirmado = true;
    usuarioConfirmar.token = "";
    await usuarioConfirmar.save();
    res.json({
      msg: "Usuario confirmado correctamente!.",
    });
  } catch (error) {
    return next({
      error,
      code: 500,
      msg: "Error al confirmar el email!.",
      path,
    });
  }
};

//Reset Password - Generar Token
const resetPassword = async (req, res, next) => {
  //comprobar que el email de un usuario exista
  const { email } = req.body;
  const usuario = await Usuario.findOne({ email: email });

  if (!usuario) {
    const error = new Error("Usuario no está registrado!.");
    return next({
      error,
      code: 401,
      msg: "Usuario no está registrado!.",
      path,
    });
  }

  //genera el token, guarda y lo envia por email
  try {
    usuario.token = generarId();
    await usuario.save();

    emailOlvidePassword({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token,
    });
    res.json({
      msg: "Se ha enviado un email para el cambio de contraseña!.",
    });
  } catch (error) {
    return next({
      error,
      code: 500,
      msg: "Error al generar el restablecimiento de password!.",
      path,
    });
  }
};

//Comprobar Token de un solo uso
const comprobarToken = async (req, res, next) => {
  //confirmar que exista el token del usuario dentro de la base de datos
  const { token } = req.params;
  const tokenValido = await Usuario.findOne({ token: token });

  if (!tokenValido) {
    const error = new Error("El token no es válido!.");
    return next({ error, code: 401, msg: "El token no es válido!.", path });
  }
  return res.json({
    msg: "Token válido y usuario existe!.",
  });
};

//Cambio de Password
const nuevoPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    //verifica que el token existe de un usuario
    const usuario = await Usuario.findOne({ token: token });

    if (!usuario) {
      const error = new Error("El token no es válido!.");
      return next({ error, code: 401, msg: "El token no es válido!.", path });
    } else {
      //modificamos el password (que lo hashea antes de guardarlo) y elimina el token de 1 solo uso
      usuario.password = password;
      usuario.token = "";
      await usuario.save();
      res.json({
        msg: "Password modificado con exito!.",
      });
    }
  } catch (error) {
    return next({
      error,
      code: 500,
      msg: "Error al modificar el password!.",
      path,
    });
  }
};

const perfil = async (req, res, _next) => {
  const { usuario } = req;
  return res.json(usuario);
};

export {
  registrar,
  autenticar,
  confirmarEmail,
  resetPassword,
  comprobarToken,
  nuevoPassword,
  perfil,
};
