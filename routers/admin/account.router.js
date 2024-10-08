const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer();
const controller = require("../../controller/admin/account.controller");
const validates = require("../../validates/admin/account.validate");
const uploadCloud = require("../../middekware/admin/UploadCloud.middleware");
router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.upload,
  validates.createPost,
  controller.createPost
);
router.get("/edit/:id", controller.edit);
router.patch(
  "/edit/:id",
  upload.single("avatar"),
  uploadCloud.upload,
  validates.editPatch,
  controller.editPatch
);

module.exports = router;
