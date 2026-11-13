(function () {
  "use strict";
  var API = "https://cheflogic-pruebas.onrender.com/api/public/billing/link";
  var $ = function (s) { return document.querySelector(s); };
  var form = $("#sub-form"), msg = $("#sub-msg");
  if (/[?&]ok=1/.test(location.search)) { form.hidden = true; $("#sub-ok").hidden = false; return; }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = $("#email").value.trim();
    if (!email || email.indexOf("@") < 1) { msg.textContent = "Escribe un correo válido."; msg.className = "reg-msg err"; msg.hidden = false; return; }
    var btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email, portal: $("#portal").checked }) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { r: r, d: d }; }); })
      .then(function (x) {
        if (x.r.ok) { form.hidden = true; $("#sub-done").hidden = false; $("#sub-done").focus(); return; }
        msg.textContent = typeof x.d.detail === "string" ? x.d.detail : "Ha ocurrido un error. Inténtalo de nuevo en unos minutos.";
        msg.className = "reg-msg err"; msg.hidden = false; btn.disabled = false;
      })
      .catch(function () { msg.textContent = "No hay conexión. Inténtalo de nuevo."; msg.className = "reg-msg err"; msg.hidden = false; btn.disabled = false; });
  });
})();
