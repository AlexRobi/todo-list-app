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

  return {
    createProject,
  }

})();


const basic = project.createProject("Basique");

console.log(basic);