const Products = require("../../models/product.model");
const systemConfig = require("../../config/system");

const filterStatusHelper = require("../../helpers/filterStatus");
const SearchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");
const createTreeHelper = require("../../helpers/createTree");
// [get] /admin/products
module.exports.index = async (req, res) => {
  // console.log(req.query.status);
  // let filterStatus = [
  //   {
  //     name: "Tất cả",
  //     status: "",
  //     class: "",
  //   },
  //   {
  //     name: "Hoạt động",
  //     status: "active",
  //     class: "",
  //   },
  //   {
  //     name: "Dừng hoạt động",
  //     status: "inactive",
  //     class: "",
  //   },
  // ];
  // if (req.query.status) {
  //   const index = filterStatus.findIndex(
  //     (item) => item.status == req.query.status
  //   );
  //   filterStatus[index].class = "active";
  // } else {
  //   const index = filterStatus.findIndex((item) => item.status == "");
  //   filterStatus[index].class = "active";
  // }

  const filterStatus = filterStatusHelper(req.query);
  console.log(filterStatus);

  let find = {
    deleted: false,
  };
  if (req.query.status) {
    find.status = req.query.status;
  }

  //Tìm kiếm
  const objectSearch = SearchHelper(req.query);

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  //   let  keyword=""
  //   if (req.query.keyword) {
  //   keyword = req.query.keyword;
  //     const regex = new RegExp(objectSearch.keyword, "i"); //i : không phân biệt hoa thường khi tìm kiếm
  //     find.title = regex;
  //   }

  //pagination
  const countProducts = await Products.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    countProducts
  );
  // if (req.query.page) {
  //   objectPagination.currentPage = parseInt(req.query.page);
  // }
  // objectPagination.skip =
  //   (objectPagination.currentPage - 1) * objectPagination.limitItems;

  // const countProducts = await Products.countDocuments(find);
  // const totalPage = Math.ceil(countProducts / objectPagination.limitItems);
  // objectPagination.totalPage = totalPage;
  //End pagination

  //sort
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = "desc";
  } else {
    sort.position = "desc";
  }
  //end sort
  const products = await Products.find(find)
    .sort({ price: "desc" })
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);
  for (const product of products) {
    const user = await Account.findOne({
      _id: product.createdBy.account_id,
    });
    if (user) {
      product.accountFullName = user.fullName;
    }
  }
  res.render("admin/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};
// [patch] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  await Products.updateOne({ _id: id }, { status: status });
  // res.send(` ${status}- ${id}`);
  req.flash("success", "Cập nhật trạng thái thành công!");
  res.redirect("back");
};
// [patch] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  switch (type) {
    case "active":
      await Products.updateMany({ _id: { $in: ids } }, { status: "active" });
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`
      );
      break;

    case "inactive":
      await Products.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`;
      break;
    case "delete-all":
      await Products.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedAt: new Date(),
        }
      );
      `Đã xóa thành công ${ids.length} sản phẩm!`;
      break;
    case "change-position":
      for (const item of ids) {
        console.log(item);
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Products.updateOne(
          { _id: id },
          {
            position: position,
          }
        );
        `Đã cập nhật vị trí thành công ${ids.length} sản phẩm!`;
      }

      break;
    default:
      break;
  }
  res.redirect("back");
};

// [delete] /admin/products/delete/:id
//Xóa vĩnh viễn-xóa cứng

// module.exports.deleteItem = async (req, res) => {
//   const id = req.params.id;
//   await Products.deleteOne({ _id: id });
//   // res.send(` ${status}- ${id}`);
//   res.redirect("back");
// };

//xóa mềm
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  await Products.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedAt: new Date(),
    }
  );
  `Đã xóa thành công sản phẩm!`;

  res.redirect("back");
};
// [get] /admin/products/create
module.exports.create = async (req, res) => {
  console.log(res.locals.user);
  let find = {
    deleted: false,
  };

  const category = await ProductCategory.find(find);
  const newCategory = createTreeHelper.tree(category);
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm",
    category: newCategory,
  });
};
// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  if (req.body.position == "") {
    const countProducts = await Products.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  req.body.createdBy = {
    account_id: res.locals.user.id,
  };
  const product = new Products(req.body);
  await product.save();
  res.redirect(`${systemConfig.prefixAdmin}/products`);
};
// [get] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    console.log(req.params.id);
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const product = await Products.findOne(find);

    const category = await ProductCategory.find({
      deleted: false,
    });
    const newCategory = createTreeHelper.tree(category);
    res.render("admin/pages/products/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
      category: newCategory,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
// [patch] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  try {
    await Products.updateOne(
      {
        _id: req.params.id,
      },
      req.body
    );
    req.flash("success", "Cập nhật thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại!");
  }
  res.redirect("back");
};
// [get] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    console.log(req.params.id);
    const find = {
      deleted: false,

      _id: req.params.id,
    };
    const product = await Products.findOne(find);
    console.log(product);
    res.render("admin/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
