import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

// Import Routes
import authRoutes from './routes/auth';
import settingRoutes from './routes/settings';
import sectionRoutes from './routes/sections';
import serviceRoutes from './routes/services';
import priceTableRoutes from './routes/priceTables';
import sliderRoutes from './routes/sliders';
import contactRoutes from './routes/contacts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/price-tables', priceTableRoutes);
app.use('/api/sliders', sliderRoutes);
app.use('/api/contacts', contactRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Accounting Clone API is running...');
});

// Start Server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
