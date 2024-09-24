const Product = require("../../models/product.model.js");
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
