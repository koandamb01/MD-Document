const bcrypt = require('bcrypt-as-promised');
const Collections = require('../models/models');

const User = Collections.User;
const Chat = Collections.Chat;
const Documents = Collections.Document;

module.exports = {

    // ######## REGISTRATION ######### //
    register: (req, res) => {
        if (req.body.password == "" || req.body.password.length < 8) {
            res.json({ status: false, messages: { password: "*Password must be at 8 characters" } })
        }
        else {
            bcrypt.hash(req.body.password, 10)
                .then(
                    hash_pw => {
                        req.boby.password = hash_pw;
                        User.create(req.boby)
                            .then(
                                user => res.json({ status: true, messages: { success: "User successfully Register!" }, user: user })
                            )
                            .catch(
                                err => {
                                    let messages = {}
                                    for (let key in err.errors) {
                                        messages[key] = err.errors[key].message;
                                    }
                                    res.json({ status: false, messages: messages });
                                }
                            )
                    }
                )
                .catch(
                    err => (
                        res.json({ status: false, messages: { server: "*Bcrypt is not working" } })
                    )
                )
        }
    },

    login: (res, req) => {
        User.findOne({ email: req.body.email }, function (err, result) {
            if (err) {
                res.json({ status: false, messages: { login: "Login Failed" } })
            }
            else {
                bcrypt.compare(req.body.password, result.password)
                    .then(
                        loginresult => {

                            //add session
                            Documents.find({ users: { id: result._id } }), function (err1, data) {
                                if (err1) {
                                    res.json({ status: false, messages: { document: "Could not find any document" } })
                                }
                                else {
                                    res.json({ status: true, messages: { success: "Login Sucessful" }, documents: data })
                                }
                            }
                        }
                    )
                    .catch(error => {
                        res.json({ status: false, messages: { login: "Login Failed" } })
                    })
            }
        })
    },

    newDocument: (req, res) => {
        User.findOne({ _id: req.params.UserID })
            .then(
                user => {
                    Document.create(req.body)
                        .then(
                            document => {
                                Document.findOneAndUpdate({ _id: document._id }, { $push: { users: user } })
                                    .then(data => res.json({ status: true, messages: { success: "Document successfully create!" }, document: data }))
                                    .catch(err => {
                                        err => {
                                            let messages = {}
                                            for (let key in err.errors) {
                                                messages[key] = err.errors[key].message;
                                            }
                                            res.json({ status: false, messages: messages });
                                        }
                                    });
                            }
                        )
                        .catch(
                            err => {
                                let messages = {}
                                for (let key in err.errors) {
                                    messages[key] = err.errors[key].message;
                                }
                                res.json({ status: false, messages: messages });
                            }
                        )
                }
            )
            .catch(
                err => {
                    let messages = {}
                    for (let key in err.errors) {
                        messages[key] = err.errors[key].message;
                    }
                    res.json({ status: false, messages: messages });
                }
            )
    },


    all: (req, res) => {
        Product.find({}).sort({ updatedAt: -1 })
            .then(
                data => res.json({ status: true, products: data })
            )
            .catch(
                error => res.json({ status: false, messages: error })
            )
    },

    getOne: (req, res) => {
        Product.findOne({ _id: req.params.id })
            .then(
                data => res.json({ status: true, product: data })
            )
            .catch(
                error => res.json({ status: false, message: error })
            )
    },

    create: (req, res) => {
        Product.create(req.body)
            .then(
                data => res.json({ status: true, messages: { success: "Product successfully added!" }, product: data })
            )
            .catch(
                err => {
                    if (err) {
                        let messages = {}
                        for (let key in err.errors) {
                            messages[key] = err.errors[key].message;
                        }
                        res.json({ status: false, messages: messages });
                    }
                }
            )
    },

    update: (req, res) => {
        Product.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { runValidators: true, context: 'query' })
            .then(
                data => res.json({ status: true, messages: { success: "Product successfully Updated!" }, product: data })
            )
            .catch(
                err => {
                    if (err) {
                        let messages = {}
                        for (let key in err.errors) {
                            messages[key] = err.errors[key].message;
                        }
                        res.json({ status: false, messages: messages });
                    }
                }
            )
    },

    delete: (req, res) => {
        Product.findByIdAndRemove({ _id: req.params.id })
            .then(
                data => res.json({ status: true, messages: { success: "Product successfully Delete!" }, product: data })
            )
            .catch(
                error => req.json({ status: false, messages: error })
            )
    }
}