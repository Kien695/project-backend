const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
// [get] /admin/role

module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Role.find(find);
  res.render("admin/pages/roles/index", {
    pageTitle: "Nhóm quyền",
    records: records,
  });
};
// [get] /admin/role/create

module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create", {
    pageTitle: "Tạo nhóm quyền",
  });
};
// [post] /admin/role/createPost

module.exports.createPost = async (req, res) => {
  const record = new Role(req.body);
  await record.save();
  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};
// [get] /admin/role/edit/:id

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    let find = {
      _id: id,
      deleted: false,
    };
    const data = await Role.findOne(find);

    res.render("admin/pages/roles/edit", {
      pageTitle: "Sửa nhóm quyền",
      data: data,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};
// [patch] /admin/role/edit/:id

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    await Role.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại!");
  }
  res.redirect("back");
};
// [get] /admin/role/edit/permissions

module.exports.permissions = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Role.find(find);

  res.render("admin/pages/roles/permissions", {
    pageTitle: "Phân quyền",
    records: records,
  });
};
// [patch] /admin/role/edit/permissionsPatch

module.exports.permissionsPatch = async (req, res) => {
  try {
    const permissions = JSON.parse(req.body.permissions);
    for (const item of permissions) {
      await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
    }
    req.flash("success", "Cập nhật thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại!");
  }
  res.redirect("back");
};
//xóa mềm
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  await Role.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedAt: new Date(),
    }
  );
  `Đã xóa thành công nhóm quyền!`;

  res.redirect("back");
};
// [get] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
  try {
    console.log(req.params.id);
    const find = {
      deleted: false,

      _id: req.params.id,
    };
    const role = await Role.findOne(find);
    console.log(role);
    res.render("admin/pages/roles/detail", {
      pageTitle: role.title,
      role: role,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};
