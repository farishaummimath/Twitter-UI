const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors')
// const dotenv = require('dotenv')
// dotenv.config()

const port = 3068
const app = express();

const server = http.createServer(app);
const io = socketio(server);

app.use(bodyParser.json());
app.use(cors())


require('./config/router')(app,io)
server.listen(port, () => {
    console.log('server is running on ', port);
});