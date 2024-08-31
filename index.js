const express = require("express");

const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const flash = require("express-flash");
const path = require("path");
require("dotenv").config(); // cài đặt dotenv
const database = require("./config/database.js");

const systemConfig = require("./config/system.js");

const router = require("./routers/client/index.router");
const routerAdmin = require("./routers/admin/index.router");
database.connect();
const app = express();
const port = process.env.PORT;

app.use(methodOverride("_method"));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.set("views", `${__dirname}/views`); //cài đặt pug
app.set("view engine", "pug"); //cài đặt pug
app.use(express.static(`${__dirname}/public`)); // nhúng file tĩnh
// Flash
app.use(cookieParser("KIEN"));
app.use(session({ secret: "keyboard cat" }));
app.use(flash());

//app local variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;

//tinymce
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

//router
router(app);
routerAdmin(app);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
