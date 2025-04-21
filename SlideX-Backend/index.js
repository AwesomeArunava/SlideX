import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import cors from "cors"
import bodyParser from "body-parser";
import authRoute from './routes/authRoute.js'
import slideRoute from './routes/slideRoute.js'
const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Allow only your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

dotenv.config();
app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

app.get('/', (req, res) => {
    res.send("‘এসো হে বৈশাখ…’ বাংলা নববর্ষে প্রিয়জনদের জানান পয়লা বৈশাখের শুভেচ্ছা");
});

mongoose.connect(MONGO_URL).then(() => {
    console.log("Database is connected");
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}).catch((error)=> console.log(error))

app.use("/api/auth",authRoute)
app.use("/api/slide",slideRoute)


