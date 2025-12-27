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
// EcoCredit AI Routes
// ===============================

// Get or Create Simulation User
async function getSimulationUser() {
    console.log("🔍 Fetching user...");
    let { data: user, error } = await supabase
        .from("eco_users")
        .select("*")
        .eq("name", "Eco Warrior")
        .single();

    if (error || !user) {
        const { data: newUser, error: createError } = await supabase
            .from("eco_users")
            .insert([{ name: "Eco Warrior", carbon_score: 0, eco_credits: 0, badge: "Bronze" }])
            .select()
            .single();
        if (createError) throw createError;

        // Also create wallet
        await supabase.from("eco_wallet").insert([{ user_id: newUser.id, balance: 0 }]);
        return newUser;
    }
    return user;
}

// Get User Stats
app.get("/api/eco/user-stats", async (req, res) => {
    try {
        const user = await getSimulationUser();
        res.json(user);
    } catch (err) {
        console.error("User Stats Error:", err.message);
        res.status(500).json({ error: "Failed to fetch user stats" });
    }
});

// Calculate Carbon Footprint
app.post("/api/eco/calculate-footprint", async (req, res) => {
    try {
        const { travel, electricity, diet, plastic, ac } = req.body;
        const user = await getSimulationUser();

        const prompt = `
You are an eco-coach AI. Calculate the daily carbon footprint in kg CO2 and a Carbon Score (0-100, where 100 is most sustainable/lowest footprint) based on:
- Daily travel distance: ${travel} km
- Electricity units: ${electricity} kWh
- Diet: ${diet}
- Plastic usage: ${plastic}
- AC usage: ${ac} hours

Respond ONLY with a JSON object:
{
  "footprint_kg": number,
  "carbon_score": number,
  "analysis": "string"
}
`;

        const result = await geminiModel.generateContent(prompt);
        const responseText = result.response.text();
        const cleanJson = responseText.replace(/```json|```/g, "").trim();
        const data = JSON.parse(cleanJson);

        // Update User
        const { error: updateError } = await supabase
            .from("eco_users")
            .update({ carbon_score: data.carbon_score })
            .eq("id", user.id);

        if (updateError) throw updateError;

        // Log calculation
        await supabase.from("eco_logs").insert([{
            user_id: user.id,
            footprint: { travel, electricity, diet, plastic, ac },
            score: data.carbon_score
        }]);

        res.json(data);
    } catch (err) {
        console.error("Calculate Error:", err.message);
        res.status(500).json({ error: "Failed to calculate footprint" });
    }
});

// Green Coach - Suggest Actions
app.get("/api/eco/coach-actions", async (req, res) => {
    try {
        const user = await getSimulationUser();

        const prompt = `
You are an eco-coach AI. Suggest 3 daily green actions for a user with Carbon Score ${user.carbon_score}.
For each action, predict carbon saved (kg) and assign eco credits (5-50).
Motivate the user.

Respond ONLY with a JSON array of objects:
[
  { "action": "string", "carbon_saved": number, "credits": number, "motivation": "string" },
  ...
]
`;

        const result = await geminiModel.generateContent(prompt);
        const responseText = result.response.text();

        // Robust JSON extraction
        let cleanJson = responseText;
        if (responseText.includes('[')) {
            const start = responseText.indexOf('[');
            const end = responseText.lastIndexOf(']') + 1;
            cleanJson = responseText.substring(start, end);
        }

        const actions = JSON.parse(cleanJson);
        res.json(actions);
    } catch (err) {
        console.error("Coach Error:", err.message);
        res.status(500).json({ error: `AI Error: ${err.message}` });
    }
});

// Confirm Action & Reward Credits
app.post("/api/eco/confirm-action", async (req, res) => {
    try {
        const { action, credits } = req.body;
        const user = await getSimulationUser();

        const newCredits = (user.eco_credits || 0) + Number(credits);

        // Badge Logic
        let badge = "Bronze";
        if (newCredits > 700) badge = "Platinum";
        else if (newCredits > 300) badge = "Gold";
        else if (newCredits > 100) badge = "Silver";

        const { error: updateError } = await supabase
            .from("eco_users")
            .update({ eco_credits: newCredits, badge })
            .eq("id", user.id);

        if (updateError) throw updateError;

        // Update Wallet
        await supabase.rpc('increment_wallet', { user_id_val: user.id, amount: Number(credits) });
        // Note: If RPC not available, we can do a normal update. 
        // Let's do a normal update for simplicity if we don't want to define RPC.
        const { data: wallet } = await supabase.from("eco_wallet").select("balance").eq("user_id", user.id).single();
        await supabase.from("eco_wallet").update({ balance: (wallet?.balance || 0) + Number(credits) }).eq("user_id", user.id);

        res.json({ success: true, newCredits, badge });
    } catch (err) {
        console.error("Confirm Action Error:", err.message);
        res.status(500).json({ error: "Failed to confirm action" });
    }
});

// Auto Invest Recommendations
app.get("/api/eco/auto-invest", async (req, res) => {
    try {
        const user = await getSimulationUser();

        // Fetch projects
        const { data: projects } = await supabase.from("country_emissions").select("*").neq("project_type", null);

        const prompt = `
Recommend the best carbon offset projects for a user with:
- Carbon Score: ${user.carbon_score}
- Eco Credits: ${user.eco_credits}

Available Projects: ${JSON.stringify(projects)}

Respond ONLY with a JSON array of 2 recommended project objects from the list, adding a "reason" field for each.
`;

        const result = await geminiModel.generateContent(prompt);
        const responseText = result.response.text();
        const cleanJson = responseText.replace(/```json|```/g, "").trim();
        const recommendations = JSON.parse(cleanJson);

        res.json(recommendations);
    } catch (err) {
        console.error("Auto Invest Error:", err.message);
        res.status(500).json({ error: "Failed to get investment recommendations" });
    }
});

// ===============================
// Start Server
// ===============================
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
