const express = require("express");
const router = express.Router();
const DataModel = require("../models/DataModel"); // Adjust the path as per your project structure
const MODE = "csv";

router.get("/", (req, res) => {
  const { make, duration, condition } = req.query;
  console.log([make, duration, condition]);
  const dataModel = new DataModel(MODE);

  dataModel
    .fetchData("inventory")
    .then((parsedData) => {
      var filteredData = parsedData;
      if (condition) {
        filteredData = filteredData.filter(
          (item) => item?.condition.toLowerCase() === condition.toLowerCase()
        );
      }

      if (make) {
        filteredData = filteredData.filter(
          (item) => make.split(",").includes(item.brand)
          //   (item) => item?.brand.toLowerCase() === make.toLowerCase()
        );
      }

      if (duration) {
        const today = new Date();
        let startDate = new Date();

        switch (duration) {
          case "thisMonth":
            startDate.setDate(1);
            break;
          case "lastMonth":
            startDate.setMonth(today.getMonth() - 1);
            break;
          case "last3Months":
            startDate.setMonth(today.getMonth() - 3);
            break;
          case "last6Months":
            startDate.setMonth(today.getMonth() - 6);
            break;
          case "thisYear":
            startDate.setMonth(0);
            startDate.setDate(1);
            break;
          case "lastYear":
            startDate.setFullYear(today.getFullYear() - 1);
            startDate.setMonth(0);
            startDate.setDate(1);
            break;
          default:
            break;
        }

        filteredData = filteredData.filter(
          (item) => item.timestamp >= startDate && item.timestamp <= today
        );
      }
      res.json(filteredData);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Failed to parse data" });
    });
});

module.exports = router;
