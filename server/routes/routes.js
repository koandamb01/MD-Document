const Controllers = require('../controllers/controllers');
const { check, validationResult } = require('express-validator/check');

module.exports = (app) => {

    app.post('/register', [
        check('first_name').isLength({ min: 2 }).withMessage('Must be at least 2 characters'),
        check('last_name').isLength({ min: 2 }).withMessage('Must be at least 2 characters'),
        check('user_name').isLength({ min: 2 }).withMessage('Must be at least 2 characters'),
        check('email').isEmail().withMessage('Email is Invalid'),
        check('password').isLength({ min: 8 }).withMessage('Must be at least 8 characters'),
    ], Controllers.register);

    app.post('/login', [check('email').isEmail()], Controllers.login);

    app.get('/logout', Controllers.logout);

    app.get('/getOne/:userID', Controllers.getOne);

    app.post('/updatePersonalInfo/:userID', [
        check('first_name').isLength({ min: 2 }).withMessage('Must be at least 2 characters'),
        check('last_name').isLength({ min: 2 }).withMessage('Must be at least 2 characters'),
        check('user_name').isLength({ min: 2 }).withMessage('Must be at least 2 characters'),
        check('email').isEmail().withMessage('Email is Invalid')
    ], Controllers.updatePersonalInfo);

    app.post('/updatePassword/:userID', Controllers.updatePassword);

    app.get('/newDocument/:userID', Controllers.newDocument);

    app.put('/updatedocumentTitle/:docID', Controllers.updateDocumentTitle);

    app.get('/getonedocument/:docID', Controllers.getOneDocument);

    app.post('/addParticipants/:docID', Controllers.addParticipants);

    app.get('/getParticipants/:docID', Controllers.getParticipants)

    app.delete('/removeParticipants/:target/:killer/:docID', Controllers.removeParticipants)

    app.get('/getDocument', Controllers.getDocument);

    // app.delete('/deleteDocument/:DocId', Controllers.deleteDocument);
    // //done
    // //use socket to update document need fix
    // app.put('/addUserToDocument/:DocID', Controllers.addUserToDocument);
    // //done
    // app.post('/inviteUser/:DocId', Controllers.inviteUser);
    // //need more stuff
    // app.put('/removeUserFromDoc/:DocID', Controllers.removeUserFromDoc);
    // //need more work 

    // app.get('/getUser', Controllers.getUserInfo)

    // app.get('/checkStatus', Controllers.checkStatus);

}