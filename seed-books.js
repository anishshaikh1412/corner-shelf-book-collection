require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Product = require("./models/Product");

// Reads MONGO_URI from .env without an extra package.
const envPath = path.join(__dirname, ".env");

if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .forEach((line) => {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) return;

      const index = trimmed.indexOf("=");

      if (index !== -1) {
        const key = trimmed.slice(0, index).trim();
        const value = trimmed.slice(index + 1).trim();

        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
}

const books = [
  {
    name: "The Silent River",
    price: 299,
    category: "Fiction"
  },
  {
    name: "Paper Boats",
    price: 249,
    category: "Drama"
  },
  {
    name: "Midnight Stories",
    price: 349,
    category: "Mystery"
  },
  {
    name: "A Walk Through Rain",
    price: 279,
    category: "Romance"
  },
  {
    name: "The Last Garden",
    price: 319,
    category: "Adventure"
  }
];

async function seedBooks() {
  if (!process.env.MONGO_URI) {
    console.log("MONGO_URI is missing. Add it to .env first.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Product.deleteMany({});
    await Product.insertMany(books);

    console.log("Old records removed.");
    console.log("Five book records added successfully.");
  } catch (error) {
    console.log("Seed error:");
    console.log(error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedBooks();
