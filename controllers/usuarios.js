const { request, response } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");

//GET
const usuariosGet = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;

  //mostrar usuarios con state: true
  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments({ state: true }),
    Usuario.find({ state: true }).limit(limite).skip(desde),
  ]);

  res.status(200).json({
    total,
    usuarios,
  });
};

//POST
const usuarioPost = async (req = request, res) => {
  const { name, email, password, role } = req.body;

  const usuario = new Usuario({ name, email, password, role, adress, state });

  //encriptar contraseña
  const salt = bcrypt.genSaltSync();
  usuario.password = bcrypt.hashSync(password, salt);

  await usuario.save();

  res.status(201).json({
    message: "Usuario creado",
    usuario, 
  });
};

//PUT
const usuarioPut = async (req = request, res) => {
  const { id } = req.params;

  const { password, _id, email, ...resto } = req.body;

  const salt = bcrypt.genSaltSync();
  resto.password = bcrypt.hashSync(password, salt);

  const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });

  res.status(200).json({
    message: "Usuario actualizado",
    usuario,
  });
};

//DELETE
const usuarioDelete = async (req, res) => {
  const {id} = req.params;

  const usuarioBorrado = await Usuario.findByIdAndUpdate(
    id,{state: false},{new: true}
  );

  res.status(200).json({
    message: "Usuario eliminado",
    usuarioBorrado,
  });
};

module.exports = {
  usuariosGet,
  usuarioPost,
  usuarioPut,
  usuarioDelete,
};
