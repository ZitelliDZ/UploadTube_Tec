import { validationResult } from "express-validator";
import fs from "fs";

//Manejo de Errores de Express-Validator
const validateVideoResult = (req, res, next, path) => {
  try {
    validationResult(req).throw();
    return next();
  } catch (err) {
    fs.unlinkSync(path);
    res.status(403);
    res.send({ errors: err.array() });
  }
};

export default validateVideoResult;
