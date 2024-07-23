import WebSocket, {WebSocketServer} from 'ws';
import {Player, IPlayer} from '../models/Player';
import {ERROR_CODES} from '../constants/errorCodes';
import logger from '../logger';

export const handleConnection = (server: any) => {
    const wss = new WebSocketServer({server});

    wss.on('connection', (ws: WebSocket) => {
        logger.info('New player connected');

        ws.on('message', async (message: string) => {
            const parsedMessage = JSON.parse(message);
            const {type, payload} = parsedMessage;

            switch (type) {
                case 'join':
                    await handleJoin(ws, payload.userId, wss);
                    break;
                case 'bet':
                    await handleBet(ws, payload, wss);
                    break;
                default:
                    ws.send(JSON.stringify({type: 'error', error: 'Unknown message type'}));
            }
        });

        ws.on('close', () => {
            logger.info('Player disconnected');
            const player = (ws as any).player as IPlayer;
            if (player) {
                broadcastPlayers(wss);
            }
        });
    });
};

const handleJoin = async (ws: WebSocket, userId: string, wss: WebSocketServer) => {
    try {
        const player = await Player.findOne({userId});

        if (player) {
            (ws as any).player = player;
            ws.send(JSON.stringify({type: 'welcome', player}));
            broadcastPlayers(wss);
            logger.info(`Player joined: ${player.name}`);
        } else {
            ws.send(JSON.stringify({type: 'error', error: ERROR_CODES.USER_NOT_FOUND}));
            logger.warn('Join attempt with invalid userId');
        }
    } catch (err) {
        ws.send(JSON.stringify({type: 'error', error: ERROR_CODES.INTERNAL_SERVER_ERROR}));
        logger.error(err);
    }
};

const handleBet = async (ws: WebSocket, data: { amount: number }, wss: WebSocketServer) => {
    try {
        const player = (ws as any).player as IPlayer;
        if (!player) {
            ws.send(JSON.stringify({type: 'error', error: 'You must join the game first'}));
            logger.warn('Bet attempt without joining');
            return;
        }

        if (player.balance < data.amount) {
            logger.warn(`Insufficient balance for player: ${player.name}`);
            ws.send(JSON.stringify({type: 'error', error: ERROR_CODES.INSUFFICIENT_BALANCE}));
            return;
        }

        player.balance -= data.amount;
        await player.save();

        const win = Math.random() > 0.5;
        if (win) {
            player.balance += data.amount * 2;
            await player.save();
        }

        ws.send(JSON.stringify({type: 'betResult', win, balance: player.balance}));
        broadcastPlayers(wss);
        logger.info(`Player ${player.name} placed a bet of ${data.amount}`);
    } catch (error) {
        logger.error(error);
        ws.send(JSON.stringify({type: 'error', error: ERROR_CODES.INTERNAL_SERVER_ERROR}));
    }
};

const broadcastPlayers = async (wss: WebSocketServer) => {
    try {
        const players = await Player.find({});
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({type: 'update', players}));
            }
        });
        logger.info('Broadcasted players update');
    } catch (error) {
        logger.error(error);
    }
};
