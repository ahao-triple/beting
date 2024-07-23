import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {User} from '../models/User';
import {Player} from '../models/Player';
import {ERROR_CODES} from '../constants/errorCodes';
import logger from '../logger';

const SECRET_KEY = 'your_secret_key';

export const registerUser = async (username: string, password: string) => {
    const existingUser = await User.findOne({username});

    if (existingUser) {
        const error = new Error('User already exists');
        error.name = ERROR_CODES.USER_EXISTS;
        logger.warn(`Registration attempt for existing user: ${username}`);
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({username, password: hashedPassword});
    await user.save();

    const player = new Player({userId: user._id, name: username, balance: 1000});
    await player.save();

    logger.info(`New user registered: ${username}`);
};

export const loginUser = async (username: string, password: string) => {
    const user = await User.findOne({username});

    if (!user) {
        const error = new Error('User not found');
        error.name = ERROR_CODES.USER_NOT_FOUND;
        logger.warn(`Login attempt for non-existent user: ${username}`);
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        const error = new Error('Invalid password');
        error.name = ERROR_CODES.INVALID_PASSWORD;
        logger.warn(`Invalid password attempt for user: ${username}`);
        throw error;
    }

    const token = jwt.sign({id: user._id}, SECRET_KEY, {expiresIn: '1h'});
    logger.info(`User logged in: ${username}`);
    return token;
};
