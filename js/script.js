document.documentElement.classList.add("js");

// Suporte inteligente a query param ?plano=basico
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("plano") === "basico" && !window.location.pathname.endsWith("basico.html")) {
  window.location.replace("basico.html" + window.location.search);
}

window.addEventListener("DOMContentLoaded", () => {
  requestAnimationFrame(() => document.body.classList.add("is-ready"));
});
