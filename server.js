const { createSocket } = require('dgram');
const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

app.use(express.urlencoded({extended: false}));
//app.use(express.json());
app.use(express.static(path.join(__dirname, './client')));

const messages = [];
const users = [];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './client/index.html'));
  });
app.use((req, res) => {
    res.status(404).send('404 not found...')
});

const server = app.listen(8000, () => {
    console.log('Server is running on Port:', 8000)
  });
  const io = socket(server);

  io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);
    socket.on('message', (message) => {
        console.log('Oh, I\'ve got something from ' + socket.id);
        messages.push(message);
        socket.broadcast.emit('message', message);
    });

    socket.on('join', (user) => {
        users.push(user);
        console.log(user.user);
        socket.broadcast.emit('join', user);
    })

    socket.on('disconnect', () => {
        // socket.broadcast.emit('removeUser', userToRemove);
        // let logout = users.indexOf(users.find(item => item.id === socket.id));
        // users.splice(logout, 1);
        // console.log('Oh, socket ' + socket.id + ' has left') 
        users.forEach(user => {
            if(user.id == socket.id){
                const index = users.indexOf(user);
                socket.broadcast.emit('removeUser', user);
                users.splice(index, 1);
            }
        }); 
    });
    console.log('I\'ve added a listener on message and disconnect events \n');
});