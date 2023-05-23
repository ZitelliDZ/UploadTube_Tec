import { fileURLToPath } from "url";
import mongoose from "mongoose";

import Comentario from "../models/Comentario.js";
import Video from "../models/Video.js";

const path = fileURLToPath(import.meta.url);

//Agrega un comentario al video
const agregarComentario = async (req, res, next) => {
  const { video } = req.body;

  //valida el formato del id
  if (!mongoose.Types.ObjectId.isValid(video)) {
    const error = new Error("Acción no válida!.");
    return next({ error, code: 403, msg: "Acción no válida!.", path });
  }

  const existeVideo = await Video.findById(video);

  //valida que exista el video
  if (!existeVideo) {
    const error = new Error("El video no existe!.");
    return next({ error, code: 404, msg: "El video no existe!.", path });
  }

  //verifica si existe autentificacion o es comentario anonimo
  if (req.usuario?._id) {
    //valida si el video es privado y si el usuario no es el creador
    if (
      existeVideo.privado &&
      existeVideo.creador.toString() !== req.usuario._id.toString()
    ) {
      const error = new Error("No tienes permisos!.");
      return next({ error, code: 403, msg: "No tienes permisos!.", path });
    }
  } else {
    //valida si el video es privado
    if (existeVideo.privado) {
      const error = new Error("No tienes permisos!.");
      return next({ error, code: 403, msg: "No tienes permisos!.", path });
    }
  }

  try {
    const comentarioAlmacenado = new Comentario();
    comentarioAlmacenado.comentario = req.body.comentario;
    comentarioAlmacenado.usuario = req.usuario?._id;
    comentarioAlmacenado.video = req.body.video;
    await comentarioAlmacenado.save();

    existeVideo.comentarios.push(comentarioAlmacenado._id);
    await existeVideo.save();
    res.json(comentarioAlmacenado);
  } catch (error) {
    return next({
      error,
      code: 500,
      msg: "Error al guardar el comentario.!",
      path,
    });
  }
};

//Buscar Comentario
const obtenerComentario = async (req, res, next) => {
  const { id } = req.params;

  //valida el formato del id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Acción no válida!.");
    return next({ error, code: 403, msg: "Acción no válida!.", path });
  }

  const existeComentario = await Comentario.findById(id).populate("video");

  //valida que el comentario exista
  if (!existeComentario) {
    const error = new Error("El Comentario no existe!.");
    return next({ error, code: 404, msg: "El Comentario no existe!.", path });
  }

  //valida que el video sea privado y que el usuario no sea el creador
  if (
    existeComentario.video.privado &&
    existeComentario.video.creador.valueOf() !== req.usuario?._id.valueOf()
  ) {
    const error = new Error("No tienes permisos!.");
    return next({ error, code: 403, msg: "No tienes permisos!.", path });
  }
  res.json(existeComentario);
};

//Editar comentario
const editarComentario = async (req, res, next) => {
  const { id } = req.params;

  //valida el formato del id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Acción no válida!.");
    return next({ error, code: 403, msg: "Acción no válida!.", path });
  }

  const existeComentario = await Comentario.findById(id)
    .populate("video")
    .populate("usuario");

  //valida que exista el comentario
  if (!existeComentario) {
    const error = new Error("El Comentario no existe!.");
    return next({ error, code: 404, msg: "El Comentario no existe!.", path });
  }

  //valida si el video es privado y si el usuario no es el creador
  if (
    existeComentario.video.privado &&
    existeComentario.video.creador.valueOf() !== req.usuario._id.valueOf()
  ) {
    const error = new Error("No tienes permisos!.");
    return next({ error, code: 403, msg: "No tienes permisos!.", path });
  }

  //valida si el comentario es anonimo
  if (!existeComentario.usuario) {
    const error = new Error("El comentario es anonimo!.");
    return next({ error, code: 403, msg: "El comentario es anonimo!.", path });
  }

  //valida si el comentario no es el mismo que el usuario
  if (existeComentario.usuario._id.valueOf() !== req.usuario._id.valueOf()) {
    const error = new Error("No tienes permisos!.");
    return next({ error, code: 403, msg: "No tienes permisos!.", path });
  }

  existeComentario.comentario =
    req.body.comentario || existeComentario.comentario;

  try {
    const comentarioAlmacenado = await existeComentario.save();
    res.json(comentarioAlmacenado);
  } catch (error) {
    return next({
      error,
      code: 500,
      msg: "Error al actualizar el comentario.!",
      path,
    });
  }
};

