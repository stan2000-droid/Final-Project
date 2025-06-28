import express from "express";
import { getStatBox, getOverview, getBreakdown, getData, getDetectionList } from "../controllers/detections.js";

const router = express.Router();

// Get all statistics for dashboard stat boxes
router.get("/stats-box", getStatBox);

// Get overview of detections by month
router.get("/overview", getOverview);

// Get breakdown of animals vs total detections
router.get("/breakdown", getBreakdown);

// Get all detection data with basic fields
router.get("/data", getData);

// Get paginated detection list with sorting and search
router.get("/list", getDetectionList);

export default router;