const express = require('express');
const fs = require('fs');
const readlastlines = require('read-last-lines');
const socketio = require('socket.io');
const { port, env } = require('./config/var');

const app = express();

const io = socketio(3000);

app.use('/tail', express.static('public'));

app.listen(port, () => console.info(`server started on port ${port} (${env})`));

const file = '~/logs/app.log';

io.of('tail').on('connection', (socket) => {
  fs.watchFile(file, () => {
    readlastlines.read(file, 10).then((lines) => socket.emit('filechanged', { text: lines, changedAt: Date().toString() }));
  });
});

module.exports = app;
