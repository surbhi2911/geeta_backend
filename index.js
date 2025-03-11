import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/formdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define Schema
const FormSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
});

// Create Model
const FormModel = mongoose.model("Form", FormSchema);

// API Route to Handle Form Submission
app.post("/api/form", async (req, res) => {
    try {
        const newForm = new FormModel(req.body);
        await newForm.save();
        res.status(201).json({ message: "Form submitted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to submit form" });
    }
});

// Start Server
app.listen(8000, () => {
    console.log("Server running on http://localhost:5000");
});
