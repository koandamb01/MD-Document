const bcrypt = require('bcrypt-as-promised');
const { check, validationResult } = require('express-validator/check');
const mysql = require('mysql');
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const nodemailer = require('nodemailer');


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'md_document',
});

db.connect((err) => {
    if (err) {
        console.log("error: ", err);
    }
    else {
        console.log("MySQl Connected");
    }
});

module.exports = {
    db: db,
    // ######## REGISTRATION ######### //
    register: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let messages = {}
            var err = errors.mapped({ onlyFirstError: false });
            for (let key in err) {
                messages[key] = err[key].msg;
            }
            res.json({ status: false, messages: messages });
        }
        else {

            bcrypt.hash(req.body.password, 10).then((hash_pw, err) => {
                if (err) {
                    res.json({ status: false, messages: { server: "Bcrypt is not working" }, err: err })
                }
                else {
                    req.body.password = hash_pw;
                    sql = 'INSERT INTO users SET ?';
                    let query = db.query(sql, req.body, (err, result) => {
                        if (err) {
                            console.log("query error: ", err);
                        }
                        else {
                            // get the ID the record that was just inserted
                            db.query("SELECT LAST_INSERT_ID()", (err, data) => {
                                req.session.user_id = data[0]['LAST_INSERT_ID()'];
                                res.json({ status: true, messages: { success: "User successfully Register!" }, user_id: data[0]['LAST_INSERT_ID()'] })
                            });
                        }
                    });
                }
            });
        }
    },

    login: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json({ status: false, messages: { login: "Email or password invalid." } });
        }
        else {
            let data = { email: req.body.email };
            sql = 'SELECT * FROM users WHERE ?';
            db.query(sql, data, (err, user) => {
                if (err) {
                    res.json({ status: false, messages: { login: "Email or password invalid." } });
                }
                else if (user.length == 0) {
                    res.json({ status: false, messages: { login: "Email or password invalid." } });
                }
                else {
                    bcrypt.compare(req.body.password, user[0].password)
                        .then((result) => {
                            if (result) {
                                req.session.user_id = user[0].id;
                                req.session.user_name = user[0].user_name;
                                req.session.logged = true;
                                res.json({ status: true, messages: { success: "Login Sucessful" }, user_id: user[0].id });
                            }
                            else {
                                res.json({ status: false, messages: { login: "Email or password invalid." } });
                            }
                        })
                        .catch((err) => {
                            res.json({ status: false, messages: { login: "Email or password invalid." } })
                        });
                }
            });
        }
    },

    logout: (req, res) => {
        console.log("before: ", req.session)
        req.session.destroy();
        console.log("after: ", req.session);
        res.json({ status: true, messages: { success: "You are now logged out!" } });
    },

    getOne: (req, res) => {
        let data = { id: req.params.userID };
        sql = 'SELECT first_name, last_name, user_name, email FROM users WHERE ?';
        db.query(sql, data, (err, user) => {
            if (err) {
                res.json({ status: false, messages: "sql Error" });
            }
            else if (user.length == 0) {
                res.json({ status: false, messages: "sql Error" });
            }
            else {
                res.json({ status: true, user: user[0] });
            }
        });
    },

    updatePersonalInfo: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let messages = {}
            var err = errors.mapped({ onlyFirstError: false });
            for (let key in err) {
                messages[key] = err[key].msg;
            }
            res.json({ status: false, messages: messages });
        }
        else {
            sql = `UPDATE users SET ? WHERE id = ${req.params.userID}`;
            db.query(sql, req.body, (err, row) => {
                if (err) {
                    res.json({ status: false, messages: "MySQL error" });
                }
                else {
                    res.json({ status: true, messages: { success: "Personal Info successfully Updated!" } })
                }
            });
        }
    },

    updatePassword: (req, res) => {
        console.log("body: ", req.body, "id: ", req.params.userID);

        let data = { id: req.params.userID };
        sql = 'SELECT * FROM users WHERE ?';
        db.query(sql, data, (err, user) => {
            if (err) {
                res.json({ status: false, messages: { password: "1 Password missmatch" } });
            }
            else if (user.length == 0) {
                res.json({ status: false, messages: { password: "2 Password missmatch" } });
            }
            else {
                console.log("user row: ", user[0]);
                bcrypt.compare(req.body.old_password, user[0].password)
                    .then((result) => {
                        if (result) {
                            // hash new password
                            bcrypt.hash(req.body.new_password, 10).then((hash_pw, err) => {
                                if (err) {
                                    res.json({ status: false, messages: { server: "Bcrypt is not working" }, err: err })
                                }
                                else {
                                    let tempData = { password: hash_pw };
                                    sql = `UPDATE users SET ? WHERE id = ${req.params.userID}`;
                                    db.query(sql, tempData, (err, row) => {
                                        if (err) {
                                            res.json({ status: false, messages: "MySQL error" });
                                        }
                                        else {
                                            res.json({ status: true, messages: { success: "Password successfully Updated!" } })
                                        }
                                    });
                                }
                            })
                        }
                        else {
                            res.json({ status: false, messages: { old_password: "Old Password missmatch" } });
                        }
                    })
                    .catch((err) => {
                        res.json({ status: false, messages: { old_password: "Old Password missmatch" } });
                    });
            }
        });
    },


    // create a new document
    newDocument: (req, res) => {
        let data = { title: "untitled document", content: "start typing here" };
        sql = 'INSERT INTO documents SET ?'
        let query = db.query(sql, data, (err, result) => {
            if (err) {
                res.json({ status: false, messages: { error: err } });
            }
            else {
                // get the ID the record that was just inserted
                db.query("SELECT LAST_INSERT_ID()", (err, data) => {
                    var document_id = data[0]['LAST_INSERT_ID()'];
                    let ids = { user_id: req.params.userID, document_id: document_id };
                    // now insert both user id and document in the many table
                    sql = 'INSERT INTO users_documents SET ?'
                    let query = db.query(sql, ids, (err, result) => {
                        if (err) {
                            res.json({ status: false, messages: { error: err } });
                        }
                        else {
                            res.json({ status: true, messages: { success: "Document successfully Create!" }, document_id: document_id })
                        }
                    });
                });
            }
        });
    },

    // Get one document
    getOneDocument: (req, res) => {
        sql = `SELECT * FROM documents WHERE id = ${req.params.docID}`;
        let query = db.query(sql, (err, row) => {
            if (err) {
                res.json({ status: false });
            }
            else {
                res.json({ status: true, document: row[0] })
            }
        });
    },

    // update document title
    updateDocumentTitle: (req, res) => {
        sql = `UPDATE documents SET ? WHERE id = ${req.params.docID}`;
        let query = db.query(sql, req.body, (err, result) => {
            if (err) {
                res.json({ status: false, messages: err });
            }
            else {
                res.json({ status: true, messages: { success: "Document Title successfully Updated!" } })
            }
        });
    },

    // inviteParticipants: (req, res) => {
    //     sql = 'SELECT * FROM users WHERE ?';
    //     let query = db.query(sql, req.body.email, (err, user) => {
    //         if (err) {
    //             res.json({ status: false, messages: "Server Error, try again later" });
    //         }
    //         else if (user.length == 0) {
    //             res.json({ status: false, messages: "Could not find any user that matches the email" });
    //         }
    //         else {
    //             console.log(req.body)
    //             console.log(req.body.email)
    //             var transporter = nodemailer.createTransport({
    //                 service: 'gmail',
    //                 auth: {
    //                     user: 'mddocument11@gmail.com',
    //                     pass: 'codingdojo1'
    //                 }
    //             });

    //             var mailOptions = {
    //                 from: 'mddocument11@gmail.com',
    //                 to: req.body.email.email,
    //                 subject: req.body.user_name + ' wants you as a participant to a MdDocument',
    //                 text: req.body.user_name + ' would like to invite you to be a participant of the document. Click the link to accept your invitation.'
    //             };

    //             console.log(mailOptions);

    //             transporter.sendMail(mailOptions, function (error, info) {
    //                 if (error) {
    //                     console.log(error);
    //                 } else {
    //                     console.log('Email sent: ' + info.response);
    //                     res.json({ status: true, messages: "Invite Link Sent" })
    //                 }
    //             });
    //         }

    //     })
    // },

    //adding participants
    addParticipants: (req, res) => {
        sql = 'SELECT id FROM users WHERE ?';
        let query = db.query(sql, req.body, (err, target_user) => {
            if (err) {
                res.json({ status: false, messages: { error: "Server Error, try again later" } });
            }
            else if (target_user.length == 0) {
                res.json({ status: false, messages: { error: "Email doesn't exist in the system" } });
            }
            //validation here?
            else {
                let sql = `SELECT * FROM users_documents WHERE user_id = ${target_user[0].id} and document_id = ${req.params.docID}`;
                let query = db.query(sql, (err, check) => {
                    if (err) {
                        res.json({ status: false, messages: { error: "Server Error, try again later" } });
                    }
                    else if (check.length > 0) {
                        res.json({ status: false, messages: { error: "User is already part of the document" } })
                    }
                    else {
                        let ids = { user_id: target_user[0].id, document_id: req.params.docID };
                        // now insert both user id and document in the many table
                        sql = 'INSERT INTO users_documents SET ?'
                        let query = db.query(sql, ids, (err, result) => {
                            if (err) {
                                res.json({ status: false, messages: { error: "Server Error, try again later" } });
                            }
                            else {
                                var transporter = nodemailer.createTransport({
                                    service: 'gmail',
                                    auth: {
                                        user: 'mddocument11@gmail.com',
                                        pass: 'codingdojo1'
                                    }
                                });

                                var mailOptions = {
                                    from: 'mddocument11@gmail.com',
                                    to: req.body.email,
                                    subject: req.session.user_name + ' added you as a participant to a MdDocument',
                                    text: req.session.user_name + ' added you to be a participant of the document. Let us know if this was a mistake'
                                };
                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        res.json({ status: false, messages: { success: "Email not sent but added on document" } })
                                    } else {
                                        res.json({ status: true, messages: { success: "Participant successfully added!" }, data: target_user[0].id })
                                    }
                                });
                            }
                        });
                    }
                })
            }
        });
    },

    removeParticipants: (req, res) => {
        if (req.session.user_id != req.params.killer) {
            res.json({ status: false, messages: { error: "You " } })
        }
        else {
            sql = `Delete from users_documents where user_id = ${req.params.target} AND document_id = ${req.params.docID}`;
            let query = db.query(sql, (err, users) => {
                if (err) {
                    res.json({ status: false, messages: { error: "Server Error, try again later" } });
                }
                else {
                    res.json({ status: true, messages: { success: "Participant successfully removed." } })
                }
            })
        }
    },

    getParticipants: (req, res) => {
        let data = { document_id: req.params.docID };
        sql = `select users.id, first_name, last_name, email, user_name from users left join users_documents ON users_documents.user_id = users.id left join documents ON documents.id = users_documents.document_id where documents.id = ${req.params.docID};`;
        let query = db.query(sql, (err, users) => {
            if (err) {
                res.json({ status: false, messages: { error: "Server Error, try again later" } });
            }
            else if (users.length == 0) {
                res.json({ status: false, messages: { error: "Server Error, try again later" } });
            }
            //validation here?
            else {
                res.json({ status: true, participants: users });
            }
        })
    },


    // update document content on socket
    // saveDocument: (document, result) => {
    //     sql = `UPDATE documents SET ? WHERE id = ${document.document_id}`;
    //     db.query(sql, { content: document.content }, (err, result) => {
    //         if (err) {
    //             return { status: false, messages: "MySQL error" };
    //         }
    //         else {
    //             sql = `SELECT * FROM documents WHERE id = ${document.document_id}`;
    //             let query = db.query(sql, (err, row) => {
    //                 if (err) {
    //                     res.json({ status: false });
    //                 }
    //                 else {
    //                     result = { status: true, document: row[0] }
    //                 }
    //             });
    //         }
    //     });
    // },

    getDocument: (req, res) => {
        sql = `SELECT documents.id, title from documents left join users_documents ON users_documents.document_id = documents.id where users_documents.user_id = ${req.session.user_id}`;
        let query = db.query(sql, (err, documents) => {
            if (err) {
                res.json({ status: false, messages: err });
            }
            else if (documents.length == 0) {
                res.json({ status: true, messages: "No documents" });
            }
            else {
                res.json({ status: true, documents: documents });
            }
        })
    },
}



    // checkStatus: (req, res) => {
    //     if (req.session.logged == true && req.session.user_id) {
    //         res.json({ status: true, user_id: req.session.user_id });
    //     }
    //     else {
    //         res.json({ status: false });
    //     }
    // },

    // newDocument: (req, res) => {
    //     Documents.create({})
    //         .then(
    //             document => {
    //                 console.log(req.session.user_id, document)
    //                 User.findOneAndUpdate({ _id: req.session.user_id }, { $push: { documents: document } })
    //                     .then(
    //                         data => {
    //                             res.json({ status: true, messages: { success: "Document successfully created!" }, document: document })
    //                         }
    //                     )
    //                     .catch(
    //                         err => {
    //                             let messages = {}
    //                             for (let key in err.errors) {
    //                                 messages[key] = err.errors[key].message;
    //                             }
    //                             res.json({ status: false, messages: "Error Updating User" });
    //                         }
    //                     )
    //             }
    //         )
    //         .catch(
    //             err => {
    //                 let messages = {}
    //                 for (let key in err.errors) {
    //                     messages[key] = err.errors[key].message;
    //                 }
    //                 console.log("Error creating document", err)
    //                 res.json({ status: false, messages: "Error creating document" });
    //             }
    //         )
    // }, //done

    // updatePersonalInfo: (req, res) => {
    //     User.findOneAndUpdate({ _id: req.params.UserID }, { $set: { first_name: req.body.first_name, last_name: req.body.last_name, user_name: req.body.user_name, email: req.body.email } }, { runValidators: true, context: 'query' })
    //         .then(
    //             data => res.json({ status: true, messages: { success: "Personal Info successfully Updated!" }, user: data })
    //         )
    //         .catch(
    //             err => {
    //                 if (err) {
    //                     let messages = {}
    //                     for (let key in err.errors) {
    //                         messages[key] = err.errors[key].message;
    //                     }
    //                     res.json({ status: false, messages: messages });
    //                 }
    //             }
    //         )
    // },

    // // updatePassword(req, res){

    // // }

    // deleteDocument: (req, res) => {
    //     Documents.findByIdAndRemove({ _id: req.params.id })
    //         .then(
    //             data => res.json({ status: true, messages: { success: "Document Successfully Deleted!" } })
    //         )
    //         .catch(
    //             err => {
    //                 let messages = {}
    //                 for (let key in err.errors) {
    //                     messages[key] = err.errors[key].message;
    //                 }
    //                 res.json({ status: false, messages: messages });
    //             }
    //             //or add manual message

    //         )
    // }, //fix error message

    // updateTitle: (req, res) => {
    //     Documents.findOneAndUpdate({ _id: req.params.DocID }, req.boby)
    //         .then(
    //             data => {
    //                 res.json({ status: true, messages: { success: "Document Title Successfully Updated!" } })
    //             }
    //         )
    //         .catch(
    //             err => {
    //                 let messages = {}
    //                 for (let key in err.errors) {
    //                     messages[key] = err.errors[key].message;
    //                 }
    //                 res.json({ status: false, messages: messages });
    //             }
    //         )

    // },

    // addUserToDocument: (req, res) => {
    //     User.findOne({ _id: req.params.id }) //find by ID or Email
    //         .then(
    //             user => {
    //                 Documents.findOneAndUpdate({ _id: req.params.DocID }, { $push: { users: user } })
    //                     .then(
    //                         result => {
    //                             res.json({ status: true, messages: { success: "User successfully added" } })
    //                         }
    //                     )
    //                     .catch(
    //                         err => {
    //                             let messages = {}
    //                             for (let key in err.errors) {
    //                                 messages[key] = err.errors[key].message;
    //                             }
    //                             res.json({ status: false, messages: messages });
    //                         }
    //                     )
    //             }
    //         )
    //         .catch(
    //             err => {
    //                 let messages = {}
    //                 for (let key in err.errors) {
    //                     messages[key] = err.errors[key].message;
    //                 }
    //                 res.json({ status: false, messages: messages });
    //             }
    //         )

    // }, //maybe fix

    // inviteUser: (req, res) => {
    //     Documents.findOne({ _id: req.params.DocID })
    //         .then(
    //             data => {
    //                 //findby email?
    //                 User.findOne({ email: req.body })
    //                     .then(
    //                         //automated email for invite link to addUserToDocument
    //                         data => res.json({ status: true, messages: "Invite Link Sent" })
    //                     )
    //                     .catch(
    //                         err => {
    //                             let messages = {}
    //                             for (let key in err.errors) {
    //                                 messages[key] = err.errors[key].message;
    //                             }
    //                             res.json({ status: false, messages: messages });
    //                         }
    //                     )
    //             }
    //         )
    //         .catch(
    //             //maybe custom error message?
    //             err => {
    //                 let messages = {}
    //                 for (let key in err.errors) {
    //                     messages[key] = err.errors[key].message;
    //                 }
    //                 res.json({ status: false, messages: messages });
    //             }
    //         )
    // }, //need more stuff and fix errors

    // removeUserFromDoc: (req, res) => {
    //     Documents.findOneAndUpdate({ _id: req.params.DocID }, { $pull: { users: { _id: user._id } } })
    //         .then(
    //             data => {
    //                 res.json({ status: true, messages: { success: "User Successfully Removed!" } })
    //             }
    //         )
    //         .catch(
    //             error => {

    //                 res.json({ status: false, messages: error })
    //             }
    //         )


    // },  //change ID or EMAIL

    // getUserInfo: (req, res) => {
    //     User.findOne({ _id: req.session.user_id })
    //         .then(
    //             user => res.json({ status: true, data: user })
    //         )
    //         .catch(
    //             error => res.json({ status: false, messages: error })
    //         )
    // },


    // all: (req, res) => {
    //     Product.find({}).sort({ updatedAt: -1 })
    //         .then(
    //             data => res.json({ status: true, products: data })
    //         )
    //         .catch(
    //             error => res.json({ status: false, messages: error })
    //         )
    // },

    // getOne: (req, res) => {
    //     User.findOne({ _id: req.params.id })
    //         .then(
    //             data => res.json({ status: true, user: data })
    //         )
    //         .catch(
    //             error => res.json({ status: false, messages: error })
    //         )
    // },

    // create: (req, res) => {
    //     Product.create(req.body)
    //         .then(
    //             data => res.json({ status: true, messages: { success: "Product successfully added!" }, product: data })
    //         )
    //         .catch(
    //             err => {
    //                 if (err) {
    //                     let messages = {}
    //                     for (let key in err.errors) {
    //                         messages[key] = err.errors[key].message;
    //                     }
    //                     res.json({ status: false, messages: messages });
    //                 }
    //             }
    //         )
    // },

    // update: (req, res) => {
    //     Product.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { runValidators: true, context: 'query' })
    //         .then(
    //             data => res.json({ status: true, messages: { success: "Product successfully Updated!" }, product: data })
    //         )
    //         .catch(
    //             err => {
    //                 if (err) {
    //                     let messages = {}
    //                     for (let key in err.errors) {
    //                         messages[key] = err.errors[key].message;
    //                     }
    //                     res.json({ status: false, messages: messages });
    //                 }
    //             }
    //         )
    // },

    // delete: (req, res) => {
    //     Product.findByIdAndRemove({ _id: req.params.id })
    //         .then(
    //             data => res.json({ status: true, messages: { success: "Product successfully Delete!" }, product: data })
    //         )
    //         .catch(
    //             error => req.json({ status: false, messages: error })
    //         )
    // }