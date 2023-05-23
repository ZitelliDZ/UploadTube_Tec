import swaggerUI from "swagger-ui-express";

import swaggerSpec from "../config/swaggerConfig.js";

const url = process.env.APP_URL;

//Función para configurar nuestros documentos
const swaggerHandle = (app, port) => {
  app.use(
    "/api-doc",
    swaggerUI.serve,
    swaggerUI.setup(swaggerSpec, {
      swaggerOptions: { persistAuthorization: true },
    })
  );
  app.use("/api-doc.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(
    `📚 Swagger Funcionando en ${url}:${port}/api-doc y en ${url}:${port}/api-doc.json`
  );
};

export default swaggerHandle;
