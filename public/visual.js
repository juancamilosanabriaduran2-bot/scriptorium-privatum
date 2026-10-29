(() => {
 const root=document.documentElement, button=()=>document.getElementById("theme-toggle");
 const saved=localStorage.getItem("scriptorium-theme");
 const prefersDark=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches;
 function apply(theme){
  root.dataset.theme=theme;
  const b=button(); if(!b)return;
  const dark=theme==="dark";
  b.setAttribute("aria-pressed",String(dark));
  b.setAttribute("aria-label",dark?"Activar modo claro":"Activar modo oscuro");
  b.innerHTML='<span class="theme-icon" aria-hidden="true">'+(dark?"☀":"☾")+'</span><span class="theme-label">'+(dark?"Modo claro":"Modo nocturno")+'</span>';
 }
 apply(saved||(prefersDark?"dark":"light"));
 document.addEventListener("DOMContentLoaded",()=>{
  apply(localStorage.getItem("scriptorium-theme")||(prefersDark?"dark":"light"));
  button()?.addEventListener("click",()=>{
   const theme=root.dataset.theme==="dark"?"light":"dark";
   localStorage.setItem("scriptorium-theme",theme);apply(theme);
  });
 });
 let pending=false;
 document.addEventListener("pointermove",e=>{
  if(e.pointerType==="touch"||pending)return;pending=true;
  requestAnimationFrame(()=>{
   root.style.setProperty("--ambient-x",e.clientX+"px");
   root.style.setProperty("--ambient-y",e.clientY+"px");
   pending=false;
  });
 },{passive:true});
})();