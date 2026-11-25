const menuDialog = document.querySelector("#site-menu");
const menuToggle = document.querySelector("#menu-toggle");
const menuClose = document.querySelector("#menu-close");
const menuAuthToggle = menuDialog.querySelector("[data-auth-toggle]");

menuToggle.addEventListener("click", () => {
  menuDialog.showModal();
  menuToggle.setAttribute("aria-expanded", "true");
});

menuClose.addEventListener("click", () => menuDialog.close());
menuAuthToggle.addEventListener("click", () => menuDialog.close());
menuDialog.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => menuDialog.close());
});
menuDialog.addEventListener("click", (event) => {
  if (event.target === menuDialog) menuDialog.close();
});
menuDialog.addEventListener("close", () => {
  menuToggle.setAttribute("aria-expanded", "false");
});
