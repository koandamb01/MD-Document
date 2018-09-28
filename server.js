var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
const server = require('http').createServer(app);
const Controllers = require('./server/controllers/controllers');
var nodemailer = require('nodemailer');

var session = require("express-session")
app.set('trust proxy', 1)
app.use(session({
    secret: "dankmemesareneverdankenough",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 160000 }
}))

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './public/dist/MD-Document')));

require("./server/routes/routes")(app);

// this route will be triggered if any of the routes above did not match
app.all("*", (req, res, next) => {
    res.sendFile(path.resolve("./public/dist/MD-Document/index.html"))
});

const io = require('socket.io')(server);

// socket io
io.on('connection', function (socket) {
    console.log('User connected');
    socket.emit('connected', { response: 'You are connected!' });

    socket.on('saveDocument', (document) => {
        // Controllers.saveDocument(document, result);
        sql = `UPDATE documents SET ? WHERE id = ${document.document_id}`;
        Controllers.db.query(sql, { content: document.content }, (err, result) => {
            if (err) {
                console.log('SQL ERROR: ', err);
            }
            else {
                sql = `SELECT * FROM documents WHERE id = ${document.document_id}`;
                let query = Controllers.db.query(sql, (err, row) => {
                    if (err) {
                        console.log('SQL ERROR: ', err);
                    }
                    else {
                        io.emit('saveDocumentDone', { status: true, messages: { success: "Saving..." }, document: row[0] });
                    }
                });
            }
        });


    });


    // ############### MESSAGES LOGIC BELOW ##################
    socket.on('document_id', (docID => {
        // get all the message of that document
        sql = `SELECT users.id as user_id, users.user_name as user_name, chats.message, chats.created_at as created_at from users LEFT JOIN chats on users.id = chats.user_id LEFT JOIN documents on documents.id = chats.document_id WHERE documents.id = ${docID}`;
        let query = Controllers.db.query(sql, (err, rows) => {
            if (err) {
                console.log('SQL ERROR: ', err);
            }
            else {
                console.log("Messages: ", rows);
                io.emit('documentMessages_' + docID, { status: true, chats: rows });
            }
        });
    }));

    socket.on('send_message', (messageInfo) => {
        console.log("Message: ", messageInfo);
        sql = 'INSERT INTO chats SET ?'
        let query = Controllers.db.query(sql, messageInfo, (err, result) => {
            if (err) {
                return { status: false, messages: "MySQL error" };
            } else {
                // get all the message of that document
                sql = `SELECT users.id as user_id, users.user_name as user_name, chats.message, chats.created_at as created_at from users LEFT JOIN chats on users.id = chats.user_id LEFT JOIN documents on documents.id = chats.document_id WHERE documents.id = ${messageInfo.document_id}`;
                let query = Controllers.db.query(sql, (err, rows) => {
                    if (err) {
                        console.log('SQL ERROR: ', err);
                    }
                    else {
                        console.log("Messages: ", rows);
                        io.emit('documentMessages_' + messageInfo.document_id, { status: true, chats: rows });
                    }
                });
            }
        });
    });









    socket.on('disconnect', function () {
        console.log('User disconnected');
    });
});

server.listen(8000, () => {
    console.log("Server is running in port 8000");
});


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