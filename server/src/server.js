import 'dotenv/config'
import http from "http";
import app from './app.js';
import { initializeSocket } from './sockets/index.js';


const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);

initializeSocket(httpServer);

httpServer.listen(PORT, () => {
    console.log(`The server is listening at port: ${PORT}`);
});