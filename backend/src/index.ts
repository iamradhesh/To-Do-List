import express, { type Application, type Request, type Response } from 'express';
import cors, { type CorsOptions } from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import taskRoutes from './routes/taskRoutes';
import { notFound, errorHandler } from './middleware/errorHandler';

// Load environment variables (from .env locally)
dotenv.config();

// Create Express app
const app: Application = express();

// Connect to MongoDB
connectDB();

// --- CORS CONFIGURATION (Wildcard Method) ---

const wildcardCorsOptions: CorsOptions = {
    // 💡 Setting origin to '*' allows ANY domain to access your API.
    // Use this *only* for testing/debugging or if your API is public.
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true, // If you ever use cookies/sessions
};

// Middleware
app.use(cors(wildcardCorsOptions)); // 💡 Using the wildcard CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check route
app.get('/', (req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'Todo API is running!',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api/tasks', taskRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`⚠️ CORS: Wildcard (*) is active. Not recommended for production.`);
});

export default app;
