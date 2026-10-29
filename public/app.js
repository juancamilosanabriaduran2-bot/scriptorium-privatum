const grid = document.querySelector("#book-grid");
const searchInput = document.querySelector("#search-input");
const categoryRow = document.querySelector("#category-row");
const sortSelect = document.querySelector("#sort-select");
const resultCount = document.querySelector("#result-count");
const dialog = document.querySelector("#work-dialog");
const dialogContent = document.querySelector("#dialog-content");
const dialogClose = document.querySelector("#dialog-close");
const menuToggle = document.querySelector("#menu-toggle");
const nav = document.querySelector(".main-nav");

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[character]);
}
function getWorks() {
  return [...grid.querySelectorAll(".work-card")].map((card, index) => ({
    element: card, id: card.dataset.id, title: card.dataset.title,
    author: card.dataset.author, period: card.dataset.period,
    category: card.dataset.category, language: card.dataset.language,
    cover: card.dataset.cover, description: card.dataset.description,
    note: card.dataset.note, index
  }));
}
function coverMarkup(work) {
  const symbol = { bestiary: "❧", rose: "❦", nights: "☾", hours: "✥" }[work.cover] || "✦";
  return '<div class="cover ' + escapeHtml(work.cover) + '"><div class="cover-title"><span class="cover-symbol">' + symbol + '</span>' + escapeHtml(work.title) + '</div><span class="cover-subtitle">' + escapeHtml(work.author) + '</span></div>';
}
function renderWorks() {
  const query = document.querySelector("#search-input")?.value.trim().toLocaleLowerCase("es") || "";
  const works = getWorks();
  const visible = works.filter((work) => [work.title, work.author, work.category, work.period, work.description].join(" ").toLocaleLowerCase("es").includes(query));
  visible.forEach((work) => { work.element.hidden = false; grid.appendChild(work.element); });
  works.filter((work) => !visible.includes(work)).forEach((work) => { work.element.hidden = true; });
}
function openWork(card) {
  const work = {
    title: card.dataset.title, author: card.dataset.author, period: card.dataset.period,
    category: card.dataset.category, language: card.dataset.language, cover: card.dataset.cover,
    description: card.dataset.description, note: card.dataset.note
  };
  dialogContent.innerHTML = '<div class="dialog-work">' + coverMarkup(work) + '<div><p class="eyebrow">LECTURA EN MI BIBLIOTECA</p><h2 id="dialog-title">' + escapeHtml(work.title) + '</h2><p class="dialog-author">' + escapeHtml(work.author) + '</p><p class="dialog-description">' + escapeHtml(work.description) + '</p><p class="dialog-detail"><strong>Estado:</strong> ' + escapeHtml(work.period) + '</p><p class="dialog-detail"><strong>Lengua:</strong> ' + escapeHtml(work.language) + '</p><p class="dialog-detail"><strong>Sección:</strong> ' + escapeHtml(work.category) + '</p><h3>Nota</h3><p class="dialog-excerpt">' + escapeHtml(work.note) + '</p><a class="text-link" href="https://www.goodreads.com/user/show/186595924-juan-sanabria" target="_blank" rel="noopener">Ver perfil de Goodreads ↗</a></div></div>';
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
}
document.querySelector("#search-input")?.addEventListener("input", renderWorks);
grid?.addEventListener("click", (event) => { const card = event.target.closest(".work-card"); if (card) openWork(card); });
grid?.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches(".work-card")) {
    event.preventDefault(); openWork(event.target);
  }
});
dialogClose?.addEventListener("click", () => dialog.close());
dialog?.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
menuToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
});
nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  nav.classList.remove("open"); menuToggle.setAttribute("aria-expanded", "false");
}));
renderWorks();
