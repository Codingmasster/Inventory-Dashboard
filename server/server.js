const express = require("express");
const cors = require("cors");
const inventoryRoutes = require("./routes/InventoryRoutes");

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS for development purposes
app.use(cors());

app.use("/api/inventory", inventoryRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
