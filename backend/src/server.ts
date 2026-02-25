import dotenv from 'dotenv';
dotenv.config();

// Import DB first to initialize the schema before routes use it
import './config/database';

import app from './app';

const PORT = parseInt(process.env.PORT ?? '3001', 10);

app.listen(PORT, () => {
  console.log(`[server] Running on http://localhost:${PORT}`);
  console.log(`[server] Environment: ${process.env.NODE_ENV ?? 'development'}`);
});
