import mongoose from 'mongoose';
import logger from '../logger';
import {config} from "./index";

let url = `mongodb://${config.db.root}@${config.db.host}:${config.db.port}/${config.db.name}`
const MONGO_URI = url;

export const connectDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        logger.info('MongoDB connected');
    } catch (err) {
        logger.error({err});
        process.exit(1); // Exit the process with a failure code
    }
};
