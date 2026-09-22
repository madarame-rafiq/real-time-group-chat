import 'dotenv/config'
import http from "http";
import app from './app.js';
import { initializeSocket } from './sockets/index.js';


const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);

initializeSocket(httpServer);

httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});