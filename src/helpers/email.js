import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
  const { email, nombre, token } = datos;

  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //email para la confirmacion de cuenta
  await transporter.sendMail({
    from: '"Email de la Prueba Tecnica - Administrador" <cuentas@PruebaTec.com>',
    to: email,
    subject: "Prueba Tecnica - Comprueba tu cuenta",
    text: "Comprueba tu cuenta de PruebaTecnica",
    html: ` <p>Hola ${nombre} Comprueba tu cuenta de la PruebaTecnica</p>
            <p>Tu cuenta esta casi lista, solo debes comprobarla en el siguiente enlace:
              <a href="${process.env.FRONTEND_URL}/confirmar-email/${token}">Comprobar cuenta</a>
            </p>
            <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
      `,
  });
};

const emailOlvidePassword = async (datos) => {
  const { email, nombre, token } = datos;

  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //email para el restablecimiento de la password
  await transporter.sendMail({
    from: '"Email de la Prueba Tecnica - Administrador" <cuentas@Task.com>',
    to: email,
    subject: "Prueba Tecnica - Has Olvidado tu Password",
    text: "Restablece tu Password",
    html: ` <p>Hola ${nombre} has olvidado tu password de la PruebaTecnica</p>
            <p>Presiona el siguiente link para restablecer tu password:
              <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer Password</a>
            </p>
            <p>Si tu no has realizado el pedido de restablecimiento, puedes ignorar el mensaje</p>
      `,
  });
};

export { emailRegistro, emailOlvidePassword };

export default emailRegistro;
