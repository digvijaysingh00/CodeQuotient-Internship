const fs = require("fs");
const express = require("express");
const app = express();
const session = require('express-session');
const server2 = require(__dirname + "/server2.js");

app.set("view engine", "ejs");
//in case you want some other folder to store view files
//app.set("views", __dirname + "xyzViews");
app.set("views", __dirname + "/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }));

app.get("/", function (req, res) {
    if (req.session.isLoggedIn == true) {
        res.render("home", {name: req.session.name});
    }
    else {
        res.redirect("/login");
    }
});
app.get("/contact", function (req, res) {
    if (req.session.isLoggedIn === true) {
        res.render("contact", {name: req.session.name});
    }
    else {
        res.redirect("/login");
    }
});
app.get("/about", function (req, res) {
    if (req.session.isLoggedIn === true) {
        res.render("about", {name: req.session.name});
    }
    else {
        res.redirect("/login");
    }
});

app.get("/signup", function (req, res) {
    res.sendFile(__dirname + "/views/signup.html");
});

app.post("/signup", function (req, res) {
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const username = req.body.username;
    const password = req.body.password;
    user = {
        firstName,
        lastName,
        username,
        password
    };

    server2.searchUser(username, function (err, exists) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        if (exists) {
            res.status(409).sendFile(__dirname + "/views/signup-failed.html");
        }
        else {
            server2.passwordHash(user.password, function (err, hashedPassword) {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                user.password = hashedPassword;
                server2.saveUser(user, function(err) {
                    if (err) {
                        res.status(500).send(err);
                        return;
                    }
                    res.sendFile(__dirname + "/views/signup-successful.html");
                })
            })

        }
    })
});

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    server2.passwordHash(password, function (err, hashedPassword) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        server2.readUsers(function (err, users) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            if (username in users && users[username].password === hashedPassword) {
                req.session.isLoggedIn = true;
                server2.searchUser(username, function (err, user) {
                    if (err) {
                        res.status(500).send(err);
                        return;
                    }
                    req.session.name = user.firstName + " " + user.lastName;
                    res.redirect("/");
                });
            }
            else {
                res.status(401).sendFile(__dirname + "/views/login-failed.html");
            }

        });
    });
});

app.get("/login", function (req, res) {
    res.sendFile(__dirname + "/views/login.html");
});

app.get("/logout", function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.error("Error destroying session:", err);
        }
        res.redirect("/login");
    });
});

app.listen(5000, function () {
    console.log("Server is listening at port 5000...");
});

