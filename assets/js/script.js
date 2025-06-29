"use strict";

/**
 * Add event on element
 */
const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
};

/**
 * Navbar toggle
 */
const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navLinks = document.querySelectorAll("[data-nav-link]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  document.body.classList.toggle("nav-active");
};

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  document.body.classList.remove("nav-active");
};

addEventOnElem(navLinks, "click", closeNavbar);

/**
 * Header & back top btn active
 */
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});

/**
 * Calorie Calculator
 */
const updateCalorieCalculator = function () {
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const age = parseInt(document.getElementById("calc-age").value, 10);
  const height = parseInt(document.getElementById("calc-height").value, 10);
  const weight = parseInt(document.getElementById("calc-weight").value, 10);
  const walking = parseInt(document.getElementById("calc-walking").value, 10);
  const cardio = parseInt(document.getElementById("calc-cardio").value, 10);

  // Update label values
  document.getElementById("calc-age_value").textContent = `${age} years`;
  document.getElementById("calc-height_value").textContent = `${height} cm`;
  document.getElementById("calc-weight_value").textContent = `${weight} kg`;
  document.getElementById(
    "calc-walking_value"
  ).textContent = `${walking} hours/week`;
  document.getElementById(
    "calc-cardio_value"
  ).textContent = `${cardio} hour/week`;

  // Mifflin-St Jeor equation for BMR
  let bmr =
    10 * weight + 6.25 * height - 5 * age + (gender === "male" ? 5 : -161);

  // Adjust BMR for activity (base activity factor of 1.2 for sedentary)
  bmr = bmr * 1.2;

  // Add calories from walking (0.03 kcal/kg/min) and cardio (0.07 kcal/kg/min)
  bmr += (walking * 60 * ((0.03 * weight * 1) / 0.45)) / 7;
  bmr += (cardio * 60 * ((0.07 * weight * 1) / 0.45)) / 7;
  bmr = Math.floor(bmr);

  // Calculate targets
  const targetGainWeight = Math.round((bmr + 300) / 100) * 100;
  const targetMaintain = Math.round(bmr / 100) * 100;
  const targetLoseWeight = Math.round((bmr - 500) / 100) * 100;

  document.getElementById("calc-target-gain").textContent = targetGainWeight;
  document.getElementById("calc-target-maintain").textContent = targetMaintain;
  document.getElementById("calc-target-lose").textContent = targetLoseWeight;
};

const resetForm = function () {
  document.getElementById("calc-gender-male").checked = true;
  document.getElementById("calc-age").value = 25;
  document.getElementById("calc-height").value = 180;
  document.getElementById("calc-weight").value = 80;
  document.getElementById("calc-walking").value = 2;
  document.getElementById("calc-cardio").value = 1;
  updateCalorieCalculator();
};

// Add event listeners for calorie calculator
const inputs = document.querySelectorAll(".calorie-form input");
addEventOnElem(inputs, "input", updateCalorieCalculator);
addEventOnElem(inputs, "change", updateCalorieCalculator);

document.getElementById("calorie-form").addEventListener("submit", (e) => {
  e.preventDefault();
  updateCalorieCalculator();
  document.getElementById("results").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("reset-form").addEventListener("click", resetForm);

// Initial calculation
updateCalorieCalculator();

/**
 * Contact page
 */
const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Hide form and show success message
    contactForm.style.display = "none";
    formMessage.style.display = "block";

    // Reset form
    contactForm.reset();

    // Scroll to message
    formMessage.scrollIntoView({ behavior: "smooth" });
  });
}
// Active link functionality
document.addEventListener("DOMContentLoaded", function () {
  const navbarLinks = document.querySelectorAll(".navbar-link");

  navbarLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Remove active class from all links
      navbarLinks.forEach((item) => {
        item.classList.remove("active");
      });

      // Add active class to clicked link
      this.classList.add("active");

      // For mobile menu, close it after clicking a link
      const navbar = document.querySelector(".navbar");
      navbar.classList.remove("active");
    });
  });

  // Highlight current section in navbar
  const sections = document.querySelectorAll("section");

  window.addEventListener("scroll", function () {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (pageYOffset >= sectionTop - 300) {
        current = section.getAttribute("id");
      }
    });

    navbarLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
});
