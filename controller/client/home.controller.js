const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/product");
// [get]
module.exports.index = async (req, res) => {
  //lấy ra sản phẩm nổi bật
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  });
  const newProducts = productsHelper.priceNewProducts(productsFeatured);

  // hết lấy ra sản phẩm nổi bật
  //lấy ra sản phẩm mới nhất
  const productsNew = await Product.find({
    deleted: false,
    status: "active",
  }).sort({ position: "desc" });
  const newProductsNew = productsHelper.priceNewProducts(productsNew);
  //hết lấy ra sản phẩm mới nhất
  res.render("client/pages/home/index.pug", {
    pageTitle: "Trang gốc",
    productsFeatured: newProducts,
    productsNew: newProductsNew,
  });
};
