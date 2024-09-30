const categoryMiddleware = require("../../middekware/client/category.middleware");
const cartMiddleware = require("../../middekware/client/cart.middleware");
const productsRouter = require("./products.router");
const homesRouter = require("./home.router");
const searchRouter = require("./search.router");
const cartRouter = require("./cart.router");
const checkoutRouter = require("./checkout.router");
const userRouter = require("./user.router");
module.exports = (app) => {
  app.use(categoryMiddleware.category);
  app.use(cartMiddleware.cartId);
  app.use("/", homesRouter);
  app.use("/products", productsRouter);
  app.use("/search", searchRouter);
  app.use("/cart", cartRouter);
  app.use("/checkout", checkoutRouter);
  app.use("/user", userRouter);
};

// module.exports = (app) => {
//   app.get("/", (req, res) => {
//     res.render("client/pages/home/index.pug");
//   });
//   app.get("/products", (req, res) => {
//     res.render("client/pages/products/index.pug");
//   });
// };
