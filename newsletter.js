const newsletterForm = document.querySelector("#newsletter-form");
const newsletterStatus = document.querySelector("#newsletter-status");

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  newsletterStatus.textContent = "Newsletter sign-up is not connected yet. Your email has not been saved.";
});

newsletterForm.addEventListener("input", () => {
  newsletterStatus.textContent = "";
});
