import {
  format,
  formatDistance,
  formatRelative,
  subDays
} from 'date-fns';
// console.log(format(new Date(2014, 1, 11), 'MM/DD/YYYY'));

const project = (function () {

  const createProject = (name) => {
    let listOfTasks = [];
    return {
      name,
      listOfTasks,
    };
  };

  const deleteProject = (btn) => {
    if (confirm("Are you sure?")) {
      let index = btn.getAttribute("data-index");
      // Uses the value of data-index to delete the project from the listOfProjects.
      listOfProjects.splice(index, 1);
      refreshListOfProjects();
    };
  };

  const defaultProject = createProject("Default project");
  let listOfProjects = [defaultProject];


  const refreshListOfProjects = () => {
    const projectsList = document.querySelector(".projects-list");

    resetListOfProjects(projectsList);

    listOfProjects.forEach(function(project, index) {
      const projectWrapper = document.createElement("div");
      projectWrapper.classList.add("project");
      projectWrapper.setAttribute("data-index", index);
      projectsList.appendChild(projectWrapper);

      const projectName = document.createElement("div");
      projectName.classList.add("project__name");
      projectName.textContent = project.name;
      projectWrapper.appendChild(projectName);

      const btn = document.createElement("button");
      btn.classList.add("btn");
      btn.textContent = "x";
      // Adds the index of the project from the listOfprojects to the button.
      btn.setAttribute("data-index", index);
      btn.addEventListener("click", function() {
        deleteProject(this);
      });
      projectWrapper.appendChild(btn)
    });

  };

  const resetListOfProjects = (projectsList) => {
    // Resets the list by removing all child from the DOM.
    while (projectsList.firstChild) {
      projectsList.removeChild(projectsList.firstChild);
    };
  };


  return {
    listOfProjects,
    createProject,
    refreshListOfProjects,
  };

})();



document.querySelector(".project-collapse-js").addEventListener("click", animateChevron);
function animateChevron() {
  let chevron = document.querySelector(".fa-chevron-up");
  if (chevron.classList.contains("fa-chevron-up-open")) {
    chevron.classList.remove("fa-chevron-up-open");
    chevron.classList.add("fa-chevron-up-close");

  } else {
    chevron.classList.remove("fa-chevron-up-close");
    chevron.classList.add("fa-chevron-up-open");
  };
};



let form = document.querySelector(".form-project-js");

document.querySelector(".fa-plus-js").addEventListener("click", showFormProject);
function showFormProject() {;
  $('.collapse').collapse();
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

form.addEventListener("submit", saveFormProject);
function saveFormProject() {
  let inputNameValue = document.querySelector(".input-name-project").value;
  if (validateInputNameProject(inputNameValue)) {
    let newProject = project.createProject(inputNameValue);
    project.listOfProjects.push(newProject);
    project.refreshListOfProjects();
    console.log(project.listOfProjects)
    form.classList.add("d-none");
  };
};
function validateInputNameProject(inputNameValue) {
  if (inputNameValue == "") {
    return false;
  } else {
    return true;
  };
};

project.refreshListOfProjects();