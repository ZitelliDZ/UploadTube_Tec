import express from "express";
import dotenv from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

//config
import conectarDB from "./config/db.js";
import swaggerHandle from "./middleware/swaggerHandle.js";

//rutas
import usuarioRoutes from "./routes/usuarioRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import comentarioRoutes from "./routes/comentarioRoutes.js";

//middlewares
import checkRecursoVideo from "./middleware/checkRecursoVideo.js";
import { checkUsuario } from "./middleware/checkAuth.js";
import errorHandle from "./middleware/errorHandle.js";

const app = express();

app.use(express.json()); //puede procesar la informacion tipo json

dotenv.config(); //carga las variables de entorno
conectarDB(); //conecta la base de datos a partir de la funcion creada en la carpeta config

const PORT = process.env.APP_PORT || 4000;

//Routing
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comentarios", comentarioRoutes);

//storage - recursos
const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
app.use(
  "/api/public/videos",
  checkUsuario,
  checkRecursoVideo,
  express.static(join(CURRENT_DIR, "./src/uploads/videos"))
);

//Middleware Swagger
swaggerHandle(app, PORT);

//Middleware Errores
errorHandle(app);

export default app;

export { PORT };
