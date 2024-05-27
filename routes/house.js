const express = require("express");
const {
  houseCtrl,
  getAllHousesCtrl,
  houseUpdate,
  deleteHouse,
  findHouseCtrl,
} = require("../controllers/house");
const isAuthenticated = require("../middleware/isAuthenticated");
const House = require("../models/house");
const houseRouter = express.Router();

houseRouter.post("/add-house", isAuthenticated, houseCtrl);
houseRouter.get("/add-house", async (req, res) => {
  res.render("house.ejs");
});
houseRouter.get("/update-house/:id", async (req, res) => {
  const id = req.params.id;
  const house = await House.findById(id);
  res.render("updateForm.ejs", { house });
});
houseRouter.put("/update-house/:id", houseUpdate);
houseRouter.delete("/delete/:id", deleteHouse);
houseRouter.get("/filter", findHouseCtrl)
houseRouter.get("/allhouses", getAllHousesCtrl);
houseRouter.get("/filterHouses", getAllHousesCtrl);
module.exports = houseRouter;
