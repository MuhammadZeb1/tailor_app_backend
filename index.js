import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; // Import the new file
import imageRoutes from "./routes/imageRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js"; // New Invoice routes

dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/public", express.static(path.join(process.cwd(), "public")));

// Routes
app.use("/api/images", imageRoutes);
app.use("/api/invoices", invoiceRoutes); // CRUD for your Tailoring Invoices

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});