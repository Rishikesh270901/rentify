const express = require("express");
const dbConnection = require("./database/dbConnect");
const cloudinary = require("cloudinary");
const fileUpload = require('express-fileupload')
const userRouter = require("./routes/user");
const cookieParser = require("cookie-parser");
const houseRouter = require("./routes/house");
const House = require("./models/house");
const methodOverride = require('method-override');
const app = express();
require("dotenv").config();
dbConnection();
//middlewares
app.use(express.json()); //passing th incoming json data.
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); //to pass form data
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Configure method override middleware
app.use(methodOverride('_method'));
//render home page
app.get("/", async (req, res) => {
  try {
    const houses = await House.find();
    let location = [];
    houses.forEach((house)=>{
      if(location.indexOf(house.place) === -1){
        location.push(house.place);
      }
    })
    const isLoggedIn = req.cookies.token;
    res.render("home.ejs", { houses, isLoggedIn, location });
  } catch (error) {
    // res.render('index',{error:error.message})
  }
});

app.get('/about', async (req, res) => {
  const isLoggedIn = req.cookies.token
  res.render('about.ejs', {isLoggedIn})
})

app.get('/services', async (req, res) => {
  const isLoggedIn = req.cookies.token
  res.render('service.ejs', {isLoggedIn})
})

app.use("/api/v1/users", userRouter);
app.use("/api/v1/houses", houseRouter);
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLUOD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
app.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}`)
);
