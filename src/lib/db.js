import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('CRITICAL: MONGODB_URI is not defined in any environment file (.env or .env.local).');
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
            connectTimeoutMS: 10000,        // Give it 10 seconds to connect
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log('Successfully connected to MongoDB');
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error('MongoDB Connection Error Details:', {
            message: e.message,
            code: e.code,
            name: e.name,
            hostname: e.hostname,
            syscall: e.syscall
        });

        if (e.code === 'ENOTFOUND') {
            console.error('CRITICAL: The MongoDB hostname could not be resolved. Please check your MONGODB_URI in .env.local');
        } else if (e.name === 'MongooseServerSelectionError') {
            console.error('CRITICAL: Mongoose could not connect to any servers. Verify your IP is whitelisted in MongoDB Atlas.');
        }

        throw e;
    }

    return cached.conn;
}

export default dbConnect;
