import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { apiRouter } from './routes.js';
import { db } from './db.js';

dotenv.config();

export const app = express();

// Enable CORS for same-origin and preview deployments
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  }
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});

app.use(express.json());
app.use(cookieParser());

// Health check endpoint (serves both /healthz and /api/healthz)
const healthHandler = async (_req: express.Request, res: express.Response) => {
  const dbStatus = await db.checkConnection();
  res.json({
    status: 'ok',
    app: 'CareBridge AI',
    storage: dbStatus.storage,
    databaseConnected: dbStatus.connected,
    message: dbStatus.message,
    timestamp: new Date().toISOString(),
  });
};

app.get('/healthz', healthHandler);
app.get('/api/healthz', healthHandler);

// Mount API router at both /api and root to handle any Vercel rewrite scenario
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;

