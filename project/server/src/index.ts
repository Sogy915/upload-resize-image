import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { requestLogger, logger } from './utilities/logger';
import sharpRoutes from './routes/sharp';
import uploadRoute from './routes/multerUpload';
import cors from 'cors';


const app = express();
const PORT = 3000;

console.log("Server is running on port ${PORT}np");

app.use(express.static(path.join(__dirname, '../../client/public')));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/resizes', express.static(path.join(__dirname, '../resizes')));
path.join(__dirname, 'uploads')

// Middleware
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads folder exists (optional to remove if not needed)
const uploadFolder = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Serve static uploaded files (optional to remove if not needed)
app.use('/uploads', express.static(uploadFolder));

app.use(cors({
  origin:['http://localhost:3000','http://127.0.0.1:8080'] ,
  methods: ['GET', 'POST']
}));

// Routes
app.get('/', (req: Request, res: Response) => {
  logger('Root route accessed');
  res.send('Hello from Express + TypeScript!');
});

app.get('/api', (req: Request, res: Response) => {
  res.send('API working');
});

app.get('/route', (req: Request, res: Response) => {
  res.send('Hello from /route');
});

app.use('/api/images', sharpRoutes);

app.use('/api', uploadRoute);

app.get('/test', (req, res) => {
  console.log('✅ test route hit!');
  res.send('test works');
});




// Error handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.message);
  res.status(400).json({ error: err.message });
});




// Start server
app.listen(PORT, () => {
  logger(`Server running at http://localhost:${PORT}`);
});

export default app;
