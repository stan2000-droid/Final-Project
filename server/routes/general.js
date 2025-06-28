import express from "express";
import { getUser,  createUser, unsubscribeUser } from "../controllers/general.js";

const router = express.Router();

router.get("/user/:id", getUser);
router.post("/user", createUser);

router.post("/unsubscribe", unsubscribeUser);

export default router;
