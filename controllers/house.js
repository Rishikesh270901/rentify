const House = require("../models/house");
const asynchandler = require("express-async-handler");
const User = require("../models/user");
const cloudinary = require('cloudinary');
const { request } = require("express");
const houseCtrl = asynchandler(async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).json({
      message: "Please upload the file",
    });
  }
  const { image } = req.files;
  const allowedformats = ["image/png", "image/jpeg", "image/webp", "image/jpg"];
  if (!allowedformats.includes(image.mimetype)) {
    res.status(400).json({
      message: "Please upload the file with the format specified",
    });
  }
  const { place, cost, sqft, bhk, address } = req.body;
  const categories = req.body.categories;
  if (!place || !cost || !sqft || !bhk || !address || !categories) {
    res.status(400).json({
      status: "failed",
      message: "All fields are required",
    });
  }

  const cloudinaryresponse = await cloudinary.uploader.upload(
    image.tempFilePath
  );
  console.log(cloudinaryresponse);
  if (!cloudinaryresponse || cloudinaryresponse.error) {
    console.error(
      "Cloudinary Error : ",
      cloudinaryresponse.error || "unknown cloudinary error"
    );
  }
  const newHouse = new House({
    place,
    cost,
    sqft,
    bhk,
    image: {
      public_id: cloudinaryresponse.public_id,
      url: cloudinaryresponse.secure_url,
    },
    address,
    categories
  });
  await newHouse.save();

  const userFound = await User.findById(req?.user?.id);
  //   console.log(userFound);
  userFound.house.push(newHouse);
  await userFound.save();
  res.redirect("/api/v1/users/profile");
  res.status(200).json({
    status: "success",
    newHouse,
    message: "House saved successfully",
  });
});

const getAllHousesCtrl = asynchandler(async (req, res) => {
  const houses = await House.find();
  res.status(200).json({
    status: "success",
    houses,
  });
});

const findHouseCtrl = async (req, res) => {
  try {
    // Extract parameters from query string
    const {place}  = req.query;
    // console.log(req.body);
    // Check if place parameter is provided
    if (!place) {
      return res.status(400).json({
        status: "failed",
        message: "Please provide a place parameter",
      });
    }
    // Find houses based on the filter
    const foundHouse = await House.find({ place: place });
    console.log(foundHouse);
    // Check if any houses were found
    if (foundHouse.length === 0) {
      return res.status(404).json({
        status: "failed",
        message: "No houses found with the provided criteria",
      });
    }
    const isLoggedIn = req.cookies.token;
    // Render the filterPage view with found houses
    res.render('filter.ejs', { foundHouse, isLoggedIn });
    res.json({
      message : "Filter has been found"
    })

  } catch (error) {
    console.error("Error in findHouseCtrl:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};


const houseUpdate = asynchandler(async (req, res) => {
  const { place, cost, sqft, bhk } = req.body;
  const house = await House.findByIdAndUpdate(
    req.params.id,
    { place, cost, sqft, bhk },
    { new: true, runValidators: true }
  );

  if (!house) {
    return res.status(404).json({ message: "House not found" });
  }
  await house.save();
  res.redirect("/api/v1/users/profile");
  res.status(200).json({ message: "House updated successfully", house });
});

const deleteHouse = asynchandler(async (req, res) => {
  const id = req.params.id;
  await House.deleteOne({_id: id});
  res.redirect("/api/v1/users/profile");
});

const filterHouse = asynchandler(async (req, res) => {
  const categories = req.query.categories;
  const place = req.query.place;
  console.log(req.query);
  if(categories && place){
    const filter = await House.find({categories, place})
    if(!filter) {
      res.status(200).json({
        message : "No such filter"
      })
    }
    console.log(filter);
    const isLoggedIn = req.cookies.token;
    res.render('filter', { foundHouse: filter , isLoggedIn});
  }
})

module.exports = {
  houseCtrl,
  getAllHousesCtrl,
  findHouseCtrl,
  houseUpdate,
  deleteHouse,
  filterHouse
};
