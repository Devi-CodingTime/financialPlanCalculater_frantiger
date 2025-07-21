import express from 'express';
import { requireSignIn,requireAdmin } from '../middleware/requireSingnIn.js';
import { getAllFinancialData,getAllUsers, deleteUser } from '../controller/adminController.js';

const router = express.Router();
router.get('/users', requireSignIn, requireAdmin, getAllUsers)
router.get('/financial-data',requireSignIn, requireAdmin, getAllFinancialData)
router.delete('/users/:id', requireSignIn,  requireAdmin, deleteUser)

export default router;