const Product = require("../../models/product.model.js");
const ProductCategory = require("../../models/product-category.model.js");
const ProductCategoryHelper = require("../../helpers/product-category.js");
const productsHelper = require("../../helpers/product");
// [get] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });
  const newProducts = productsHelper.priceNewProducts(products);

  res.render("client/pages/products/index.pug", {
    pageTitle: "Danh sách sản phẩm",
    products: newProducts,
  });
};
// [get] /products/:slug
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      //slug: req.params.slug,
      _id: req.params.id,
    };
    const product = await Product.findOne(find);
    console.log(product);
    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(`/products`);
  }
};
// [get] /products/:slugCategory
module.exports.category = async (req, res) => {
  const category = await ProductCategory.findOne({
    slug: req.params.slugCategory,
    deleted: false,
  });

  const lisSubCategory = await ProductCategoryHelper.getSubCategory(
    category.id
  );
  const lisSubCategoryId = lisSubCategory.map((item) => item.id);
  const products = await Product.find({
    product_category_id: { $in: [category.id, ...lisSubCategoryId] },
    deleted: false,
  }).sort({ position: "desc" });

  const newProductsNew = productsHelper.priceNewProducts(products);
  res.render("client/pages/products/index", {
    pageTitle: category.title,
    products: newProductsNew,
  });
};
