const express = require("express");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");
const path = require("path");
const cookieParser = require("cookie-parser");
const { checkAuthentication, restrictTo } = require("./middleWare/auth");
//routes
const urlRoute = require("./routes/url");
const staticRouter = require("./routes/staticRouter");
const userRoutes = require("./routes/user");

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(() =>
  console.log("MongoDB Connected!")
);

//set view engine / for server site rendering and we useing ejs engine
app.set("view engine", "ejs");

//set ejs file path
app.set("views", path.resolve("./views"));

//MiddleWare - plugin
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //send form data
app.use(cookieParser());
app.use(checkAuthentication);

//REGISTRE
app.use("/url", restrictTo(["NORMAL", "ADMIN"]), urlRoute);
app.use("/user", userRoutes);
app.use("/", staticRouter);
app.use("/assets", express.static("assets"));

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    { $push: { visiteHistory: { timestramp: Date.now() } } }
  );
  if (!entry) {
    console.log("Wrong ID: ", shortId);
    return res
      .status(404)
      .send("The link you are trying to access is not valid.");
  }
  res.redirect(entry.redirectURL);
});
app.listen(PORT, () => console.log(`Server is Started on PORT: ${PORT}`));
