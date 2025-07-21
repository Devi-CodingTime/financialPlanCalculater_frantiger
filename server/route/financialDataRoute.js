import express from 'express';
import { getFinancialData, updateFinancialData } from "../controller/financialDataController.js";
import { requireSignIn } from '../middleware/requireSingnIn.js';

const router = express.Router();

router.post('/save', requireSignIn, updateFinancialData);
router.get('/retrieve', requireSignIn, getFinancialData);
export default router;