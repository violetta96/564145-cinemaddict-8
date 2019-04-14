export const createElement = (template) => {
  const newDiv = document.createElement(`div`);
  newDiv.innerHTML = template;
  return newDiv.firstChild;
};
