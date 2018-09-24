var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var Chat = require('./server/models/models');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './public/dist/MD-Document')));


// // socket io
// io.on('connection', function (socket) {
//     console.log('User connected');
//     socket.on('disconnect', function () {
//         console.log('User disconnected');
//     });
//     socket.on('save-message', function (data) {
//         console.log(data);
//         io.emit('new-message', { message: data });
//     });
// });

// /* GET ALL CHATS */
// app.get('/:room', function (req, res, next) {
//     Chat.find({ room: req.params.room }, function (err, chats) {
//         if (err) return next(err);
//         res.json(chats);
//     });
// });

// /* SAVE CHAT */
// app.post('/', function (req, res, next) {
//     Chat.create(req.body, function (err, post) {
//         if (err) return next(err);
//         res.json(post);
//     });
// });


// this route will be triggered if any of the routes above did not match
app.all("*", (req, res, next) => {
    res.sendFile(path.resolve("./public/dist/public/index.html"))
});

app.listen(8000, () => {
    console.log("Server is running in port 8000");
});
