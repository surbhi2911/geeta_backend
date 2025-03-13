import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
    .connect("mongodb+srv://surbhipansuriya772:ROxZBDOlzQjlF9iD@solardb.3lyp9.mongodb.net/Geeta", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,  // Ensure indexes are created
    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("DB Connection Error:", err));

// Schema & Model
const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String },
    phnumber: { type: Number, required: true, unique: true },
    area: { type: String, required: true },
    pass: { type: Number, enum: [1, 2, 3, 4, 5], default: 1 }
});

const Item = mongoose.model("data", ItemSchema);

// Create API (POST) with Unique Validation
app.post("/", async (req, res) => {
    try {
        const { email, phnumber } = req.body;

        // Check if email or phone number already exists
        const existingUser = await Item.findOne({ $or: [{ email }, { phnumber }] });

        if (existingUser) {
            if (existingUser.phnumber === phnumber) {
                return res.status(400).json({ error: "Phone number is already in use." });
            }
        }

        // Save new item if no duplicates
        const newItem = new Item(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "Duplicate entry found." });
        }
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
