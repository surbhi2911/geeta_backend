import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/formDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));

// Define Schema & Model
const formSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
});

const Form = mongoose.model("Form", formSchema);

// API to save form data
app.post("/submit", async (req, res) => {
    try {
        const newData = new Form(req.body);
        await newData.save();
        res.status(201).json({ message: "Data saved successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API to fetch all form data
app.get("/data", async (req, res) => {
    try {
        const data = await Form.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
