import {
  format,
  formatDistance,
  formatRelative,
  subDays
} from 'date-fns';
// console.log(format(new Date(2014, 1, 11), 'MM/DD/YYYY'));

function saveData(data) {
  localStorage.setItem("savedListOfProjects", JSON.stringify(data));
};
function loadData() {
  return JSON.parse(localStorage.getItem("savedListOfProjects"));
};

const project = (function () {

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
    const defaultProject = createProject("Default");
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
    };
  }

  const deleteProject = (btn) => {
    if (confirm("Delete this project?")) {
      let index = btn.getAttribute("data-index");
      // Uses the value of data-index to delete the project from the listOfProjects.
      listOfProjects.splice(index, 1);
      saveData(listOfProjects);
      refreshListOfProjects();
    };
  };

  const showProjectInformation = (project, index) => {
    let projectTitle = document.querySelector(".project-info__title");
    projectTitle.textContent = project.name;
    setProjectDOMActive(index);
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
function showFormProject() {;
  $('.collapse-js').collapse('show');
  animateChevron();
  form.classList.remove("d-none");
};

document.querySelector(".close-form-project-js").addEventListener("click", closeFormProject);
function closeFormProject() {
  form.classList.add("d-none");
};
// Prevents the form from submitting.
$(".form-project-js").submit(function (e) {
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




project.refreshListOfProjects();