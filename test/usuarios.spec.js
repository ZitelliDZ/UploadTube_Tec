import request from "supertest";

import app from "../src/app.js";
import Usuario from "../src/models/Usuario.js";

//valores y objetos de prueba
let email;
let password = "1234";
const min = 1;
const max = 500;
let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
const usuario = await Usuario.findOne({ email: "example@gmail.com" });
if (usuario) {
  email = randomNumber.toString() + "example@gmail.com";
} else {
  email = "example@gmail.com";
}

describe("El registro de un nuevo usuario - POST /api/usuarios", () => {
  test("deberia responder con un codigo de estado 200", async () => {
    const response = await request(app).post("/api/usuarios").send({
      nombre: "Diego Zitelli",
      password: password,
      email: email,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      msg: "Usuario almacenado correctamente, Revisa tu email para confirmar tu cuenta!.",
    });
  });

  test("deberia responder con un codigo de estado 403 - Usuario ya registrado.", async () => {
    const response = await request(app).post("/api/usuarios").send({
      nombre: "Diego Zitelli",
      password: password,
      email: email,
    });
    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      error: {
        msg: "Usuario ya registrado!.",
      },
    });
  });
});

describe("Autenticacion del usuario y envio de token - POST /api/usuarios/login", () => {
  test("deberia responder con un codigo de estado 404 - Cuenta no ha sido registrada", async () => {
    const response = await request(app)
      .post("/api/usuarios/login")
      .send({
        email: "1" + email,
        password: password,
      });
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      error: {
        msg: "Usuario no está registrado!.",
      },
    });
  });

  test("deberia responder con un codigo de estado 403 - Cuenta no ha sido confirmada", async () => {
    const response = await request(app).post("/api/usuarios/login").send({
      email: email,
      password: password,
    });
    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({
      error: {
        msg: "Tu cuenta no ha sido confirmada!.",
      },
    });
  });
});

describe("Confirmacion de registro del usuario - GET /api/usuarios/confirmar/:token", () => {
  test("deberia responder con un codigo de estado 403 - Token no válido!.", async () => {
    const response = await request(app)
      .get("/api/usuarios/confirmar/pejf2tteb6o1s1sug")
      .send();
    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({
      error: {
        msg: "Token no válido!.",
      },
    });
  });

  test("deberia responder con un codigo de estado 200 - Usuario confirmado correctamente!.", async () => {
    const usuario = await Usuario.findOne({ email: email });
    const response = await request(app)
      .get(`/api/usuarios/confirmar/${usuario.token}`)
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      msg: "Usuario confirmado correctamente!.",
    });
  });
});

describe("Autenticacion del usuario y envio de token - POST /api/usuarios/login", () => {
  test("deberia responder con un codigo de estado 200 - Login", async () => {
    const response = await request(app).post("/api/usuarios/login").send({
      email: email,
      password: password,
    });
    expect(response.statusCode).toBe(200);
  });

  test("deberia responder con un codigo de estado 401 - Email o Password incorrecto", async () => {
    const response = await request(app)
      .post("/api/usuarios/login")
      .send({
        email: email,
        password: password + "1",
      });
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      error: {
        msg: "El email o el password es incorrecto!.",
      },
    });
  });
});

describe("Envio de email para cambio de password - POST /reset-password", () => {
  test("deberia responder con un codigo de estado 200 - Envio de email", async () => {
    const response = await request(app)
      .post("/api/usuarios/reset-password")
      .send({
        email: email,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      msg: "Se ha enviado un email para el cambio de contraseña!.",
    });
  });

  test("deberia responder con un codigo de estado 401 - Cuenta no ha sido registrada", async () => {
    const response = await request(app)
      .post("/api/usuarios/reset-password")
      .send({
        email: "1" + email,
        password: password,
      });
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      error: {
        msg: "Usuario no está registrado!.",
      },
    });
  });
});

describe("Cambiar de password - GET /reset-password/:token", () => {
  test("deberia responder con un codigo de estado 401 - El token no es válido", async () => {
    const response = await request(app)
      .get("/api/usuarios/reset-password/ajksfhhkajsf23")
      .send({
        password: password,
      });
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      error: {
        msg: "El token no es válido!.",
      },
    });
  });

  test("deberia responder con un codigo de estado 200 - Token Válido", async () => {
    const usuario = await Usuario.findOne({ email: email });
    const response = await request(app)
      .get(`/api/usuarios/reset-password/${usuario.token}`)
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      msg: "Token válido y usuario existe!.",
    });
  });
});

describe("Cambiar de password - POST /reset-password/:token", () => {
  password = password + "1";
  test("deberia responder con un codigo de estado 401 - El token no es válido", async () => {
    const response = await request(app)
      .post("/api/usuarios/reset-password/ajksfhhkajsf23")
      .send({
        password: password,
      });
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      error: {
        msg: "El token no es válido!.",
      },
    });
  });

  test("deberia responder con un codigo de estado 200 - Cambio de password", async () => {
    const usuario = await Usuario.findOne({ email: email });
    const response = await request(app)
      .post(`/api/usuarios/reset-password/${usuario.token}`)
      .send({
        password: password,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      msg: "Password modificado con exito!.",
    });
  });
});

describe("Consultar Perfil - GET /perfil", () => {
  let bearerToken;
  test("deberia responder con un codigo de estado 200 - Login", async () => {
    const response = await request(app).post("/api/usuarios/login").send({
      email: email,
      password: password,
    });
    expect(response.statusCode).toBe(200);
    bearerToken = response.body.token;
  });
});
