let hideItem = function (id) {
    let el = document.getElementById(id);
    el.style.display = 'none';
}

let showItem = function (id) {
    let el = document.getElementById(id);
    el.style.display = 'flex';
}

let createTask = function () {
    showItem('newtask');
}

let cancelTask = function (className) {
    hideItem(className);
    const tasks = document.getElementsByClassName('taskitem');
    for (let i = 0, length = tasks.length; i < length; i++) {
        if (tasks[i].getAttribute('action')) {
            tasks[i].removeAttribute('action');
        }
    }
}

let searchNode = function (el, className) {
    if (el.className.indexOf(className) !== -1) {
        return el;
    } else {
        el = el.parentNode;
        return searchNode(el, className);
    }
}

let deleteTask = function (el) {
    let currentNode = searchNode(el, 'taskitem');
    currentNode.remove();

    store();
}

let done = function (el) {
    let currentNode = searchNode(el, 'taskitem');
    currentNode.setAttribute('status', 'done');
    const doneTrigger = document.createElement("input");
    doneTrigger.setAttribute('type', 'checkbox');
    doneTrigger.setAttribute('done', 'done');
    doneTrigger.setAttribute('onclick', 'switchOff(this)');
    doneTrigger.classList.add('absolute');
    doneTrigger.checked = true;

    currentNode.append(doneTrigger);
    store();
}

let createTodo = function () {
    const titleContent = document.getElementById('title').value;
    const descriptionContent = document.getElementById('description').value;
    const importanceValue = document.getElementById('setimportance').value;

    const tasksContainer = document.getElementById('tasks');

    const item = document.createElement("div");
    item.classList.add('taskitem');
    item.setAttribute('status', 'open');

    const title = document.createElement("div");
    title.classList.add('tasktitle');
    title.innerText = titleContent;

    const description = document.createElement("div");
    description.classList.add('description');
    description.innerText = descriptionContent;

    const footer = document.createElement("div");
    footer.classList.add('taskfooter');

    const priority = document.createElement("div");
    priority.classList.add('priority');
    priority.setAttribute('priority', importanceValue);
    priority.innerText = importanceValue;

    footer.append(priority);

    const status = document.createElement("div"),
        statusHtml = "<div class='status'>...<div class='actionlist'><ul><li id='done' onclick='done(this)'>done</li><li id='edit' onclick='editTodo(this)'>edit</li><li id='delete' onclick='deleteTask(this)'>delete</li></ul></div></div>";
    status.innerHTML = statusHtml;

    footer.append(status);


    item.append(title);
    item.append(description);
    item.append(footer);

    tasksContainer.append(item);

    document.getElementById('title').value = "";
    document.getElementById('description').value = "";
    document.getElementById('setimportance').value = "high";

    hideItem('newtask');

    store();
}

let editTodo = function (el) {
    showItem('edittask');
    let currentNode = searchNode(el, 'taskitem');
    currentNode.setAttribute('action', 'editing');

    let editorTitle = document.getElementById('edittitle');
    editorTitle.value = currentNode.children[0].innerText;

    let editorDescription = document.getElementById('editdescription');
    editorDescription.value = currentNode.children[1].innerText;

    let editorPriority = document.getElementById('editsetimportance');

    let currentPriority = currentNode.children[2].children[0].innerText;

    let selector = document.getElementById('editsetimportance');

    let opts = selector.options;
    for (let opt, j = 0; opt = opts[j]; j++) {
        if (opt.value == currentPriority) {
            selector.selectedIndex = j;
            break;
        }
    }
    store();
}

let saveTodo = function (el) {
    const editTitle = document.getElementById('edittitle');
    const editDescription = document.getElementById('editdescription');
    const editImportance = document.getElementById('editsetimportance');

    const tasks = document.getElementsByClassName('taskitem');
    for (let i = 0, length = tasks.length; i < length; i++) {
        if (tasks[i].getAttribute('action')) {
            tasks[i].removeAttribute('action');
            tasks[i].children[0].innerText = editTitle.value;
            tasks[i].children[1].innerText = editDescription.value;
            tasks[i].children[2].children[0].setAttribute('priority', editImportance.value);
            tasks[i].children[2].children[0].innerText = editImportance.value;
        }
    }

    document.getElementById('edittitle').value = "";
    document.getElementById('editdescription').value = "";
    document.getElementById('editsetimportance').value = "";

    hideItem('edittask');
    store();
}

let switchOff = function (el) {
    let a = searchNode(el, 'taskitem');
    a.removeAttribute('status');
    el.remove();
    store();
}


let store = function () {
    const content = document.getElementById('tasks');
    localStorage.setItem('tasks', content.innerHTML);
    content.innerHTML = localStorage.getItem('tasks');
    loadChecked();
}

let loadChecked = function () {
    const checked = document.querySelectorAll('[done="done"]');
    if (checked.length !== 0) {
        for (let i = 0, length = checked.length; i < length; i++) {
            checked[i].checked = true;
        }
    }
}

let loadTasks = function () {
    const innerContent = localStorage.getItem('tasks');
    const content = document.getElementById('tasks');
    content.innerHTML = innerContent;

    loadChecked();
}

let reloadPage = () => {
    const container = document.getElementById('tasks');
    const children = container.children;
    for (let i = 0, length = children.length; i < length; i++) {
        children[i].classList.remove('hide');
        children[i].classList.add('show');
    }
};

let searchTask = function (el) {
    const value = document.getElementById('find').value;
    const statusValue = document.getElementById('status').value;
    const importanceValue = document.getElementById('importance').value;
    const container = document.getElementById('tasks');
    const children = container.children;


    for (let i = 0, length = children.length; i < length; i++) {

        if (children[i].children[0].innerText.toLocaleLowerCase().indexOf(value.toLowerCase()) !== -1) {
            children[i].setAttribute('matchinheader', 'true');
        } else {
            children[i].setAttribute('matchinheader', 'false');
        }


        if (statusValue === 'all') {
            children[i].setAttribute('matchstatus', 'true');
        } else if (statusValue == 'open') {
            if (children[i].getAttribute('status') == 'open') {
                children[i].setAttribute('matchstatus', 'true');
            } else {
                children[i].setAttribute('matchstatus', 'false');
            }
        } else if (statusValue == 'done') {
            if (children[i].getAttribute('status') == 'done') {
                children[i].setAttribute('matchstatus', 'true');
            } else {
                children[i].setAttribute('matchstatus', 'false');
            }
        }

        if (importanceValue === 'all') {
            children[i].setAttribute('matchimportance', 'true');
        } else if (importanceValue === children[i].children[2].children[0].getAttribute('priority')) {
            children[i].setAttribute('matchimportance', 'true');
        } else {
            children[i].setAttribute('matchimportance', 'false');
        }

        if (children[i].getAttribute('matchinheader') == 'true' && children[i].getAttribute('matchstatus') == 'true' && children[i].getAttribute('matchimportance') == 'true') {
            children[i].classList.add('show');
            children[i].classList.remove('hide');
        } else {
            children[i].classList.add('hide');
            children[i].classList.remove('show');
        }
    }
    store();
}

document.addEventListener("DOMContentLoaded", loadTasks());
document.addEventListener("DOMContentLoaded", reloadPage());