const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "system",
    database: process.env.DB_NAME || "isro_db"
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        process.exit(1);
    }
    console.log("Connected to the database!");
});

// CRUD operations for missions table
app.get("/missions", (req, res) => {
    db.query("SELECT * FROM missions", (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

app.post("/missions", (req, res) => {
    const { name, launch_date, status } = req.body;
    if (!name || !launch_date || !status) {
        return res.status(400).json({ error: "All fields are required" });
    }
    db.query("INSERT INTO missions (name, launch_date, status) VALUES (?, ?, ?)",
        [name, launch_date, status], (err, result) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.status(201).json({ message: "Mission added", missionId: result.insertId });
        });
});

app.put("/missions/:id", (req, res) => {
    const { name, launch_date, status } = req.body;
    const { id } = req.params;
    if (!name || !launch_date || !status) {
        return res.status(400).json({ error: "All fields are required" });
    }
    db.query("UPDATE missions SET name = ?, launch_date = ?, status = ? WHERE id = ?",
        [name, launch_date, status, id], (err, result) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json({ message: "Mission updated" });
        });
});

app.delete("/missions/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM missions WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "Mission deleted" });
    });
});

// CRUD operations for satellites table
app.get("/satellites", (req, res) => {
    db.query("SELECT * FROM satellites", (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

app.post("/satellites", (req, res) => {
    const { name, mission_id } = req.body;
    if (!name || !mission_id) {
        return res.status(400).json({ error: "All fields are required" });
    }
    db.query("INSERT INTO satellites (name, mission_id) VALUES (?, ?)", [name, mission_id], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.status(201).json({ message: "Satellite added", satelliteId: result.insertId });
    });
});

app.put("/satellites/:id", (req, res) => {
    const { name, mission_id } = req.body;
    const { id } = req.params;
    if (!name || !mission_id) {
        return res.status(400).json({ error: "All fields are required" });
    }
    db.query("UPDATE satellites SET name = ?, mission_id = ? WHERE id = ?",
        [name, mission_id, id], (err, result) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json({ message: "Satellite updated" });
        });
});

app.delete("/satellites/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM satellites WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "Satellite deleted" });
    });
});

// CRUD operations for scientists table
app.get("/scientists", (req, res) => {
    db.query("SELECT * FROM scientists", (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

app.post("/scientists", (req, res) => {
    const { name, expertise } = req.body;
    if (!name || !expertise) {
        return res.status(400).json({ error: "All fields are required" });
    }
    db.query("INSERT INTO scientists (name, expertise) VALUES (?, ?)", [name, expertise], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.status(201).json({ message: "Scientist added", scientistId: result.insertId });
    });
});

app.put("/scientists/:id", (req, res) => {
    const { name, expertise } = req.body;
    const { id } = req.params;
    if (!name || !expertise) {
        return res.status(400).json({ error: "All fields are required" });
    }
    db.query("UPDATE scientists SET name = ?, expertise = ? WHERE id = ?",
        [name, expertise, id], (err, result) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json({ message: "Scientist updated" });
        });
});

app.delete("/scientists/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM scientists WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "Scientist deleted" });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
