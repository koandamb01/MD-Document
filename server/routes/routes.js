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

    app.get('/getOne/:userID', Controllers.getOne);

    app.post('/updatePersonalInfo/:userID', [
        check('first_name').isLength({ min: 2 }).withMessage('Must be at least 2 characters'),
        check('last_name').isLength({ min: 2 }).withMessage('Must be at least 2 characters'),
        check('user_name').isLength({ min: 2 }).withMessage('Must be at least 2 characters'),
        check('email').isEmail().withMessage('Email is Invalid')
    ], Controllers.updatePersonalInfo);

    app.post('/updatePassword/:userID', Controllers.updatePassword);

    // app.post('/newDocument/:UserID', Controllers.newDocument);
    // //done
    // app.delete('/deleteDocument/:DocId', Controllers.deleteDocument);
    // //done
    // app.put('/updateTitle/:DocId', Controllers.updateTitle);
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