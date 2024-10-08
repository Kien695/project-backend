const express = require("express");
const multer = require("multer");
const upload = multer();
const router = express.Router();
const controller = require("../../controller/admin/my-account.controller");
const uploadCloud = require("../../middekware/admin/UploadCloud.middleware");
router.get("/", controller.index);
router.get("/edit", controller.edit);
router.patch(
  "/edit",
  upload.single("avatar"),
  uploadCloud.upload,
  controller.editPatch
);
module.exports = router;
