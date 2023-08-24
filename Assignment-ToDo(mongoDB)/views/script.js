
const displayBoard = document.querySelector("#left-column");
const titleTemplate = document.querySelector("#title-template").content;
const taskTemplate = document.querySelector("#task-template").content;
const submitButton = document.querySelector("#submit-button");
const inputField = document.querySelector("#input-field");
const fileInput = document.querySelector("#input-file");
renderTitle();
render();

submitButton.addEventListener("click", function (event) {
    const taskText = inputField.value;
    if (taskText === "") {
        alert("Enter the task!");
        return;
    }
    if (fileInput.files.length === 0) {
        alert("Please upload the picture of the task!");
        return;
    }
    const taskId = null;
    const taskStatus = "pending";
    const formData = new FormData;
    formData.append("taskId", taskId);
    formData.append("taskText", taskText)
    formData.append("taskStatus", taskStatus);
    formData.append("taskPicture", fileInput.files[0]);
    
    fetch("/todo", {
        method: "POST",
        // headers: {
        //     'Content-Type': 'multipart/form-data',
        // },
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.err);
                });
            }
            render();
        })
        .catch(error => {
            console.log(error);
            alert(error);
        });
});

displayBoard.addEventListener("click", function (event) {
    if (event.target.className === "checkbox") {
        let taskStatus = "pending";
        let taskId = event.target.getAttribute("data-task-id");
        
        if (event.target.checked) {
            taskStatus = "completed";
        }
        const statusObj = {taskId, taskStatus};
        fetch("/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(statusObj)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.err);
                    });
                }
                render();

            })
            .catch(error => {
                console.log(error);
            });

    }
    else if (event.target.className === "cross-button") {
        let taskId = event.target.getAttribute("data-task-id");
        const statusObj = {taskId};
        fetch("/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(statusObj)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.err);
                    });
                }
                render();

            })
            .catch(error => {
                console.log(error);
            });

    }
});

function render() {
    fetch("/todo")
    .then(function (response) {
        if (!response.ok) {
            return response.json().then(error => {
                throw new Error(error.err);
            });
        }
        return response.json();
    })
    .then(function (data) {
        displayBoard.textContent = "";
        renderTitle();
        data.forEach(function (taskObject) {
            renderTask(taskObject);
        });
    })
    .catch(error => {
        console.log(error);
    });

}

function renderTitle() {
    const titleElement = document.importNode(titleTemplate, true);
    displayBoard.appendChild(titleElement);
}


function renderTask(taskObject) {
    const taskElement = document.importNode(taskTemplate, true);
    const taskName = taskElement.querySelector('.text');
    taskName.textContent = taskObject.taskText;
    const taskPicture = taskElement.querySelector('.picture');
    taskPicture.src = taskObject.taskPicture;

    const checkbox = taskElement.querySelector('input');
    checkbox.dataset.taskId = taskObject.taskId;
    if (taskObject.taskStatus === "completed") {
        taskName.style.textDecoration = 'line-through';
        checkbox.checked = true;
    } else {
        taskName.style.textDecoration = 'none';
        checkbox.checked = false;
    }

    const crossButton = taskElement.querySelector('.cross-button');
    crossButton.dataset.taskId = taskObject.taskId;

    displayBoard.appendChild(taskElement);
}
