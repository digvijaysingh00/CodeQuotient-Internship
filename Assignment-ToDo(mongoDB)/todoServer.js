const uuid = require("uuid");
const multer = require("multer");
const fs = require("fs");
const db = require(__dirname + "/models/db.js");
const TaskModel = require(__dirname + "/models/task.js");

const express = require("express");
const path = require("path");
const app = express();
const p = __dirname;

//Set Storage Engine
const storage = multer.diskStorage({
    destination: p + '/uploads/',
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: {fileSize: 2000000},
    fileFilter: function (req, file, callback) {
        checkFileType(file, callback);

    }
}).single('taskPicture');
// app.use(upload);

// Check File Type
function checkFileType(file, callback) {
    // Allowed extentions
    const fileTypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
        return callback(null, true);
    } else {
        
        return callback({message: "Images only!"}, false);
    }
}

app.use(express.json());
app.use(express.static(p + '/uploads/'))


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/views/index.html");
});
app.get("/script.js", function (req, res) {
    res.sendFile(__dirname + "/views/script.js");
});

app.post("/todo", function (req, res) {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).send({ err: err.message });
        } else {
            const taskObject = req.body;
            taskObject.taskPicture = req.file.filename;
            const taskId = uuid.v4();
            taskObject.taskId = taskId;
            TaskModel.create(taskObject)
                .then(() => {
                    res.status(200).send("success");
                })
                .catch((err) => {
                    res.status(500).send({ err: err.message });
                })




            // saveInDatabase(taskObject, function (err) {
            //     if (err) {
            //         res.status(500).send({ err: err.message });
            //         return;
            //     }
            //     res.status(200).send("success");
            // });
        }
    });
});
app.get("/todo", function (req, res) {
    TaskModel.find({})
        .then(allTasks => {
            res.status(200).send(allTasks);
        })
        .catch(error => {
            res.status(500).send(err);
        });
    // readDatabase(function (err, data) {
    //     if (err) {
    //         res.status(500).send(err);
    //         return;
    //     }
    //     res.status(200).send(data);
    // })
});
app.post("/update", function (req, res) {
    TaskModel.findOneAndUpdate(
        { taskId: req.body.taskId },
        { taskStatus: req.body.taskStatus}
    ).then(function () {
        res.status(200).send("success");
    }).catch(function () {
        res.status(500).send({ err });
    });

    // updateTask(req.body, function (err) {
    //     if (err) {
    //         res.status(500).send({ err });
    //         return;
    //     }
    //     res.status(200).send("success");
    // });
});
app.post("/delete", function (req, res) {
    TaskModel.findOne({ taskId: req.body.taskId})
        .then(foundTask => {
            fs.unlinkSync(__dirname + "/uploads/" + foundTask.taskPicture);
        });
    TaskModel.deleteOne(
        { taskId: req.body.taskId }
    ).then(function () {
        res.status(200).send("success");
    }).catch(function () {
        res.status(500).send({ err });
    });
    // deleteTask(req.body.taskId, function (err) {
    //     if (err) {
    //         res.status(500).send({ err });
    //         return;
    //     }
    //     res.status(200).send("success");
    // })
});
db.init()
    .then(function () {
        console.log("Database connected.");
        app.listen(4000, function () {
            console.log("Sever is listening at port 4000...");
        });
    }).catch(function (err) {
        comsole.log(err);
    });


