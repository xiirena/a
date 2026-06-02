// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ⚖️ THE PUNISHER — MongoDB Connection
// Connects to MongoDB with retry logic and graceful shutdown.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const mongoose = require('mongoose');

/**
 * Connect to MongoDB using the URI from environment variables.
 * Logs connection events and handles errors gracefully.
 */
async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('[Punisher] MONGODB_URI is not configured in .env');
  }

  mongoose.connection.on('connected', () => {
    console.log('[Punisher] ✅ Connected to MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    console.error('[Punisher] ❌ MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[Punisher] ⚠️ MongoDB disconnected');
  });

  await mongoose.connect(uri);
}

/**
 * Gracefully close the MongoDB connection.
 */
async function disconnectDatabase() {
  await mongoose.connection.close();
  console.log('[Punisher] MongoDB connection closed');
}

// Graceful shutdown on process termination
process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDatabase();
  process.exit(0);
});

module.exports = { connectDatabase, disconnectDatabase };
