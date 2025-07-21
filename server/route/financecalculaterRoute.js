import express from "express";
import { calculateUserFinance } from "../controller/userFinanceController.js";
import { requireSignIn } from "../middleware/requireSingnIn.js";
const router = express.Router();

router.post('/calculate',requireSignIn, calculateUserFinance);
export default router;
    