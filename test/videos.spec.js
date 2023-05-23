import request from "supertest";

import app from "../src/app.js";
import Video from "../src/models/Video.js";
import Usuario from "../src/models/Usuario.js";

let email = "example@gmail.com";
let idVideoPublico, idVideoPrivado;
const usuario = await Usuario.findOne({ email: email });

//video prueba publico
let video = new Video();
video.creador = usuario._id;
video.titulo =
  "El reality show de las situaciones más embarazosas: ¡prepárate para reír!.";
video.descripcion =
  "En este hilarante reality show, te invitamos a sumergirte en un mundo lleno de momentos vergonzosos y divertidos. Los concursantes se enfrentarán a desafíos extravagantes y situaciones embarazosas mientras intentan mantener la compostura y evitar estallar en risas incontrolables.";
video.creditos = "ChatGPT";
video.privado = false;
video.path = `public/videos/asfjkabfgj.mkv`;
let videoAlmacenado = await video.save();
idVideoPublico = videoAlmacenado._id;

//video prueba privado
video = new Video();
video.creador = usuario._id;
video.titulo =
  "El reality show de las situaciones más embarazosas: ¡prepárate para reír!.";
video.descripcion =
  "En este hilarante reality show, te invitamos a sumergirte en un mundo lleno de momentos vergonzosos y divertidos. Los concursantes se enfrentarán a desafíos extravagantes y situaciones embarazosas mientras intentan mantener la compostura y evitar estallar en risas incontrolables.";
video.creditos = "ChatGPT";
video.privado = true;
video.path = `public/videos/asldashfaf.mp4`;
videoAlmacenado = await video.save();
idVideoPrivado = videoAlmacenado._id;

describe("Buscar y Guardar Videos - GET /api/videos", () => {
  test("deberia responder con un codigo de estado 200 - Buscar Videos", async () => {
    const response = await request(app).get("/api/videos").send();
    expect(response.statusCode).toBe(200);
  });
});

describe("Buscar Video - GET /api/videos/:id", () => {
  test("deberia responder con un codigo de estado 404 - Video no existe.", async () => {
    const response = await request(app)
      .get("/api/videos/646c8e32d93ba88255e96ed1")
      .send();
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: {
        msg: "El video no existe!.",
      },
    });
  });

  test("deberia responder con un codigo de estado 403 - No se puede consultar video privado.", async () => {
    const response = await request(app)
      .get(`/api/videos/${idVideoPrivado}`)
      .send();
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: {
        msg: "No tienes permisos!.",
      },
    });
  });

  test("deberia responder con un codigo de estado 200 - Buscar video.", async () => {
    const response = await request(app)
      .get(`/api/videos/${idVideoPublico}`)
      .send();
    expect(response.status).toBe(200);
  });
});

describe("Editar Video - POST /api/videos/:id", () => {
  test("deberia responder con un codigo de estado 404 - No existe el video.", async () => {
    const response = await request(app)
      .post("/api/videos/646ca2adfbbad73fa151c7ab")
      .send({
        titulo: "Titulo Edit",
        descripcion: "Comentario Edit",
        creditos: "Creditos Edit",
        privado: "false",
      });
    expect(response.statusCode).toBe(404);
  });

  test("deberia responder con un codigo de estado 403 - No tienes Permisos.", async () => {
    const response = await request(app)
      .post(`/api/videos/${idVideoPrivado}`)
      .send();
    expect(response.statusCode).toBe(404);
  });

  /*Problema con el envio de Bearer Token
  test("deberia responder con un codigo de estado 200 - Video Editado.", async () => {
    const response = await request(app)
      .post(`/api/videos/${idVideoPrivado}`)
      .send();
    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({
      error: {
        msg: "No tienes permisos!.",
      },
    });
  });*/
});
