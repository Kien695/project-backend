const express = require("express");
const router = express.Router();
const controller = require("../../controller/client/products.controller");
router.get("/", controller.index);
//router.get("/:slug", controller.detail);
router.get("/:id", controller.detail);
module.exports = router;
