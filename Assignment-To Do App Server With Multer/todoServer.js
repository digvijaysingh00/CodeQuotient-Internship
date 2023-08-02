const fs = require("fs");
const express = require("express");
const multer = require("multer");
const app = express();

const upload = multer({ dest: "./CodeQuotient-Internship/Assignment-To Do App Server With Multer/public"});

app.use(express.json());
app.use(express.static('./CodeQuotient-Internship/Assignment-To Do App Server With Multer/public'));

app.post("/delete", function (req, res) {
    deleteTodo(req.body.taskIndex, function (err) {
        if (err) {
            res.status(500).send("error");
            return;
        }
        res.status(200).send("success");
    }); 
});

app.post("/update", function (req, res) {
    updateTodo(req.body, function (err) {
        if (err) {
            res.status(500).send("error");
            return;
        }
        res.status(200).send("success");
    }); 

});

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/todoViews/index.html");
});
app.get("/todo", function (req, res) {
    readDatabase(function (err, data) {
        if (err) {
            res.status(500).send("error");
            return;
        }
        res.status(200).send(JSON.stringify(data));
    })
})

app.post("/todo", upload.single("image"), function (req, res) {
    const todo =JSON.parse(req.body.jsonData);
    const file = req.file;
    todo.filename = file.filename;
    saveDatabase(todo, function (err) {
        if (err) {
            res.status(500).send("error");
            return;
        }
        res.status(200).send(JSON.stringify({filename: file.filename}));
    });
});


app.get("/clientScript.js", function (req, res) {
    res.sendFile(__dirname + "/todoViews/clientScript.js");
});

app.listen(5000, function () {
    console.log("Server is listening on port 5000...");
});

function readDatabase(callback) {
    fs.readFile("./CodeQuotient-Internship/Assignment-To Do App Server With Multer/myDatabase.txt", "utf-8", function (err, data) {
        if (err) {
            callback(err);
            return;
        }
        if (data.length === 0) {
            data = "[]";
        }

        try {
            data = JSON.parse(data);
            callback(null, data);
        } catch (err) {
            callback(err);
        }
        
    });
}
function saveDatabase(todo, callback) {
    readDatabase(function (err, data) {
        if (err) {
            callback(err);
            return;
        }
        data.push(todo);
        fs.writeFile("./CodeQuotient-Internship/Assignment-To Do App Server With Multer/myDatabase.txt", JSON.stringify(data), function (err) {
            if (err) {
                callback(err);
                return;
            }
            callback(null);
        });
    });

}
function deleteTodo(index, callback) {
    readDatabase(function (err, data) {
        if (err) {
            callback(err);
            return;
        }
        fs.unlinkSync("./CodeQuotient-Internship/Assignment-To Do App Server With Multer/public/" + data[index].filename);
        data.splice(index, 1);
        
        fs.writeFile("./CodeQuotient-Internship/Assignment-To Do App Server With Multer/myDatabase.txt", JSON.stringify(data), function (err) {
            if (err) {
                callback(err);
                return;
            }
            callback(null);
        });
    });

}
function updateTodo(msg, callback) {
    readDatabase(function (err, data) {
        if (err) {
            callback(err);
            return;
        }
        data[msg.taskIndex].status = msg.status;
        fs.writeFile("./CodeQuotient-Internship/Assignment-To Do App Server With Multer/myDatabase.txt", JSON.stringify(data), function (err) {
            if (err) {
                callback(err);
                return;
            }
            callback(null);
        });
    });

}


