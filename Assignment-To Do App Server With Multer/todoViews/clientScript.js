const submitButton = document.getElementById("submit-button");
const inputBox = document.getElementById("input-field");
const displayBoard = document.getElementById("left-column");
const imageInput = document.getElementById('imageInput');

submitButton.addEventListener("click", function () {
    todoText = inputBox.value;

    if (todoText.length === 0) {
        alert("Please, Enter a todo task");
        return;
    }
    const file = imageInput.files[0];

    if (!file) {
    alert('Please select an image.');
    return;
    }
    todo = {
        todoText: todoText,
        status: "pending"
    }


    const formData = new FormData();
    formData.append('image', file);
    formData.append('jsonData', JSON.stringify(todo));

    fetch("/todo", {
        method: "POST",
        body: formData
    })
        .then(function (response) {
            if (response.status === 200) {
                return response.json();
            }
            else {
                alert("Oops! Something weird happened.");
            }
        })
        .then(file => {
            console.log(file.filename);
            todo.filename = file.filename;
            showTodoInUI(todo);
        })

});
function render() {
    fetch("/todo")
        .then(function (response) {
            if (response.status === 200) {
                return response.json();
            } else {
                alert("Oops!!! Something weird happended!!!");
            }

        })
        .then(function (todos) {
            // displayBoard.innerHTML = "";
            todos.forEach(todo => {
                showTodoInUI(todo);
            });
        })
    }
render();

displayBoard.addEventListener('click', function (event) {
    tag = event.target.tagName;
    const targetElement = event.target;
    const borderedLabelDiv = targetElement.closest(".bordered-label");
    const labelText = borderedLabelDiv.querySelector("span");
    const taskIndex = Array.from(event.currentTarget.children).indexOf(borderedLabelDiv) - 1;

    if (tag === "INPUT") {
        let status;
        if (targetElement.checked) {
            status = "done";

        } else {
            status = "pending";

        }
        fetch("/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ taskIndex, status })
        })
            .then(function (response) {
                if (response.status == 200) {
                    if (status === "done") {
                        labelText.style.textDecoration = "line-through";
                    }
                    else {
                        labelText.style.textDecoration = "none";
                    }

                }
            });


    }
    else if (tag === "CUT") {
        fetch("/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ taskIndex })
        })
            .then(function (response) {
                if (response.status == 200) {
                    displayBoard.removeChild(borderedLabelDiv);
                }
            })

    }

})


function showTodoInUI(todo) {
    const image = document.createElement("img");
    image.setAttribute("src",todo.filename);
    image.style.width = "50px";
    image.style.height = "50px";
    image.style.marginLeft = "auto";
    

    const task = document.createElement("div");
    task.className = "bordered-label";
    const child1 = document.createElement("span");
    child1.innerHTML = todo.todoText;
    child1.style.marginRight = "10px";
    const child2 = document.createElement("input");
    child2.type = "checkbox";
    child2.className = "checkbox";
    const child3 = document.createElement("cut");
    child3.className = "cross-button";
    if (todo.status === "done") {
        child1.style.textDecoration = "line-through";
        child2.checked = true;
    }
    task.appendChild(child1);
    task.appendChild(image);
    task.appendChild(child2);
    task.appendChild(child3);
    displayBoard.appendChild(task);

}


/*
    <div class="bordered-label">
        <span>Label Text Goes Here</span>
        <input type="checkbox" class="checkbox">
        <span class="cross-button"></span>
    </div>
*/