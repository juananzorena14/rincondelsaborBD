const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  //validar token
  if (!token) {
    return res.status(401).json({
      msg: "No se reconoce el token",
    });
  }

  try {
    //obtener el payload
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    //leer los datos del usuario
    const usuario = await Usuario.findById(uid);

    //si el usuario no existe
    if (!usuario) {
      return res.status(401).json({
        msg: "Token no válido",
      });
    }

    //verificar si esta activo
    if (!usuario.state) {
      return res.status(401).json({
        msg: "Token no válido",
      });
    }

    //Guardar en la request los datos del usuario validado
    req.usuario = usuario;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      msg: "Token no válido",
    });
  }
};

module.exports = {
  validarJWT,
};
