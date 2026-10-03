// Campus Space – fonctions communes au login et à l'inscription vendeur
(function () {
  var Auth = (window.Auth = {});

  Auth.SUPPORT = "2250700000000"; // numéro WhatsApp de l'équipe

  Auth.digits = function (s) { return String(s).replace(/\D/g, ""); };

  // Numéro ivoirien à 10 chiffres, affiché par paires : 07 00 00 00 00
  Auth.bindPhone = function (input) {
    input.addEventListener("input", function () {
      var d = Auth.digits(input.value).slice(0, 10);
      input.value = d.replace(/(\d{2})(?=\d)/g, "$1 ");
    });
  };
  Auth.isPhone = function (v) { return Auth.digits(v).length === 10; };

  // Bouton Afficher / Masquer pour un mot de passe
  Auth.bindPasswordToggle = function (btn, input) {
    btn.addEventListener("click", function () {
      var show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.textContent = show ? "Masquer" : "Afficher";
      btn.setAttribute("aria-pressed", show);
    });
  };

  // Erreur sous un champ : le bloc d'erreur a l'id "<id>-error"
  Auth.setError = function (id, msg) {
    var err = document.getElementById(id + "-error");
    var field = err.closest(".field");
    err.textContent = msg;
    err.hidden = false;
    field.classList.add("has-error");
    field.querySelectorAll("input, select, textarea").forEach(function (el) {
      el.setAttribute("aria-invalid", "true");
    });
  };
  Auth.clearError = function (id) {
    var err = document.getElementById(id + "-error");
    var field = err.closest(".field");
    err.hidden = true;
    err.textContent = "";
    field.classList.remove("has-error");
    field.querySelectorAll("input, select, textarea").forEach(function (el) {
      el.removeAttribute("aria-invalid");
    });
  };

  // Alerte en haut du formulaire (erreur serveur, réseau...)
  Auth.showAlert = function (el, msg) { el.textContent = msg; el.hidden = false; };
  Auth.hideAlert = function (el) { el.hidden = true; el.textContent = ""; };

  Auth.wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
})();
