import app,{PORT} from "./app.js";

//App Server
app.listen(PORT, () => {
  console.log(`🚀 Server Escuchando en el puerto:${PORT}`);
});
