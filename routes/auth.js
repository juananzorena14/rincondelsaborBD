const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

//importar el controlador
const { login } = require("../controllers/auth");
const router = Router();

router.post(
  "/login",
  [
    check("email", "El formato de correo no es válido").isEmail(),
    check("email", "El correo es obligatorio").notEmpty(),
    check("password", "La contraseña es obligatoria").notEmpty(),
    check("password", "Debe tener mínimo 8 caracteres y máximo 16").matches(
      /^.{8,16}$/
    ),
    validarCampos,
  ],
  login
);

///api/auth/login

module.exports = router;
