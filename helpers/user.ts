export const setDefaultSettings = () => {
  if (!localStorage.getItem("dynamicBackground")) {
    localStorage.setItem("dynamicBackground", "true");
  }
  if (!localStorage.getItem("showCardBackground")) {
    localStorage.setItem("showCardBackground", "true");
  }
  if (!localStorage.getItem("showTrackNumber")) {
    localStorage.setItem("showTrackNumber", "false");
  }
  if (!localStorage.getItem("showAnimations")) {
    localStorage.setItem("showAnimations", "true");
  }
};
