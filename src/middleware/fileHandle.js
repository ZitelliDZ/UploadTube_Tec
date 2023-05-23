import { fileURLToPath } from "url";

import upload from "../config/fileConfig.js";

const path = fileURLToPath(import.meta.url);

async function uploadFile(req, res, next) {
  //declaro promesa para poder manejar el sincronismo de subida de archivos
  const uploadPromise = new Promise((resolve, reject) => {
    upload.single("file")(req, res, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

  try {
    // La subida del archivo ha terminado
    await uploadPromise;
    next();
  } catch (error) {
    // Manejo de errores
    next({ error, code: 500, msg: "Error al subir el archivo!.", path });
  }
}

export default uploadFile;
