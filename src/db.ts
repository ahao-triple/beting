import * as mongoose from "mongoose";
import {config} from "./config/";
import logger from "./logger";

const connectDB = async () => {
    try {
        let url = `mongodb://${config.db.root}@${config.db.host}:${config.db.port}/${config.db.name}`
        // let url = `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`
        await mongoose.connect(url);
    } catch (err) {
        logger.error(err);
        process.exit(1);
    }
};

export default connectDB;