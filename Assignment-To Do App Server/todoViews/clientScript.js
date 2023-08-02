const submitButton = document.getElementById("submit-button");
const inputBox = document.getElementById("input-field");
const displayBoard = document.getElementById("left-column");

submitButton.addEventListener("click", function () {
    todoText = inputBox.value;

    if (todoText.length === 0) {
        alert("Please, Enter a todo task");
        return;
    }

    todo = {
        todoText: todoText,
        status: "pending"
    }

    fetch("/todo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(todo)
    })
        .then(function (response) {
            if (response.status === 200) {
                showTodoInUI(todo);
            }
            else {
                alert("Oops! Something weird happened.");
            }
        });

});
fetch("/todo")
    .then(function (response) {
        if (response.status === 200) {
            return response.json();
        } else {
            alert("Oops!!! Something weird happended!!!");
        }

    })
    .then(function (todos) {
        todos.forEach(todo => {
            showTodoInUI(todo);
        });
    })

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

    const task = document.createElement("div");
    task.className = "bordered-label";
    const child1 = document.createElement("span");
    child1.innerHTML = todo.todoText;
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