const categoryMiddleware = require("../../middekware/client/category.middleware");
const productsRouter = require("./products.router");
const homesRouter = require("./home.router");
const searchRouter = require("./search.router");
module.exports = (app) => {
  app.use(categoryMiddleware.category);
  app.use("/", homesRouter);
  app.use("/products", productsRouter);
  app.use("/search", searchRouter);
};

// module.exports = (app) => {
//   app.get("/", (req, res) => {
//     res.render("client/pages/home/index.pug");
//   });
//   app.get("/products", (req, res) => {
//     res.render("client/pages/products/index.pug");
//   });
// };
