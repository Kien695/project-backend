const dashboardRouters = require("./dashboard.router.js");
const productRouters = require("./product.router.js");
const systemConfig = require("../../config/system.js");
module.exports = (app) => {
  const partAdmin = systemConfig.prefixAdmin;
  app.use(partAdmin + "/dashboard", dashboardRouters);
  app.use(partAdmin + "/products", productRouters);
};
