import {
  loggerCustom500,
  loggerCustom400,
  loggerCustomDefaul,
  logger,
} from "../config/logsConfig.js";

// Manejor de errores Personalizados
const errorCustomConfig = (error, _req, res, next) => {
  if (error) {
    const errorCode = error?.code;
    switch (true) {
      case errorCode >= 500:
        loggerCustom500.error(error.error);
        return res.status(errorCode).send({ error: { msg: error.msg } });
      case errorCode >= 400 && errorCode < 500:
        loggerCustom400.error(error.error);
        return res.status(errorCode).send({ error: { msg: error.msg } });
      case errorCode >= 300 && errorCode < 400:
        loggerCustomDefaul.error(error);
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
  app.use(errorCustomConfig);
};

export default errorHandle;
