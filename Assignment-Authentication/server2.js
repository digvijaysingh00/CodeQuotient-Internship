const fs = require("fs");
function saveUser(user, callback) {
    readUsers(function (err, users) {
        if (err) {
            callback(err);
            return;
        }
        users[user.username] = user;
        fs.writeFile("./lecture12/myDatabase.txt", JSON.stringify(users), function (err) {
            callback(err);
        });

    });
}
function searchUser(username, callback) {
    readUsers(function (err, users) {
        if (err) {
            callback(err);
            return;
        }
        if (username in users) {
            callback(null, users[username]);
        } else {
            callback(null, false);
        }
    });
}
function readUsers(callback) {
    fs.readFile("./lecture12/myDatabase.txt", "utf-8", function (err, data) {
        if (err) {
            callback(err);
            return;
        }
        if (data.length === 0) {
            data = "{}";
        }

        callback(null, JSON.parse(data));
    });
}

// var exports = module.exports

module.exports = {
    saveUser,
    searchUser,
    readUsers
};
