const fs = require("fs");
function saveUser(user, callback) {
    readUsers(function (err, users) {
        if (err) {
            callback(err);
            return;
        }
        users[user.username] = user;
        fs.writeFile("./CodeQuotient-Internship/Assignment-Authentication/myDatabase.txt", JSON.stringify(users), function (err) {
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
    fs.readFile("./CodeQuotient-Internship/Assignment-Authentication/myDatabase.txt", "utf-8", function (err, data) {
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
function passwordHash(password, callback) {
    fetch("https://api.hashify.net/hash/sha256/hex?value=" + password)
        .then(function (response) {
            if (response.status === 200) {
                return response.json(); // Return the JSON promise
            } else {
                throw new Error("Failed to fetch hash from Hashify API.");
            }
        })
        .then(function (data) {
            // The data variable now contains the JSON data
            callback(null, data.Digest);
        })
        .catch(function (error) {
            callback(error); // Pass the error to the callback if any
        });
}

// var exports = module.exports

module.exports = {
    saveUser,
    searchUser,
    readUsers,
    passwordHash
};
