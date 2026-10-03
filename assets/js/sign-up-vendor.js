// Campus Space – inscription vendeur

// Mode démo : tant que c'est "true", l'inscription est simulée et aucune requête n'est envoyée.
// Passe à "false" quand ton serveur est prêt, et adapte l'adresse ci-dessous.
var DEMO = true;
var SIGNUP_ENDPOINT = "/api/vendors";

var form = document.getElementById("signupForm");
var alertBox = document.getElementById("formAlert");
var submitBtn = document.getElementById("submitBtn");

var fullname = document.getElementById("fullname");
var phone = document.getElementById("phone");
var campus = document.getElementById("campus");
var campusOther = document.getElementById("campusOther");
var campusOtherField = document.getElementById("campusOtherField");
var shop = document.getElementById("shop");
var category = document.getElementById("category");
var bio = document.getElementById("bio");
var bioCount = document.getElementById("bio-count");
var password = document.getElementById("password");
var terms = document.getElementById("terms");
var payBoxes = document.querySelectorAll('#pay input[type="checkbox"]');

Auth.bindPhone(phone);
Auth.bindPasswordToggle(document.getElementById("pwToggle"), password);

// "Un autre campus" : on demande le nom
campus.addEventListener("change", function () {
  var other = campus.value === "autre";
  campusOtherField.hidden = !other;
  if (!other) { campusOther.value = ""; Auth.clearError("campusOther"); }
});

// Compteur de caractères
bio.addEventListener("input", function () {
  bioCount.textContent = bio.value.length + " / 140";
});

// Chaque champ : son id (pour l'erreur), l'élément à mettre en avant, et le contrôle
var rules = [
  { id: "fullname", el: fullname, check: function () {
      return fullname.value.trim().length < 3 ? "Entre ton nom et ton prénom." : "";
  }},
  { id: "phone", el: phone, check: function () {
      return Auth.isPhone(phone.value) ? "" : "Entre ton numéro à 10 chiffres, par exemple 07 00 00 00 00.";
  }},
  { id: "campus", el: campus, check: function () {
      return campus.value === "" ? "Choisis ton campus." : "";
  }},
  { id: "campusOther", el: campusOther, check: function () {
      if (campus.value !== "autre") return "";
      return campusOther.value.trim().length < 2 ? "Écris le nom de ton campus." : "";
  }},
  { id: "shop", el: shop, check: function () {
      return shop.value.trim().length < 2 ? "Donne un nom à ta boutique." : "";
  }},
  { id: "category", el: category, check: function () {
      return category.value === "" ? "Choisis ce que tu vends." : "";
  }},
  { id: "pay", el: payBoxes[0], check: function () {
      var any = Array.prototype.some.call(payBoxes, function (b) { return b.checked; });
      return any ? "" : "Choisis au moins un moyen de paiement.";
  }},
  { id: "password", el: password, check: function () {
      return password.value.length < 8 ? "Ton mot de passe doit avoir au moins 8 caractères." : "";
  }},
  { id: "terms", el: terms, check: function () {
      return terms.checked ? "" : "Accepte les conditions pour continuer.";
  }}
];

function runRule(rule) {
  var msg = rule.check();
  if (msg) Auth.setError(rule.id, msg); else Auth.clearError(rule.id);
  return msg === "";
}

function validateAll() {
  var firstInvalid = null;
  rules.forEach(function (rule) {
    if (!runRule(rule) && !firstInvalid) firstInvalid = rule.el;
  });
  if (firstInvalid) firstInvalid.focus();
  return !firstInvalid;
}

// Vérifie un champ quand on le quitte, et efface l'erreur quand on le corrige
rules.forEach(function (rule) {
  var field = document.getElementById(rule.id + "-error").closest(".field");
  field.addEventListener("focusout", function (e) {
    if (field.contains(e.relatedTarget)) return; // on reste dans le même champ
    var touched = rule.id === "pay" || rule.id === "terms" || (rule.el.value && rule.el.value !== "");
    if (touched) runRule(rule);
  });
  field.addEventListener("input", function () {
    if (!document.getElementById(rule.id + "-error").hidden) runRule(rule);
  });
  field.addEventListener("change", function () {
    if (!document.getElementById(rule.id + "-error").hidden) runRule(rule);
  });
});

async function createVendor(data) {
  if (DEMO) {
    await Auth.wait(900);
    return;
  }
  var res = await fetch(SIGNUP_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include"
  });
  if (res.status === 409) throw new Error("Un compte existe déjà avec ce numéro. Connecte-toi plutôt.");
  if (!res.ok) throw new Error("Une erreur est survenue. Réessaie dans un instant.");
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  Auth.hideAlert(alertBox);
  if (!validateAll()) return;

  var data = {
    fullName: fullname.value.trim(),
    phone: "+225" + Auth.digits(phone.value),
    campus: campus.value === "autre" ? campusOther.value.trim() : campus.value,
    shopName: shop.value.trim(),
    category: category.value,
    description: bio.value.trim(),
    payments: Array.prototype.filter.call(payBoxes, function (b) { return b.checked; })
      .map(function (b) { return b.value; }),
    password: password.value
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Création en cours…";
  try {
    await createVendor(data);
    showSuccess(data);
  } catch (err) {
    var offline = err instanceof TypeError;
    Auth.showAlert(alertBox, offline ? "Connexion impossible. Vérifie ton réseau et réessaie." : err.message);
    alertBox.scrollIntoView({ behavior: "smooth", block: "center" });
    submitBtn.disabled = false;
    submitBtn.textContent = "Créer ma boutique";
  }
});

function showSuccess(data) {
  var firstName = data.fullName.split(/\s+/)[0];
  document.getElementById("successText").textContent =
    "Bienvenue, " + firstName + ". « " + data.shopName + " » est prête. Connecte-toi pour ajouter ton premier article.";
  document.getElementById("formView").hidden = true;
  var view = document.getElementById("successView");
  view.hidden = false;
  document.getElementById("successTitle").focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
