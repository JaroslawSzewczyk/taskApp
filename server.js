const express = require('express');
const socket = require('socket.io');

const app = express();

const tasks = [];

app.use((req, res) => {
  res.status(404).json({message: '404 not found...'});
})

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {

  socket.emit('updateData', (tasks));

  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', (id) => {
    tasks.filter((task) => task.id !== id);
    socket.broadcast.emit('removeTask', id);
  });

});