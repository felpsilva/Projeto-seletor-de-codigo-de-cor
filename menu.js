const hamburger = document.getElementById("hamburger");
const navMenu = document.querySelector(".menu");
const header = document.querySelector("header");

document.addEventListener("click", function(event) {
    if (!navMenu.contains(event.target) && !hamburger.contains(event.target)) {
        hamburger.classList.remove("active");
        navMenu.classList.remove("menu-active");
        header.classList.remove("header-active");
    }
});

window.addEventListener("resize", function() {
    if (window.innerWidth > 998) {
        hamburger.classList.remove("active");
        navMenu.classList.remove("menu-active");
        header.classList.remove("header-active");
    }
});

hamburger.addEventListener("click", function() {
  this.classList.toggle("active");
  navMenu.classList.toggle("menu-active");
  header.classList.toggle("header-active");
});