//Eliminar comentario
const eliminarComentario = async (req, res, next) => {
  const { id } = req.params;

  //valida el formato del id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Acción no válida!.");
    return next({ error, code: 403, msg: "Acción no válida!.", path });
  }

  const existeComentario = await Comentario.findById(id)
    .populate("video")
    .populate("usuario");

  //valida si existe
  if (!existeComentario) {
    const error = new Error("El Comentario no existe!.");
    return next({ error, code: 404, msg: "El Comentario no existe!.", path });
  }

  //valida si el video es privado y quiere eliminarlo un usuario distinto al creador
  if (
    existeComentario.video.privado &&
    existeComentario.video.creador.valueOf() !== req.usuario._id.valueOf()
  ) {
    const error = new Error("No tienes permisos!.");
    return next({ error, code: 403, msg: "No tienes permisos!.", path });
  }

  //valida si el comentario es anonimo y quiere eliminarlo un usuario distinto al creador
  if (
    !existeComentario.usuario &&
    existeComentario.video.creador.valueOf() !== req.usuario._id.valueOf()
  ) {
    const error = new Error("No tienes permisos!.");
    return next({ error, code: 403, msg: "No tienes permisos!.", path });
  }

  //valida si el usuario que quiere eliminar el comentario no es el creador del video y no es el que realizo el comentario
  if (
    existeComentario.usuario?._id.valueOf() !== req.usuario._id.valueOf() &&
    existeComentario.video.creador.valueOf() !== req.usuario._id.valueOf()
  ) {
    const error = new Error("No tienes permisos!.");
    return next({ error, code: 403, msg: "No tienes permisos!.", path });
  }

  try {
    const video = await Video.findById(existeComentario.video);
    video.comentarios.pull(existeComentario._id);
    await Promise.allSettled([
      await video.save(),
      await existeComentario.deleteOne(),
    ]);

    res.json({ msg: "Comentario Eliminado!." });
  } catch (error) {
    return next({
      error,
      code: 500,
      msg: "Error al eliminar el comentario!.",
      path,
    });
  }
};

//Agrega Like al Comentario
const darLikeComentario = async (req, res, next) => {
  const { comentario } = req.params;

  //valida el formato del id
  if (!mongoose.Types.ObjectId.isValid(comentario)) {
    const error = new Error("Acción no válida!.");
    return next({ error, code: 403, msg: "Acción no válida!.", path });
  }

  const existeComentario = await Comentario.findById(comentario)
    .populate("video")
    .populate("usuario");

  //valida que exista el comentario
  if (!existeComentario) {
    const error = new Error("El comentario no existe!.");
    return next({ error, code: 404, msg: "El comentario no existe!.", path });
  }

  //verifica si existe autentificacion o es comentario anonimo
  if (req.usuario?._id) {
    //valida si el video es privado y si el usuario no es el creador
    if (
      existeComentario.video.privado &&
      existeComentario.video.creador.valueOf() !== req.usuario._id.valueOf()
    ) {
      const error = new Error("No tienes permisos!.");
      return next({ error, code: 403, msg: "No tienes permisos!.", path });
    }
  } else {
    //valida si el video es privado
    if (existeComentario.video.privado) {
      const error = new Error("No tienes permisos!.");
      return next({ error, code: 403, msg: "No tienes permisos!.", path });
    }
  }

  existeComentario.likes++;
  try {
    await existeComentario.save();
    res.json({ msg: "Like!." });
  } catch (error) {
    return next({
      error,
      code: 500,
      msg: "Error al actualizar el comentario!.",
      path,
    });
  }
};

export {
  agregarComentario,
  obtenerComentario,
  editarComentario,
  eliminarComentario,
  darLikeComentario,
};
