import express, { Request, Response } from "express";
import { GameState } from "shared";
import http from "http";
import {Server} from "socket.io";


const app = express();
const server = http.createServer(app);
const io = new Server(server);


// It would be nicer if it was defined in shared/constants 
const port = 3001;

// Define the root path with a greeting message
app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

// Start the Express server
app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});

io.on('connection', (socket) => {
    
})