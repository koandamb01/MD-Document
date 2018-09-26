const Controllers = require('../controllers/controllers');
const { check, validationResult } = require('express-validator/check');

module.exports = (app) => {

    // app.get('/createdb', (req, res) => {
    //     let sql = 'CREATE DATABASE md_document';
    //     db.query(sql, (err, result) => {
    //         if (err) { console.log("create error: ", err) }
    //         console.log("result: ", result);
    //         res.send("database created");
    //     });
    // })

    app.post('/register', [
        check('first_name').isLength({ min: 2 }).withMessage('Must be at least 2 characters'),
        check('last_name').isLength({ min: 2 }).withMessage('Must be at least 2 characters'),
        check('user_name').isLength({ min: 2 }).withMessage('Must be at least 2 characters'),
        check('email').isEmail().withMessage('Email is Invalid'),
        check('password').isLength({ min: 8 }).withMessage('Must be at least 8 characters'),
    ], Controllers.register);

    app.post('/login', [check('email').isEmail()], Controllers.login);


    // app.get('/getOne/:id', Controllers.getOne);

    // //done
    // //done

    // app.post('/updatePersonalInfo/:UserID', Controllers.updatePersonalInfo);

    // app.post('/updatePassword/:UserID', Controllers.updatePassword);

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