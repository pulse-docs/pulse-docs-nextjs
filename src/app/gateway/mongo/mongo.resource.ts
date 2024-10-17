import {ConnectOptions, MongoClient, MongoClientOptions} from 'mongodb';


const MONGO_URI: string = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;
const options: MongoClientOptions = {};


let cached = global.mongoCache;

if (!cached) {
    cached = global.mongoCache = { conn: null, promise: null };
}

async function connect() {
    // Return the cached connection if available
    if (cached.conn) {
        return cached.conn;
    }

    // If there is no connection, and no promise, create a new connection
    if (!cached.promise) {
        const opts: ConnectOptions = {
        };

        cached.promise = new MongoClient(MONGO_URI, opts).connect().then((clientInstance) => {
            return clientInstance.db(process.env.MONGO_DB); // Ensure the promise resolves to mongoose.Connection
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default connect;