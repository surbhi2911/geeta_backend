import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
    .connect("mongodb+srv://surbhipansuriya772:ROxZBDOlzQjlF9iD@solardb.3lyp9.mongodb.net/Geeta")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("DB Connection Error:", err));

// Schema & Model
const ItemSchema = new mongoose.Schema({
    name:String,
    email:String,
    phnumber:Number,
    address:String,
    area:String,
});

const Item = mongoose.model("data", ItemSchema);

// Create API (POST)
app.post("/", async (req, res) => {
    try {
        const newItem = new Item(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(500).json({ error: "Error saving item" });
    }
});

// Get API (GET)
app.get("/", async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: "Error fetching items" });
    }
});

// Start Server
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
