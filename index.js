import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://surbhipansuriya772:ROxZBDOlzQjlF9iD@solardb.3lyp9.mongodb.net/Geeta", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define Schema
const FormSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
});

// Create Model
const FormModel = mongoose.model("Data", FormSchema);

// API Route to Handle Form Submission
app.post("/api/form", async (req, res) => {
    try {
        const newForm = new FormModel(req.body);
        await newForm.save();
        res.status(201).json({ message: "Form submitted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to submit form" });
        console.log(error);

    }
});


