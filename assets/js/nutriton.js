/**
 * Navigation Menu Toggler
 */
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navbar = document.querySelector("[data-nav=navbar]");
const toggleNav = () => navbar.classList.toggle("active");
navTogglers.forEach(toggler => toggler.addEventListener("click", toggleNav));

/**
 * Header Sticky & Back Top Button
 */
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");
window.addEventListener("scroll", () => {
  header.classList[window.scrollY > 50 ? "add" : "remove"]("active");
  backTopBtn.classList[window.scrollY > 50 ? "add" : "remove"]("active");
});

/**
 * Nutrition Search Functionality
 */
const searchForm = document.querySelector("#nutrition-search-form");
const searchInput = document.querySelector("#search-query");
const nutritionList = document.querySelector("#nutrition-list");

const API_SEARCH_URL = "https://forkify-api.herokuapp.com/api/search?q=";
const API_RECIPE_URL = "https://forkify-api.herokuapp.com/api/get?rId=";

const renderRecipeCard = (recipe, ingredients) => {
  const card = document.createElement("li");
  card.className = "scrollbar-item";
  const truncatedTitle = recipe.title.length > 30 ? recipe.title.slice(0, 27) + "..." : recipe.title;
  const ingredientsList = ingredients.length > 0
    ? `<ul>${ingredients.slice(0, 5).map(ing => `<li>${ing.length > 25 ? ing.slice(0, 22) + "..." : ing}</li>`).join("")}</ul>`
    : `<p>No ingredients available</p>`;
  card.innerHTML = `
    <div class="nutrition-card">
      <figure class="card-banner img-holder" style="--width: 320; --height: 200">
        <img src="${recipe.image_url}" width="320" height="200" loading="lazy" alt="${truncatedTitle}" class="img-cover" />
      </figure>
      <div class="card-content">
        <h3 class="h3">
          <a href="${recipe.source_url}" target="_blank" class="card-title">${truncatedTitle}</a>
        </h3>
        <p class="card-meta">Publisher: ${recipe.publisher}</p>
        <p class="card-details">Recipe ID: ${recipe.recipe_id}</p>
        <div class="card-ingredients">
          <strong>Ingredients:</strong>
          ${ingredientsList}
        </div>
      </div>
    </div>
  `;
  return card;
};

const fetchRecipeDetails = async recipeId => {
  try {
    const response = await fetch(`${API_RECIPE_URL}${recipeId}`);
    if (!response.ok) throw new Error("Failed to fetch recipe details");
    const data = await response.json();
    return data.recipe.ingredients || [];
  } catch (error) {
    console.error(`Error fetching details for recipe ${recipeId}:`, error);
    return [];
  }
};

const fetchRecipes = async query => {
  try {
    nutritionList.innerHTML = '<p>Loading recipes...</p>';
    const response = await fetch(`${API_SEARCH_URL}${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error("Failed to fetch recipes");
    const data = await response.json();
    nutritionList.innerHTML = "";
    if (data.recipes.length === 0) {
      nutritionList.innerHTML = '<p>No recipes found. Try another search term.</p>';
      return;
    }
    const recipes = data.recipes.slice(0, 12);
    for (const recipe of recipes) {
      const ingredients = await fetchRecipeDetails(recipe.recipe_id);
      nutritionList.appendChild(renderRecipeCard(recipe, ingredients));
    }
  } catch (error) {
    console.error("Error fetching recipes:", error);
    nutritionList.innerHTML = '<p>Sorry, something went wrong. Please try again later.</p>';
  }
};

if (searchForm) {
  searchForm.addEventListener("submit", e => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) fetchRecipes(query);
  });

  // Load default recipes on page load
  fetchRecipes("healthy");
}