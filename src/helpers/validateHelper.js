import { validationResult } from "express-validator";
import fs from "fs";

//Manejo de Errores de Express-Validator
const validateResult = (req, res, next) => {
  try {
    validationResult(req).throw();
    return next();
  } catch (err) {
    res.status(403);
    res.send({ errors: err.array() });
  }
};



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

export {validateVideoResult,validateResult};



export default validateResult;
