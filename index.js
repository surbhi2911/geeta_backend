import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import XLSX from "xlsx";
import fs from "fs";

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://surbhipansuriya772:ROxZBDOlzQjlF9iD@solardb.3lyp9.mongodb.net/formDB", {
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

        // Fetch all data
        const allData = await Form.find();

        // Convert to Excel
        const ws = XLSX.utils.json_to_sheet(allData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Form Data");

        // Save Excel file
        const filePath = "./FormData.xlsx";
        XLSX.writeFile(wb, filePath);

        res.status(201).json({ message: "Data saved & Excel generated", file: filePath });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
