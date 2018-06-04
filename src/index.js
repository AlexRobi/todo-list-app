import {
  format,
  formatDistance,
  formatRelative,
  subDays
} from 'date-fns';
import { print } from 'util';
// console.log(format(new Date(2014, 1, 11), 'MM/DD/YYYY'));

function saveData(data) {
  localStorage.setItem("savedListOfProjects", JSON.stringify(data));
};
function loadData() {
  return JSON.parse(localStorage.getItem("savedListOfProjects"));
};

const project = (function () {

  const createTask = (title, description, dueDate, priority, checkbox) => {
    return {
      title,
      description,
      dueDate,
      priority,
      checkbox,
    };
  };

  const createProject = (name) => {
    let listOfTasks = [];
    return {
      name,
      listOfTasks,
    };
  };

  if (!localStorage.savedListOfProjects) {
    var listOfProjects = [];
    // Creates a default Project.
    const defaultProject = createProject("Personal");
    listOfProjects.push(defaultProject);
    saveData(listOfProjects);
  };

  const addNewProject = () => {
    let inputNameValue = document.querySelector(".input-name-project").value;
    if (validateInputNameProject(inputNameValue)) {
      let newProject = createProject(inputNameValue);
      listOfProjects.push(newProject);
      saveData(listOfProjects);
      refreshListOfProjects();
      form.classList.add("d-none");
      document.querySelector(".form-project-js").reset();
    };
  }

  const deleteProject = (btn) => {
    if (confirm("Delete this project?")) {
      let index = btn.getAttribute("data-index");
      // Uses the value of data-index to delete the project from the listOfProjects.
      listOfProjects.splice(index, 1);
      saveData(listOfProjects);
      refreshListOfProjects();
      location.reload();
    };
  };

  const showProjectInformation = (project, index) => {
    let projectTitle = document.querySelector(".project-info__title");
    projectTitle.textContent = project.name;
    setProjectDOMActive(index);
    document.querySelector(".project__add-task-js").classList.remove("d-none");
    document.querySelector(".task-list__header-js").classList.remove("d-none");
    // Removes all event listeners from the "add task" button by cloning it and replacing it.
    let old_element = document.querySelector(".save-form-task-js");
    let new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);

    document.querySelector(".save-form-task-js").addEventListener("click", function () {
      verifyTaskFormInput(project);
      document.querySelector(".form-task-js").reset();
      document.querySelector(".form-task").classList.add("d-none");
      document.querySelector(".add-task-js").classList.remove("d-none");
    });
    refreshListOfTasks(project);
  };

  const verifyTaskFormInput = (project) => {
    let validInput = true;
    document.querySelector(".input-title-task").value == "" ? validInput = false : validInput = true;
    if (validInput) {
      addNewTaskTo(project);
    }
  }

  const addNewTaskTo = (project) => {
    let title = document.querySelector(".input-title-task").value;
    let description = document.querySelector(".input-description-task").value;
    let dueDate = document.querySelector(".input-dueDate-task").value;
    let priority = document.querySelector(".input-priority-task").value;
    let checkbox = false;

    const newTask = createTask(title, description, dueDate, priority, checkbox);
    project.listOfTasks.push(newTask);
    saveData(listOfProjects);
    refreshListOfTasks(project);
  }

  const refreshListOfTasks = (project) => {

    resetListOfTasks();

    project.listOfTasks.forEach(function(task, index) {

      const taskCard = document.createElement("div");
      taskCard.classList.add("task-card");
      document.querySelector(".task-list-wrapper-js").appendChild(taskCard);

      const checkbox = document.createElement("i");
      if (task.checkbox) {
        checkbox.classList.add("far", "fa-check-circle");
      } else {
        checkbox.classList.add("far", "fa-circle");
      };
      checkbox.classList.add("col-1");
      checkbox.addEventListener("click", function () {
        if (checkbox.classList.contains('fa-check-circle')) {
          checkbox.classList.remove("fa-check-circle");
          checkbox.classList.add("fa-circle");
          task.checkbox = false;
        } else {
          checkbox.classList.remove("fa-circle");
          checkbox.classList.add("fa-check-circle");
          task.checkbox = true;
        };
        saveData(listOfProjects);
      });
      taskCard.appendChild(checkbox);

      const title = document.createElement("div");
      title.classList.add("task-title", "col-11", "col-md-3");
      title.textContent = task.title;
      title.addEventListener("click", function() {
        showTaskModal(task, project);
      });
      taskCard.appendChild(title);

      const description = document.createElement("div");
      description.classList.add("task-description", "d-none", "d-md-block",  "col-md-3");
      description.textContent = task.description;
      description.addEventListener("click", function () {
        showTaskModal(task, project);
      });
      taskCard.appendChild(description);

      const dueDate = document.createElement("div");
      dueDate.classList.add("task-due-date", "d-none", "d-md-block", "col-md-2");
      dueDate.textContent = format(new Date(task.dueDate), 'MM/DD/YYYY');
      dueDate.addEventListener("click", function () {
        showTaskModal(task, project);
      });
      taskCard.appendChild(dueDate);

      const priority = document.createElement("div");
      priority.classList.add("task-due-date", "d-none", "d-md-block",  "col-md-2", task.priority);
      priority.textContent = task.priority;
      priority.addEventListener("click", function () {
        showTaskModal(task, project);
      });
      taskCard.appendChild(priority);

      const deleteBtn = document.createElement("i");
      deleteBtn.classList.add("far", "fa-trash-alt", "d-none", "d-md-block",  "col-md-1");
      deleteBtn.addEventListener("click", function () {
        deleteTask(project, index);
      });
      taskCard.appendChild(deleteBtn);

    });

  };

  const showTaskModal = (task, project) => {
    $('#taskModal').modal('show');

    // Removes all event listeners from the "checkbox" by cloning it and replacing it.
    let old_element = document.querySelector(".task-modal__checkbox");
    let new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);

    const checkbox = document.querySelector(".task-modal__checkbox");
    if (task.checkbox) {
      checkbox.classList.add("far", "fa-check-circle");
    } else {
      checkbox.classList.add("far", "fa-circle");
    };
    checkbox.addEventListener("click", function () {
      if (checkbox.classList.contains('fa-check-circle')) {
        checkbox.classList.remove("fa-check-circle");
        checkbox.classList.add("fa-circle");
        task.checkbox = false;
      } else {
        checkbox.classList.remove("fa-circle");
        checkbox.classList.add("fa-check-circle");
        task.checkbox = true;
      };
      saveData(listOfProjects);
      refreshListOfTasks(project);
    });

    document.querySelector(".task-modal__title").textContent = task.title;
    document.querySelector(".task-modal__description").textContent = task.description;
    document.querySelector(".task-modal__due-date").textContent = format(new Date(task.dueDate), 'MM/DD/YYYY');
    document.querySelector(".task-modal__priority").classList.add(task.priority);
    document.querySelector(".task-modal__priority").textContent = task.priority;

    // Removes all event listeners from the "edit task btn" by cloning it and replacing it.
    let oldElement = document.querySelector(".btn-edit-task-js");
    let newElement = oldElement.cloneNode(true);
    oldElement.parentNode.replaceChild(newElement, oldElement);

    document.querySelector(".btn-edit-task-js").addEventListener("click", function() {
      displayEditTaskModal(task, project);
    });
  };

  const hideEditModal= () => {
    document.querySelector(".modal-content-js").classList.remove("d-none");
    document.querySelector(".modal-content-edit-js").classList.add("d-none");
  }

  const displayEditTaskModal = (task, project) => {
    // Shows the edit modal.
    document.querySelector(".modal-content-js").classList.add("d-none");
    document.querySelector(".modal-content-edit-js").classList.remove("d-none");
    // Cancels the edit modal.
    document.querySelector(".btn-cancel-edit-js").addEventListener("click", function() {
      hideEditModal();
    });
    // Removes all event listeners from the "edit task btn" by cloning it and replacing it.
    let oldElement = document.querySelector(".btn-save-edit-js");
    let newElement = oldElement.cloneNode(true);
    oldElement.parentNode.replaceChild(newElement, oldElement);

    document.querySelector(".btn-save-edit-js").addEventListener("click", function() {
      saveTaskEditChanges(task, project);
    });
    document.querySelector(".edit-task__title-js").value = task.title;
    document.querySelector(".edit-task__description-js").value = task.description;
    document.querySelector(".edit-task__due-date-js").value = task.dueDate;
    document.querySelector(".edit-task__priority-js").value = task.priority;
  };

  const saveTaskEditChanges = (task, project) => {
    task.title = document.querySelector(".edit-task__title-js").value
    task.description = document.querySelector(".edit-task__description-js").value
    task.dueDate = document.querySelector(".edit-task__due-date-js").value
    task.priority = document.querySelector(".edit-task__priority-js").value
    saveData(listOfProjects);
    refreshListOfTasks(project);
    hideEditModal();
    $('#taskModal').modal('hide');
  }

  const deleteTask = (project, index) => {
    if (confirm("Delete this task?")) {
      // Uses the value of data-index to delete the project from the listOfTasks.
      project.listOfTasks.splice(index, 1);
      saveData(listOfProjects);
      refreshListOfTasks(project);
    };
  };

  const resetListOfTasks = () => {
    // Resets the list by removing all child from the DOM.
    let taskListWrapper = document.querySelector(".task-list-wrapper-js");
    while (taskListWrapper.firstChild) {
      taskListWrapper.removeChild(taskListWrapper.firstChild);
    };
  };

  const setProjectDOMActive = (index) => {
    let projects = document.querySelectorAll("[data-index]");
    projects.forEach(function(project, index) {
      project.classList.remove("project-active");
    });

    let selectedProject = document.querySelector("[data-index='" + index + "']");
    selectedProject.classList.add("project-active");
  };

  const refreshListOfProjects = () => {
    const projectsList = document.querySelector(".projects-list");

    resetListOfProjects(projectsList);

    listOfProjects = loadData();

    listOfProjects.forEach(function(project, index) {
      const projectWrapper = document.createElement("div");
      projectWrapper.classList.add("project");
      projectWrapper.setAttribute("data-index", index);
      projectsList.appendChild(projectWrapper);

      const projectName = document.createElement("div");
      projectName.classList.add("project__name");
      projectName.textContent = project.name;
      projectName.addEventListener("click", function () {
        showProjectInformation(project, index);
      });
      projectWrapper.appendChild(projectName);

      const deleteBtn = document.createElement("i");
      deleteBtn.classList.add("far", "fa-trash-alt");
      // Adds the index of the project from the listOfprojects to the button.
      deleteBtn.setAttribute("data-index", index);
      deleteBtn.addEventListener("click", function() {
        deleteProject(this);
      });
      projectWrapper.appendChild(deleteBtn)
    });

    const addProject = document.createElement("div");
    addProject.classList.add("add-project-wrapper");
    projectsList.appendChild(addProject);

    const addProjectFA = document.createElement("i");
    addProjectFA.classList.add("add-project__icon", "fas", "fa-plus");
    addProject.appendChild(addProjectFA);

    const addProjectText = document.createElement("div");
    addProjectText.textContent = "Add Project"
    addProjectText.classList.add("add-project__text");
    addProject.appendChild(addProjectText);

    addProject.addEventListener("click", showFormProject);

  };

  const resetListOfProjects = (projectsList) => {
    // Resets the list by removing all child from the DOM.
    while (projectsList.firstChild) {
      projectsList.removeChild(projectsList.firstChild);
    };
  };


  return {
    createProject,
    addNewProject,
    refreshListOfProjects,
  };

})();



