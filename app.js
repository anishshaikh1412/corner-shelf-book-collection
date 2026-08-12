const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const Product = require("./models/Product");

const app = express();
const PORT = 5000;

// Load MONGO_URI from .env without requiring an extra package.
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  const envLines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);

  envLines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) return;

    const index = trimmed.indexOf("=");
    if (index === -1) return;

    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();

    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

async function connectDB() {
  if (!process.env.MONGO_URI) {
    console.log("MONGO_URI is missing.");
    console.log("Create a .env file and add: MONGO_URI=your_mongodb_connection_string");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.log("MongoDB Connection Error");
    console.log(err.message);
  }
}

connectDB();

app.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";
    const sort = req.query.sort || "";

    const query = {};

    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    let products;

    if (sort === "low") {
      products = await Product.find(query).sort({ price: 1 });
    } else if (sort === "high") {
      products = await Product.find(query).sort({ price: -1 });
    } else {
      products = await Product.find(query);
    }

    res.render("index", {
      products,
      search,
      sort,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Unable to load the book collection.");
  }
});

app.get("/search", async (req, res) => {
  try {
    const search = req.query.search || "";
    const sort = req.query.sort || "";

    const query = {};

    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    let products;

    if (sort === "low") {
      products = await Product.find(query).sort({ price: 1 });
    } else if (sort === "high") {
      products = await Product.find(query).sort({ price: -1 });
    } else {
      products = await Product.find(query);
    }

    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Unable to search books." });
  }
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/add", async (req, res) => {
  try {
    const { name, price, category } = req.body;

    await Product.create({
      name: name.trim(),
      price: Number(price),
      category: category.trim(),
    });

    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Unable to add book.");
  }
});

app.get("/delete/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Unable to delete book.");
  }
});

app.get("/edit/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send("Book not found.");
    }

    res.render("edit", { product });
  } catch (err) {
    console.log(err);
    res.status(500).send("Unable to open edit page.");
  }
});

app.post("/edit/:id", async (req, res) => {
  try {
    const { name, price, category } = req.body;

    await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        price: Number(price),
        category: category.trim(),
      },
      { runValidators: true }
    );

    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Unable to update book.");
  }
});

app.listen(PORT, () => {
  console.log(`Corner Shelf is running at http://localhost:${PORT}`);
});
