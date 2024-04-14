require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const { engine } = require("express-handlebars");
const path = require("path");
require("./db/conn");
require("./seeder/seed");

const userRoute = require("./routes/userRoute");
const recipeRoute = require("./routes/recipeRoute");

const app = express();

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");

app.use(express.static(static_path));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(
  session({
    secret: "secretsession",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

app.engine('.hbs', engine({extname: '.hbs', defaultLayout: false, helpers: {
  math: function(lvalue, operator, rvalue) {lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];
}
}}));
app.set('view engine', '.hbs');
app.set('views', './views');

app.locals.success_message = "";
app.locals.error_message = "";
app.locals.admins = "";
app.locals.admin = "";
app.locals.admin_name = "";
app.locals.admin_role = "";

// Admin Routes
app.use(userRoute);
app.use(recipeRoute);

app.get("*", (req, res) => {
  res.render("404");
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
