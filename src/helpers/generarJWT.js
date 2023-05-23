import jwt from "jsonwebtoken";

//Generar jesonWebToken
const generarJWT = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

//Verifica jesonWebToken
const verificarJWT = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export { generarJWT, verificarJWT };

export default generarJWT;
