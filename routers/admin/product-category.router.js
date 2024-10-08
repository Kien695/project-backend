const express = require("express");
const multer = require("multer");

const router = express.Router();
const upload = multer();
const controller = require("../../controller/admin/product-category.controller");
const validates = require("../../validates/admin/product-category.validate");
const uploadCloud = require("../../middekware/admin/UploadCloud.middleware");
router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validates.createPost,
  controller.createPost
);
router.get("/edit/:id", controller.edit);
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validates.createPost,
  controller.editPatch
);
router.get("/detail/:id", controller.detail);
router.delete("/delete/:id", controller.deleteItem);

module.exports = router;
