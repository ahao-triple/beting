import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import {handleConnection} from './sockets/gameSocket';
import {errorHandler} from './middlewares/errorHandler';
import {connectDatabase} from './config/database';
import logger from './logger';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:7456", // 替换为你的前端应用地址
        methods: ["GET", "POST"],
        credentials: true
    }
});
const PORT = process.env.PORT || 8080;

connectDatabase().then(() => {
    app.use(cors());
    app.use(bodyParser.json());
    app.use('/auth', authRoutes);

    handleConnection(io);

    app.use(errorHandler);

    app.get('/', (req, res) => {
        res.send('Casino Game Server');
    });

    server.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });
});

