import {Request, Response, NextFunction} from 'express';
import {ERROR_CODES} from '../constants/errorCodes';
import logger from '../logger';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err);
    switch (err.name) {
        case ERROR_CODES.USER_EXISTS:
            return res.status(400).send({code: ERROR_CODES.USER_EXISTS, message: '用户已存在'});
        case ERROR_CODES.USER_NOT_FOUND:
            return res.status(404).send({code: ERROR_CODES.USER_NOT_FOUND, message: '用户未注册'});
        case ERROR_CODES.INVALID_PASSWORD:
            return res.status(400).send({code: ERROR_CODES.INVALID_PASSWORD, message: '密码错误'});
        case ERROR_CODES.INVALID_TOKEN:
            return res.status(400).send({code: ERROR_CODES.INVALID_TOKEN, message: '登录失效，请重新登录'});
        case ERROR_CODES.INSUFFICIENT_BALANCE:
            return res.status(400).send({code: ERROR_CODES.INSUFFICIENT_BALANCE, message: 'Insufficient balance'});
        default:
            return res.status(500).send({code: ERROR_CODES.INTERNAL_SERVER_ERROR, message: 'Internal server error'});
    }
};
