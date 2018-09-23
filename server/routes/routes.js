const Controllers = require('../controllers/controllers');

module.exports = (app) => {
    app.post('/register', Controllers.register);

    app.post('/login', Controllers.login);

    app.post('/updateProfile/:UserID', Controllers.updateProfile);

    app.post('/newDocument/:UserID', Controllers.newDocument);

    app.delete('/deleteDocument/:DocId', Controllers.deleteDocument);

    app.put('/updateTitle/:DocId', Controllers.updateTitle);
    //use socket to update document
    app.put('/addUserToDocument', Controllers.addUserToDocument);

    app.post('/inviteUser/:DocId', Controllers.inviteUser);

    app.put('/removeUserFromDoc/:email', Controllers.removeUserFromDoc);
}