document.querySelector(".project-collapse-js").addEventListener("click", animateChevron);
function animateChevron() {
  let chevron = document.querySelector(".fa-chevron-down");
  if (chevron.classList.contains("fa-chevron-down-open")) {
    chevron.classList.remove("fa-chevron-down-open");
    chevron.classList.add("fa-chevron-down-close");
  } else {
    chevron.classList.remove("fa-chevron-down-close");
    chevron.classList.add("fa-chevron-down-open");
  };
};



let form = document.querySelector(".form-project-js");

document.querySelector(".fa-plus-js").addEventListener("click", showFormProject);
function showFormProject() {
  $('.collapse-js').collapse('show');
  form.classList.remove("d-none");
};
document.querySelector(".close-form-project-js").addEventListener("click", closeFormProject);
function closeFormProject() {
  form.classList.add("d-none");
  document.querySelector(".form-project-js").reset();
};
// Prevents the forms from refreshing the page from submiting.
$(".form-project-js, .form-task-js").submit(function (e) {
  e.preventDefault();
});

form.addEventListener("submit", function() {
  project.addNewProject();
});
function validateInputNameProject(inputNameValue) {
  if (inputNameValue == "") {
    return false;
  } else {
    return true;
  };
};



let taskForm = document.querySelector(".form-task-js");
// Makes the form for a new task appear when "+ add task" is clicked.
document.querySelector(".add-task-js").addEventListener("click", function showFormTask() {
  taskForm.classList.remove("d-none");
  document.querySelector(".add-task-js").classList.add("d-none");
});

document.querySelector(".close-form-task-js").addEventListener("click", closeFormTask);
function closeFormTask() {
  taskForm.classList.add("d-none");
  document.querySelector(".add-task-js").classList.remove("d-none");
  document.querySelector(".form-task-js").reset();
};




project.refreshListOfProjects();
$('.collapse-js').collapse('show');