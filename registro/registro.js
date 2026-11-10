(function () {
  "use strict";
  var API = "https://cheflogic-pruebas.onrender.com/api/public";
  var $ = function (s) { return document.querySelector(s); };

  function show(el, msg, kind) {
    el.textContent = msg;
    el.className = "reg-msg " + (kind || "");
    el.hidden = false;
  }

  function errorText(res, data) {
    if (data && typeof data.detail === "string") return data.detail;
    if (res.status === 422) return "Revisa los datos: la contraseña necesita 12 caracteres, con mayúsculas, minúsculas y números.";
    return "Ha ocurrido un error. Inténtalo de nuevo en unos minutos.";
  }

  var form = $("#reg-form");
  if (form) {
    var msg = $("#reg-msg");
    var btn = form.querySelector("button[type=submit]");
    var pw = $("#password");
    $("#toggle-pw").addEventListener("click", function () {
      var visible = pw.type === "text";
      pw.type = visible ? "password" : "text";
      this.textContent = visible ? "Mostrar" : "Ocultar";
      this.setAttribute("aria-pressed", String(!visible));
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = pw.value;
      if (v.length < 12 || !/[A-Z]/.test(v) || !/[a-z]/.test(v) || !/\d/.test(v)) {
        show(msg, "La contraseña necesita al menos 12 caracteres, con mayúsculas, minúsculas y números.", "err");
        pw.focus();
        return;
      }
      if (!$("#terms").checked || !$("#privacy").checked) {
        show(msg, "Debes aceptar las condiciones y la política de privacidad para continuar.", "err");
        return;
      }
      btn.disabled = true;
      msg.hidden = true;
      var body = {
        restaurant_name: $("#restaurant").value.trim(),
        owner_name: $("#owner").value.trim(),
        email: $("#email").value.trim(),
        password: v,
        accept_terms: true,
        accept_privacy: true,
        website: $("#website").value
      };
      fetch(API + "/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }).then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) { return { res: res, data: data }; });
      }).then(function (r) {
        if (r.res.status === 202) {
          form.hidden = true;
          $("#reg-done").hidden = false;
          $("#reg-done-email").textContent = body.email;
          $("#reg-done").focus();
        } else {
          show(msg, errorText(r.res, r.data), "err");
          btn.disabled = false;
        }
      }).catch(function () {
        show(msg, "No hemos podido conectar. Comprueba tu conexión e inténtalo de nuevo.", "err");
        btn.disabled = false;
      });
    });
  }

  var verifyBtn = $("#verify-btn");
  if (verifyBtn) {
    var vmsg = $("#verify-msg");
    var m = /[#&]token=([A-Za-z0-9_-]+)/.exec(location.hash);
    var token = m ? m[1] : "";
    if (history.replaceState) history.replaceState(null, "", location.pathname);
    if (!token) {
      show(vmsg, "Este enlace no es válido. Pide el registro de nuevo desde la página de registro.", "err");
      verifyBtn.hidden = true;
    }
    verifyBtn.addEventListener("click", function () {
      verifyBtn.disabled = true;
      vmsg.hidden = true;
      fetch(API + "/signup/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token })
      }).then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) { return { res: res, data: data }; });
      }).then(function (r) {
        if (r.res.ok && r.data && r.data.ok) {
          $("#verify-box").hidden = true;
          $("#verify-done").hidden = false;
          $("#verify-email").textContent = r.data.email;
          $("#verify-days").textContent = r.data.trial_days;
          $("#verify-done").focus();
        } else {
          show(vmsg, errorText(r.res, r.data), "err");
          verifyBtn.disabled = false;
        }
      }).catch(function () {
        show(vmsg, "No hemos podido conectar. Comprueba tu conexión e inténtalo de nuevo.", "err");
        verifyBtn.disabled = false;
      });
    });
  }
})();
