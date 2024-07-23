import {Request, Response, NextFunction} from 'express';
import {ERROR_CODES} from '../constants/errorCodes';
import logger from '../logger';
import {loginUser, registerUser} from "../services/authServices";

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {username, password} = req.body;
        await registerUser(username, password);
        res.status(201).send({code: 201, message: 'User registered successfully'});
        logger.info(`User registered: ${username}`);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {username, password} = req.body;
        const token = await loginUser(username, password);
        res.send({token, websocketUrl: `ws://localhost:${process.env.PORT || 8080}`});
        logger.info(`User logged in: ${username}`);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};
