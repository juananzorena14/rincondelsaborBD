const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { esAdminRole, tieneRol } = require("../middlewares/validar-role");

//importar función para validar si la categoría existe
const { categoriaExiste } = require("../helpers/db-validators");

const {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
} = require("../controllers/categorias");

const router = Router();

router.get("/", obtenerCategorias);

router.get(
  "/:id",
  [
    check("id", "No es un id válido").isMongoId(),
    //validar si existe la categoría
    check("id").custom(categoriaExiste),
    validarCampos,
  ],
  obtenerCategoria
);

router.post(
  "/",
  [
    validarJWT, //estamos guardando los datos del usuario en la req
    //validar si es rol administrador
    // esAdminRole,
    tieneRol("ADMIN_ROLE", "GERENTE"),
    check("nombre", "El nombre es obligatorio").notEmpty(),
  ],
  crearCategoria
);

router.put(
  "/:id",
  [
    validarJWT,
    //validar si es rol administrador
    esAdminRole,
    check("id", "No es un id válido").isMongoId(),
    //validar si existe la categoría
    check("id").custom(categoriaExiste),
    check("nombre", "El nombre es obligatorio").notEmpty(),
    validarCampos,
  ],
  actualizarCategoria
);

router.delete(
  "/:id",
  [
    validarJWT,
    //validar si es rol administrador
    esAdminRole,
    check("id", "No es un id válido").isMongoId(),
    //validar si existe la categoría
    check("id").custom(categoriaExiste),
    validarCampos,
  ],
  borrarCategoria
);

module.exports = router;
