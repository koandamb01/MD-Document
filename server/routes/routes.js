const Controllers = require('../controllers/controllers');

module.exports = (app) => {

    app.get('/getOne/:id', Controllers.getOne);

    app.post('/register', Controllers.register);
    //done
    app.post('/login', Controllers.login);
    //done

    app.post('/updatePersonalInfo/:UserID', Controllers.updatePersonalInfo);

    app.post('/updatePassword/:UserID', Controllers.updatePassword);

    app.post('/newDocument/:UserID', Controllers.newDocument);
    //done
    app.delete('/deleteDocument/:DocId', Controllers.deleteDocument);
    //done
    app.put('/updateTitle/:DocId', Controllers.updateTitle);
    //use socket to update document need fix
    app.put('/addUserToDocument/:DocID', Controllers.addUserToDocument);
    //done
    app.post('/inviteUser/:DocId', Controllers.inviteUser);
    //need more stuff
    app.put('/removeUserFromDoc/:DocID', Controllers.removeUserFromDoc);
    //need more work 

    app.get('/checkStatus', Controllers.checkStatus);
}