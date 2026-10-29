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
let selectedCategory = "all";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[character]);
}

function getWorks() {
  return [...grid.querySelectorAll(".work-card")].map((card, index) => ({
    element: card,
    id: card.dataset.id,
    title: card.dataset.title,
    author: card.dataset.author,
    period: card.dataset.period,
    category: card.dataset.category,
    language: card.dataset.language,
    cover: card.dataset.cover,
    description: card.dataset.description,
    note: card.dataset.note,
    index
  }));
}

function coverMarkup(work) {
  const symbol = { bestiary: "❧", rose: "❦", nights: "☾", hours: "✥" }[work.cover] || "✦";
  return '<div class="cover ' + escapeHtml(work.cover) + '"><div class="cover-title"><span class="cover-symbol">' + symbol + '</span>' + escapeHtml(work.title) + '</div><span class="cover-subtitle">' + escapeHtml(work.author) + '</span></div>';
}

function renderWorks() {
  const query = searchInput.value.trim().toLocaleLowerCase("es");
  const works = getWorks();
  const visible = works.filter((work) => {
    const matchesCategory = selectedCategory === "all" || work.category === selectedCategory;
    const text = [work.title, work.author, work.category, work.period, work.description].join(" ").toLocaleLowerCase("es");
    return matchesCategory && text.includes(query);
  });
  visible.forEach((work) => {
    work.element.hidden = false;
    grid.appendChild(work.element);
  });
  works.filter((work) => !visible.includes(work)).forEach((work) => { work.element.hidden = true; });
  if (sortSelect.value === "title") visible.sort((a, b) => a.title.localeCompare(b.title, "es"));
  if (sortSelect.value === "author") visible.sort((a, b) => a.author.localeCompare(b.author, "es"));
  if (sortSelect.value === "featured") visible.sort((a, b) => a.index - b.index);
  visible.forEach((work) => grid.appendChild(work.element));
  resultCount.textContent = String(visible.length).padStart(2, "0") + " OBRA" + (visible.length === 1 ? "" : "S") + " EN EL CATÁLOGO";
  let empty = grid.querySelector(".empty-message");
  if (!visible.length) {
    if (!empty) {
      empty = document.createElement("p");
      empty.className = "empty-message";
      empty.textContent = "No encontramos obras con esos términos. Prueba otra búsqueda.";
      grid.appendChild(empty);
    }
  } else if (empty) empty.remove();
}

function openWork(card) {
  const work = {
    title: card.dataset.title, author: card.dataset.author, period: card.dataset.period,
    category: card.dataset.category, language: card.dataset.language, cover: card.dataset.cover,
    description: card.dataset.description, note: card.dataset.note
  };
  dialogContent.innerHTML = '<div class="dialog-work">' + coverMarkup(work) + '<div><p class="eyebrow">FICHA DE LA COLECCIÓN</p><h2 id="dialog-title">' + escapeHtml(work.title) + '</h2><p class="dialog-author">' + escapeHtml(work.author) + '</p><p class="dialog-description">' + escapeHtml(work.description) + '</p><p class="dialog-detail"><strong>Época:</strong> ' + escapeHtml(work.period) + '</p><p class="dialog-detail"><strong>Lengua:</strong> ' + escapeHtml(work.language) + '</p><p class="dialog-detail"><strong>Sección:</strong> ' + escapeHtml(work.category) + '</p><h3>Nota de lectura</h3><p class="dialog-excerpt">' + escapeHtml(work.note) + '</p></div></div>';
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
}

searchInput.addEventListener("input", renderWorks);
sortSelect.addEventListener("change", renderWorks);
categoryRow.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-category]");
  if (!button) return;
  selectedCategory = button.dataset.category;
  categoryRow.querySelectorAll(".category-chip").forEach((chip) => chip.classList.toggle("active", chip === button));
  renderWorks();
});
grid.addEventListener("click", (event) => {
  const card = event.target.closest(".work-card");
  if (card) openWork(card);
});
grid.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches(".work-card")) {
    event.preventDefault();
    openWork(event.target);
  }
});
dialogClose.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
});
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));
renderWorks();
