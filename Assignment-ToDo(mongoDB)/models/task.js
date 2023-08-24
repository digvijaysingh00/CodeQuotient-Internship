const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
    taskId: String,
    taskText: String,
    taskStatus: String,
    taskPicture: String
});

const Tasks = mongoose.model("Tasks", taskSchema);

module.exports = Tasks;