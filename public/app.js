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
let works = [];
let selectedCategory = "all";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[character]);
}

function coverMarkup(work, compact = false) {
  const symbol = { bestiary: "❧", rose: "❦", nights: "☾", hours: "✥" }[work.cover] || "✦";
  return '<div class="cover ' + escapeHtml(work.cover) + '"><div class="cover-title"><span class="cover-symbol">' + symbol + '</span>' + escapeHtml(work.title) + '</div><span class="cover-subtitle">✦ · SCRIPTORIUM · ✦</span></div>';
}

function renderWorks() {
  const query = searchInput.value.trim().toLocaleLowerCase("es");
  let visible = works.filter((work) => {
    const matchesCategory = selectedCategory === "all" || work.category === selectedCategory;
    const text = [work.title, work.author, work.category, work.period, work.description].join(" ").toLocaleLowerCase("es");
    return matchesCategory && text.includes(query);
  });
  if (sortSelect.value === "title") visible.sort((a, b) => a.title.localeCompare(b.title, "es"));
  if (sortSelect.value === "author") visible.sort((a, b) => a.author.localeCompare(b.author, "es"));
  resultCount.textContent = String(visible.length).padStart(2, "0") + " OBRA" + (visible.length === 1 ? "" : "S EN EL CATÁLOGO");
  if (!visible.length) {
    grid.innerHTML = '<p class="empty-message">No encontramos obras con esos términos. Prueba otra búsqueda.</p>';
    return;
  }
  grid.innerHTML = visible.map((work) => '<article class="work-card" tabindex="0" role="button" aria-label="Abrir ficha de ' + escapeHtml(work.title) + '" data-id="' + work.id + '">' + coverMarkup(work) + '<div class="work-meta"><span class="category">' + escapeHtml(work.category.toUpperCase()) + '</span><h3>' + escapeHtml(work.title) + '</h3><p>' + escapeHtml(work.author) + '</p><span class="work-period">' + escapeHtml(work.period.toUpperCase()) + '</span></div></article>').join("");
}

function openWork(id) {
  const work = works.find((item) => item.id === Number(id));
  if (!work) return;
  dialogContent.innerHTML = '<div class="dialog-work">' + coverMarkup(work, true) + '<div><p class="eyebrow">FICHA DE LA COLECCIÓN</p><h2 id="dialog-title">' + escapeHtml(work.title) + '</h2><p class="dialog-author">' + escapeHtml(work.author) + '</p><p class="dialog-description">' + escapeHtml(work.description) + '</p><p class="dialog-detail"><strong>Época:</strong> ' + escapeHtml(work.period) + '</p><p class="dialog-detail"><strong>Lengua:</strong> ' + escapeHtml(work.language) + '</p><p class="dialog-detail"><strong>Sección:</strong> ' + escapeHtml(work.category) + '</p><h3>Fragmento</h3><p class="dialog-excerpt">“' + escapeHtml(work.excerpt) + '”</p></div></div>';
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
}

async function loadWorks() {
  try {
    const response = await fetch("/api/works");
    if (!response.ok) throw new Error("No se pudo consultar el catálogo");
    works = await response.json();
    renderWorks();
  } catch (error) {
    grid.innerHTML = '<p class="empty-message">No se pudo abrir el catálogo. Comprueba que el servidor esté en marcha y vuelve a intentarlo.</p>';
    resultCount.textContent = "CATÁLOGO NO DISPONIBLE";
    console.error(error);
  }
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
  const card = event.target.closest("[data-id]");
  if (card) openWork(card.dataset.id);
});
grid.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-id]")) {
    event.preventDefault();
    openWork(event.target.dataset.id);
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

loadWorks();
