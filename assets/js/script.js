// Liens de commande avec le nom de l'article et le prix
document.querySelectorAll(".ad").forEach(function (ad) {
  var title = ad.querySelector("h3").textContent.trim();
  var price = ad.querySelector(".ad-price").textContent.replace(/\u00a0/g, " ").trim();
  var msg = "Bonjour, je suis intéressé(e) par : " + title + " (" + price + "). C'est encore disponible ?";
  var a = ad.querySelector(".ad-cta");
  a.href = "https://wa.me/" + ad.dataset.wa + "?text=" + encodeURIComponent(msg);
  a.target = "_blank";
  a.rel = "noopener";
});

// Menu mobile
var menuBtn = document.getElementById("menuBtn");
var nav = document.getElementById("nav");
menuBtn.addEventListener("click", function () {
  var open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.textContent = open ? "Fermer" : "Menu";
});
nav.querySelectorAll("a").forEach(function (a) {
  a.addEventListener("click", function () {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.textContent = "Menu";
  });
});

// Filtre par catégorie
var chips = document.querySelectorAll(".chip");
var ads = document.querySelectorAll(".ad");
var countEl = document.getElementById("adCount");
var emptyEl = document.getElementById("empty");

function applyFilter(cat) {
  var n = 0;
  ads.forEach(function (ad) {
    var show = cat === "tout" || ad.dataset.cat === cat;
    ad.hidden = !show;
    if (show) n++;
  });
  chips.forEach(function (c) { c.setAttribute("aria-pressed", c.dataset.cat === cat); });
  countEl.textContent = n === 0 ? "" : n + (n > 1 ? " annonces" : " annonce");
  emptyEl.hidden = n !== 0;
}
chips.forEach(function (c) {
  c.addEventListener("click", function () { applyFilter(c.dataset.cat); });
});
applyFilter("tout");
