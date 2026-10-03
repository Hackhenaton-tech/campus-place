// Campus Space – connexion vendeur

// Mode démo : tant que c'est "true", la connexion est simulée et aucune requête n'est envoyée.
// Passe à "false" quand ton serveur est prêt, et adapte l'adresse ci-dessous.
var DEMO = true;
var LOGIN_ENDPOINT = "/api/auth/login";
var AFTER_LOGIN = "index.html"; // page affichée après la connexion

var form = document.getElementById("loginForm");
var phone = document.getElementById("phone");
var password = document.getElementById("password");
var alertBox = document.getElementById("formAlert");
var submitBtn = document.getElementById("submitBtn");

Auth.bindPhone(phone);
Auth.bindPasswordToggle(document.getElementById("pwToggle"), password);

// "Mot de passe oublié" : message WhatsApp prérempli pour l'équipe
document.getElementById("forgot").addEventListener("click", function () {
  var msg = "Bonjour, j'ai oublié mon mot de passe Campus Space.";
  if (Auth.isPhone(phone.value)) msg += " Mon numéro : +225 " + phone.value;
  this.href = "https://wa.me/" + Auth.SUPPORT + "?text=" + encodeURIComponent(msg);
});

function validate() {
  var firstInvalid = null;
  Auth.clearError("phone");
  Auth.clearError("password");

  if (!Auth.isPhone(phone.value)) {
    Auth.setError("phone", "Entre ton numéro à 10 chiffres, par exemple 07 00 00 00 00.");
    firstInvalid = firstInvalid || phone;
  }
  if (password.value === "") {
    Auth.setError("password", "Entre ton mot de passe.");
    firstInvalid = firstInvalid || password;
  }
  if (firstInvalid) firstInvalid.focus();
  return !firstInvalid;
}

async function login(data) {
  if (DEMO) {
    await Auth.wait(800);
    return;
  }
  var res = await fetch(LOGIN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include"
  });
  if (res.status === 401) throw new Error("Numéro ou mot de passe incorrect.");
  if (!res.ok) throw new Error("Une erreur est survenue. Réessaie dans un instant.");
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  Auth.hideAlert(alertBox);
  if (!validate()) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "Connexion en cours…";
  try {
    await login({ phone: "+225" + Auth.digits(phone.value), password: password.value });
    window.location.href = AFTER_LOGIN;
  } catch (err) {
    var offline = err instanceof TypeError;
    Auth.showAlert(alertBox, offline ? "Connexion impossible. Vérifie ton réseau et réessaie." : err.message);
    submitBtn.disabled = false;
    submitBtn.textContent = "Me connecter";
  }
});

// Efface l'erreur d'un champ dès qu'on le modifie
phone.addEventListener("input", function () { Auth.clearError("phone"); });
password.addEventListener("input", function () { Auth.clearError("password"); });
