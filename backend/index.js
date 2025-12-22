// ===============================
// Load Environment Variables
// ===============================
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

// ===============================
// Imports
// ===============================
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// ===============================
// App Setup
// ===============================
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// ===============================
// Supabase Setup
// ===============================
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Supabase environment variables missing");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ===============================
// Gemini AI Setup
// ===============================
if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY missing in .env");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// We use 2.5-flash as it was confirmed working with current quota
const geminiModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
});

// ===============================
// Routes
// ===============================

// Health Check
app.get("/", (req, res) => {
    res.send("✅ Carbon Offset Marketplace API is running");
});

// -------------------------------
// Emissions Data
// -------------------------------
app.get("/api/emissions", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("country_emissions")
            .select("*")
            .order("co2_emission", { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error("Emissions Error:", err.message);
        res.status(500).json({ error: "Failed to fetch emissions data" });
    }
});

// -------------------------------
// Offset Projects
// -------------------------------
app.get("/api/offset-projects", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("country_emissions")
            .select("*")
            .neq("project_type", null);

        if (error) throw error;

        const projects = data.map(row => ({
            id: row.id,
            country: row.country,
            code: row.code,
            year: row.year,
            project_type: row.project_type,
            status: row.offset_status,
            co2_emission: Number(row.co2_emission),
            credits_needed: Number(row.credits_needed),
            price_per_credit: Number(row.price_per_credit),
            offset_cost: Number(row.offset_cost),
            population: Number(row.population),
            area: Number(row.area),
            percent_of_world: Number(row.percent_of_world)
        }));

        res.json(projects);
    } catch (err) {
        console.error("Projects Error:", err.message);
        res.status(500).json({ error: "Failed to fetch offset projects" });
    }
});

// -------------------------------
// Dashboard Summary
// -------------------------------
app.get("/api/dashboard-summary", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("country_emissions")
            .select("co2_emission, credits_needed, offset_cost");

        if (error) throw error;

        const totalEmissions = data.reduce(
            (sum, r) => sum + Number(r.co2_emission || 0),
            0
        );

        const totalOffsets = data.reduce(
            (sum, r) => sum + Number(r.credits_needed || 0),
            0
        );

        const netCarbon = data.reduce(
            (sum, r) => sum + Number(r.offset_cost || 0),
            0
        );

        res.json({
            totalEmissions,
            totalOffsets,
            netCarbon
        });
    } catch (err) {
        console.error("Dashboard Error:", err.message);
        res.status(500).json({ error: "Failed to generate dashboard summary" });
    }
});

// -------------------------------
// Gemini AI Chatbot
// -------------------------------
app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const prompt = `
You are EcoRoute, a sustainability assistant for a carbon offset platform.
Answer clearly, briefly, and in beginner-friendly language.
Focus only on sustainability, emissions, and carbon offset topics.

User question: ${message}
`;

        const result = await geminiModel.generateContent(prompt);
        const reply = result.response.text();

        res.json({ reply });
    } catch (err) {
        console.error("Gemini Error:", err.message);

        let clientError = "AI assistant is temporarily unavailable";
        if (err.message.includes("429")) {
            clientError = "Quota exceeded. Please wait a minute before asking another question.";
        } else if (err.message.includes("404")) {
            clientError = "AI model not found. Retrying with alternative configuration...";
        }

        res.status(500).json({ error: clientError });
    }
});

// ===============================
// Start Server
// ===============================
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
