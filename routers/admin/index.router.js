const dashboardRouters = require("./dashboard.router.js");
const productRouters = require("./product.router.js");
const productCategoryRouters = require("./product-category.router.js");
const roleRouter = require("./role.router.js");
const accountRouter = require("./account.router.js");
const authRouter = require("./auth.router.js");
const systemConfig = require("../../config/system.js");
const authMiddleware = require("../../middekware/admin/auth.middleware.js");
module.exports = (app) => {
  const partAdmin = systemConfig.prefixAdmin;
  app.use(
    partAdmin + "/dashboard",
    authMiddleware.requireAuth,
    dashboardRouters
  );
  app.use(partAdmin + "/products", authMiddleware.requireAuth, productRouters);
  app.use(
    partAdmin + "/products-category",
    authMiddleware.requireAuth,
    productCategoryRouters
  );
  app.use(partAdmin + "/roles", authMiddleware.requireAuth, roleRouter);
  app.use(partAdmin + "/accounts", authMiddleware.requireAuth, accountRouter);
  app.use(partAdmin + "/auth", authRouter);
};
