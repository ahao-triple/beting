import mongoose from 'mongoose';
import logger from '../logger';

const MONGO_URI = 'mongodb://localhost:27017/casino';

export const connectDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        logger.info('MongoDB connected');
    } catch (err) {
        logger.error({err});
        process.exit(1); // Exit the process with a failure code
    }
};
