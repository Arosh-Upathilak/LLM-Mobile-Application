import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/userRoutes.js';
import courseRouter from './routes/courseRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({limit:"100mb"}));

// Route
app.get('/', (req, res) => {
  res.json({ message: 'Backend is running' });
});
app.use('/api/user',userRouter);
app.use('/api/course',courseRouter);
app.use('/api/notification',notificationRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
