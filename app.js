const menu=document.querySelector('.menu'),nav=document.querySelector('#nav');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));nav.classList.toggle('open',!open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}});
document.querySelectorAll('[data-dialog]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.dialog).showModal()));
document.querySelector('.close').addEventListener('click',()=>document.querySelector('dialog').close());
document.getElementById('year').textContent=new Date().getFullYear();
(()=>{const q=new URLSearchParams(location.search);if(q.get('utm_campaign')!=='rentable'||document.documentElement.lang!=='es')return;const h=document.querySelector('.hero h1'),l=document.querySelector('.hero .lead'),i=document.querySelector('.hero .intro');if(!h)return;h.innerHTML='¿Tu negocio<br>es rentable<br><em>de verdad?</em>';if(l)l.innerHTML='Mira lo que te cuesta cada plato<br>y cuánto ganas cada mes, desde el móvil.';if(i)i.textContent='Escandallos, control de gastos, stock y proveedores en una app. Y tu equipo lleva en el móvil las tareas de cada turno y los registros de Sanidad.'})();
