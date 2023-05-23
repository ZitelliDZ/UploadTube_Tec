import {
  loggerPersonalizado500,
  loggerPersonalizado400,
  loggerPersonalizadoDefault,
  logger,
} from "../config/logsConfig.js";

// Manejor de errores Personalizados
const errorConfigPersonalizado = (error, _req, res, next) => {
  if (error) {
    const errorCode = error?.code;
    switch (true) {
      case errorCode >= 500:
        loggerPersonalizado500.error(error.error);
        return res.status(errorCode).send({ error: { msg: error.msg } });
      case errorCode >= 400 && errorCode < 500:
        loggerPersonalizado400.error(error.error);
        return res.status(errorCode).send({ error: { msg: error.msg } });
      case errorCode >= 300 && errorCode < 400:
        loggerPersonalizadoDefault.error(error);
        return res.status(errorCode).send({ error: { msg: error.msg } });
      default:
        return res.status(500).send({ msg: error.message });
    }
  }
  next();
};

//Manejo de Errores de node por Default
const errorHandle = (app) => {
  app.use(logger);
  app.use(errorConfigPersonalizado);
};

export default errorHandle;
