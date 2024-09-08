const dashboardRouters = require("./dashboard.router.js");
const productRouters = require("./product.router.js");
const productCategoryRouters = require("./product-category.router.js");
const roleRouter = require("./role.router.js");
const systemConfig = require("../../config/system.js");
module.exports = (app) => {
  const partAdmin = systemConfig.prefixAdmin;
  app.use(partAdmin + "/dashboard", dashboardRouters);
  app.use(partAdmin + "/products", productRouters);
  app.use(partAdmin + "/products-category", productCategoryRouters);
  app.use(partAdmin + "/roles", roleRouter);
};
