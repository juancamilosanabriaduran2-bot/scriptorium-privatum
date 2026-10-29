(() => {
 const $ = (s) => document.querySelector(s);
 const search = $("#library-search"), shelf = $("#shelf-filter"), rating = $("#rating-filter");
 const results = $("#library-results"), count = $("#library-result-count"), pageLabel = $("#library-page");
 const prev = $("#library-prev"), next = $("#library-next");
 const pageSize = 15; let page = 1, allBooks = [];
 const escape = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const shelfName = {"read":"Leído","currently-reading":"Leyendo","to-read":"Por leer","did-not-finish":"Abandonado","unshelved":"Sin estantería"};
 const stars = (n) => n ? "★".repeat(n) + "☆".repeat(5-n) : "Sin puntuación";
 const formatDate = (s) => { if(!s) return ""; const p=s.split("/"); return p.length===3 ? p[2]+"-"+p[1]+"-"+p[0] : s; };
 function filtered(){
  const q=search.value.trim().toLocaleLowerCase("es"), sh=shelf.value, rt=rating.value;
  return allBooks.filter(b => (sh==="all"||b.shelf===sh) && (rt==="all"||(rt==="0"?b.rating===0:b.rating===Number(rt))) && (!q||[b.title,b.author,b.additionalAuthors,b.review,b.shelves,b.publisher].join(" ").toLocaleLowerCase("es").includes(q)));
 }
 function render(){
  const list=filtered(), pages=Math.max(1,Math.ceil(list.length/pageSize)); page=Math.min(page,pages);
  count.textContent=list.length+" libros encontrados · "+list.filter(b=>b.review.trim()).length+" con reseña en este resultado";
  pageLabel.textContent="Página "+page+" de "+pages; prev.disabled=page<=1; next.disabled=page>=pages;
  if(!list.length){results.innerHTML='<p class="empty-library">No encontré libros con esos filtros. Prueba otra búsqueda.</p>';return;}
  results.innerHTML=list.slice((page-1)*pageSize,page*pageSize).map(b=>'<article class="library-item"><div class="library-bookmark">'+(b.rating?'★'.repeat(b.rating)+'<span>'+'☆'.repeat(5-b.rating)+'</span>':'<span class="unrated">SIN<br>NOTA</span>')+'</div><div class="library-item-main"><p class="library-item-meta">'+escape(shelfName[b.shelf]||b.shelf)+' '+(b.dateRead?'· Leído '+escape(formatDate(b.dateRead)):'')+'</p><h3>'+escape(b.title)+'</h3><p class="library-author">'+escape(b.author)+(b.year?' · '+escape(b.year):'')+'</p>'+(b.review.trim()?'<p class="library-review-preview">'+escape(b.review).slice(0,230)+(b.review.length>230?'…':'')+'</p>':'<p class="library-no-review">Todavía no hay una reseña escrita para este libro.</p>')+'<button class="read-entry" data-book="'+escape(b.id)+'">Abrir ficha y reseña ↗</button></div><span class="library-shelf-tag">'+escape(shelfName[b.shelf]||b.shelf)+'</span></article>').join("");
 }
 function openBook(id){
  const b=allBooks.find(x=>x.id===id); if(!b)return;
  const dialog=document.createElement("dialog");dialog.className="book-entry-dialog";
  dialog.innerHTML='<button class="entry-close" aria-label="Cerrar">×</button><p class="overline">MI ARCHIVO LITERARIO</p><h2>'+escape(b.title)+'</h2><p class="entry-author">'+escape(b.author)+(b.year?' · '+escape(b.year):'')+'</p><p class="entry-stars">'+escape(stars(b.rating))+'</p><div class="entry-facts"><span><b>Estantería</b>'+escape(shelfName[b.shelf]||b.shelf)+'</span>'+(b.dateRead?'<span><b>Fecha de lectura</b>'+escape(formatDate(b.dateRead))+'</span>':'')+(b.pages?'<span><b>Páginas</b>'+escape(b.pages)+'</span>':'')+(b.publisher?'<span><b>Editorial</b>'+escape(b.publisher)+'</span>':'')+'</div><h3>Mi reseña</h3><div class="entry-review">'+(b.review.trim()?escape(b.review).replace(/\n/g,"<br>"):'<p class="library-no-review">No escribí una reseña para este libro en la exportación.</p>')+'</div>'+(b.shelves?'<p class="entry-tags"><b>Etiquetas:</b> '+escape(b.shelves)+'</p>':'')+'<a class="entry-goodreads" href="https://www.goodreads.com/book/show/'+encodeURIComponent(b.id)+'" target="_blank" rel="noopener">Ver libro en Goodreads ↗</a>';
  document.body.appendChild(dialog);dialog.querySelector(".entry-close").onclick=()=>dialog.close();dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});dialog.addEventListener("close",()=>dialog.remove());dialog.showModal();
 }
 [search,shelf,rating].forEach(el=>el.addEventListener("input",()=>{page=1;render()}));
 prev.addEventListener("click",()=>{page--;render();$("#archivo").scrollIntoView({behavior:"smooth"})});
 next.addEventListener("click",()=>{page++;render();$("#archivo").scrollIntoView({behavior:"smooth"})});
 results.addEventListener("click",e=>{const btn=e.target.closest("[data-book]");if(btn)openBook(btn.dataset.book)});
 fetch("./books.json").then(r=>{if(!r.ok)throw Error("No se pudo cargar la biblioteca");return r.json()}).then(data=>{allBooks=data.books;render()}).catch(()=>{count.textContent="No se pudo cargar el archivo de libros.";results.innerHTML='<p class="empty-library">La biblioteca no se pudo cargar. Intenta recargar la página.</p>'});
})();