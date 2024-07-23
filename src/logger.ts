import pino from 'pino';

const translateTimeToCST = () => {
    const date = new Date()
    const options = {timeZone: 'Asia/Shanghai', hour12: false}
    return date.toLocaleString('zh-CN', options).replace(/\//g, '-')
}

const logger = pino({
    level: 'info',
    transport: {
        targets: [
            {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: translateTimeToCST()
                },
                level: 'info',
            },
            {
                target: 'pino/file',
                options: {
                    destination: './logs/info.log',
                    colorize: true,
                    translateTime: translateTimeToCST()
                },
                level: 'info',
            },
            {
                target: 'pino/file',
                options: {
                    destination: './logs/error.log',
                    colorize: true,
                    translateTime: translateTimeToCST()
                },
                level: 'error',
            }
        ],
    },
});

export default logger;
