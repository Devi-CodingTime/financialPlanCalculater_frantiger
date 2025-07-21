import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import authRoutes from './Route/authRoute.js';
import financeCalculaterRoute from './route/financecalculaterRoute.js';
import financedataRoute from './route/financialDataRoute.js';
import adminRoute from './route/adminRoute.js';
import { defaultAdmin } from './controller/adminController.js';
import connectDB from './config/db.js';
dotenv.config();

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());
connectDB();
await defaultAdmin();
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoute);
app.use('/api/financeData', financedataRoute);
app.use('/api/finance', financeCalculaterRoute);
app.get('/', (req, res) => {
  res.send('API is running...');
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
