import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';

import generalRoutes from "./routes/general.js";
import detectionsRoutes from "./routes/detections.js";
import userRoutes from "./routes/users.js";
import notificationRoutes from "./routes/notifications.js";
import uploadRoutes from "./routes/upload.js";
import webhookRoutes from "./routes/webhook.js"; // Import webhook routes

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* CONFIGURATION */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded video files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ROUTES */
app.use("/general", generalRoutes);
app.use("/api/detections", detectionsRoutes);
app.use("/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/webhook", webhookRoutes); // Add webhook routes

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;

mongoose.set('strictQuery', true); // or false, based on your preference

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ONLY ADD DATA ONE TIME */
    //AffiliateStat.insertMany(dataAffiliateStat);
    //OverallStat.insertMany(dataOverallStat);
    //Product.insertMany(dataProduct);
    //ProductStat.insertMany(dataProductStat);
    //Transaction.insertMany(dataTransaction);
    //User.insertMany(dataUser);
  })
  .catch((error) => console.log(`${error} did not connect`));
