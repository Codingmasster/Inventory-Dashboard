const fs = require("fs");
const Papa = require("papaparse");
const path = require("path");

class DataModel {
  constructor(dataSourceType) {
    this.dataSourceType = dataSourceType; // Type of data source ('csv', 'mysql', etc.)
  }

  async fetchData(tableName) {
    try {
      let data;
      if (this.dataSourceType === "csv") {
        data = await this.fetchFromCsv(tableName);
      } else if (this.dataSourceType === "mysql") {
        data = await this.fetchFromMySQL(tableName);
      }
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  async fetchFromCsv(tableName) {
    return new Promise((resolve, reject) => {
      const filePath = path.join(__dirname, `../db/${tableName}.csv`);

      fs.readFile(filePath, "utf8", (err, fileData) => {
        if (err) {
          reject(err);
          return;
        }

        Papa.parse(fileData, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const parsedData = result.data.map((item) => ({
              ...item,
              price: item.price ? parseInt(item.price.replace(" USD", "")) : 0,
              timestamp: new Date(item.timestamp),
            }));
            resolve(parsedData);
          },
          error: (err) => {
            reject(err);
          },
        });
      });
    });
  }

  async fetchFromMySQL(tableName) {
    return new Promise((resolve, reject) => {
      // Replace with actual MySQL connection and query logic in future
      reject(new Error("fetchFromMySQL not implemented yet"));
    });
  }
}

module.exports = DataModel;
