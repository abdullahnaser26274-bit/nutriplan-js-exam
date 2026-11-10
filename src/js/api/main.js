
/**
 * NutriPlan - Main Entry Point
 * 
 * This is the main entry point for the application.
 * Import your modules and initialize the app here.
 */


// ---------------------------------
import { getMeals, analyzeMeal, getCategories, getMealsByCategory, getAreas, getMealsByArea, getMealsByIngredient, getMealsByName, getProductByBarcode, getProductCategories, getProductsByCategory, getProductsByName} from "./mealdb.js";
// ---------------VARIABLES-----------------

let recipesGrid = document.getElementById("recipes-grid");
let mealDetails = document.getElementById("meal-details");
let allRecipesSection = document.getElementById("all-recipes-section");
let categoriesSection = document.getElementById("meal-categories-section");
let searchSection = document.getElementById("search-filters-section");
let backButton = document.getElementById("back-to-meals-btn");
let detailsImage = document.getElementById("details-image");
let detailsTitle = document.getElementById("details-title");
let detailsCuisine = document.getElementById("details-cuisine");
let detailsIngredient = document.getElementById("details-ingredient");
let heroCalories = document.getElementById("hero-calories");
let instructionsList = document.getElementById("instructions-list");
let ingredientsLength = document.getElementById("ingredientsLength");
let ingredientsList = document.getElementById("ingredients-list");
let youtubeVideo = document.getElementById("youtube-video");
//                        ...
let nutritionCalories = document.getElementById("nutrition-calories");
let nutritionTotalCalories = document.getElementById("nutrition-total-calories");
let nutritionProtein = document.getElementById("nutrition-protein");
let proteinBar = document.getElementById("protein-bar");
let nutritionCarbs = document.getElementById("nutrition-carbs");
let carbsBar = document.getElementById("carbs-bar");
let nutritionFat = document.getElementById("nutrition-fat");
let fatBar = document.getElementById("fat-bar");
let nutritionFiber = document.getElementById("nutrition-fiber");
let fiberBar = document.getElementById("fiber-bar");
let nutritionSugar = document.getElementById("nutrition-sugar");
let sugarBar = document.getElementById("sugar-bar");
let nutritionLoading = document.getElementById("nutrition-loading");
let nutritionFactsContainer = document.getElementById("nutrition-facts-container");
let nutritionSaturatedFat = document.getElementById("nutrition-saturated-fat");
let saturatedFatBar = document.getElementById("saturated-fat-bar");
let categoriesGrid = document.getElementById("categories-grid");
let recipesCount = document.getElementById("recipes-count");
let areasFilter = document.getElementById("areas-filter");
let appLoadingOverlay = document.getElementById("app-loading-overlay");
let gridViewBtn = document.getElementById("grid-view-btn");
let listViewBtn = document.getElementById("list-view-btn");
let navLinks = document.querySelectorAll(".nav-link");
let productsSection = document.getElementById("products-section");
let foodlogSection = document.getElementById("foodlog-section");
let currentProductsPage = 1;
let productsPerPage = 24;
let currentDisplayedProducts = [];
let logMealBtn = document.getElementById("log-meal-btn");
let pageTitle = document.getElementById("page-title");
let pageDescription = document.getElementById("page-description");
let mealsSection = document.getElementById("meals-section");
let mealDetailsSection = document.getElementById("meal-details");
let currentMeal = null;
navLinks.forEach(function(link) {
    link.addEventListener("click", function(e) {
        e.preventDefault();
        let sectionId = link.getAttribute("data-section");
        mealsSection.classList.add("hidden");
        productsSection.classList.add("hidden");
        foodlogSection.classList.add("hidden");
        mealDetailsSection.classList.add("hidden");
        document.getElementById(sectionId).classList.remove("hidden");
        //-----------------NAVIGATION-----------------
        
        navLinks.forEach(function(nav) {
            nav.classList.remove("bg-emerald-50", "text-emerald-700");
            nav.classList.add("text-gray-600");
        });
        link.classList.remove("text-gray-600");
        link.classList.add("bg-emerald-50", "text-emerald-700");
        if (sectionId === "meals-section") {
            allRecipesSection.classList.remove("hidden");
categoriesSection.classList.remove("hidden");
searchSection.classList.remove("hidden");
            pageTitle.textContent = "Meals & Recipes";
            pageDescription.textContent = "Discover delicious and nutritious recipes tailored for you";
        } else if (sectionId === "products-section") {
            pageTitle.textContent = "Product Scanner";
            pageDescription.textContent = "Search and explore packaged food products";
        } else if (sectionId === "foodlog-section") {
            pageTitle.textContent = "Food Log";
            pageDescription.textContent = "Track your daily nutrition and food intake";
        calculateFoodLogTotals();
        displayFoodLogItems();
        displayWeeklyOverview();
        }
    });
});



// ------------------PRODUCT SCANNER------------------
let productSearchInput = document.getElementById("product-search-input");
let searchProductBtn = document.getElementById("search-product-btn");
let barcodeInput = document.getElementById("barcode-input");
let lookupBarcodeBtn = document.getElementById("lookup-barcode-btn");
let productCategories = document.getElementById("product-categories");
let productsGrid = document.getElementById("products-grid");
let productsCount = document.getElementById("products-count");
let allProducts = [];
let nutriScoreFilters = document.querySelectorAll(".nutri-score-filter");
// -------------------Food Log--------------------
let caloriesText = document.getElementById("calories-text");
let caloriesProgress = document.getElementById("calories-progress");
let proteinText = document.getElementById("protein-text");
let proteinProgress = document.getElementById("protein-progress");
let carbsText = document.getElementById("carbs-text");
let carbsProgress = document.getElementById("carbs-progress");
let fatText = document.getElementById("fat-text");
let fatProgress = document.getElementById("fat-progress");
let foodlogDate = document.getElementById("foodlog-date");
let foodLogItems = JSON.parse(localStorage.getItem("foodLogItems")) || [];
let favoriteMeals = JSON.parse(localStorage.getItem("favoriteMeals")) || [];
let mealLogModal = document.getElementById("meal-log-modal");
let modalMealImage = document.getElementById("modal-meal-image");
let modalMealName = document.getElementById("modal-meal-name");
let servingsCount = document.getElementById("servings-count");
let decreaseServings = document.getElementById("decrease-servings");
let increaseServings = document.getElementById("increase-servings");
let modalCalories = document.getElementById("modal-calories");
let modalProtein = document.getElementById("modal-protein");
let modalCarbs = document.getElementById("modal-carbs");
let modalFat = document.getElementById("modal-fat");
let cancelLogMeal = document.getElementById("cancel-log-meal");
let confirmLogMeal = document.getElementById("confirm-log-meal");
let loggedItemsList = document.getElementById("logged-items-list");
let currentMealNutrition = null;
let currentServings = 1;
let clearFoodLog = document.getElementById("clear-foodlog");
let loggedItemsCount = document.getElementById("logged-items-count");
let weeklyChart = document.getElementById("weekly-chart");


foodlogDate.textContent = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric"
});
function updateNutritionProgress(calories, protein, carbs, fat) {
    caloriesText.textContent = Math.round(calories) + " / 2000 kcal";
    proteinText.textContent = protein.toFixed(1) + " / 50 g";
    carbsText.textContent = carbs.toFixed(1) + " / 250 g";
    fatText.textContent = fat.toFixed(1) + " / 65 g";
    caloriesProgress.style.width = Math.min(calories / 2000 * 100, 100) + "%";
    proteinProgress.style.width = Math.min(protein / 50 * 100, 100) + "%";
    carbsProgress.style.width = Math.min(carbs / 250 * 100, 100) + "%";
    fatProgress.style.width = Math.min(fat / 65 * 100, 100) + "%";
}
function updateModalNutrition() {
    modalCalories.textContent = Math.round(currentMealNutrition.calories * currentServings);
    modalProtein.textContent = (currentMealNutrition.protein * currentServings).toFixed(1) + "g";
    modalCarbs.textContent = (currentMealNutrition.carbs * currentServings).toFixed(1) + "g";
    modalFat.textContent = (currentMealNutrition.fat * currentServings).toFixed(1) + "g";
}
increaseServings.addEventListener("click", function() {
        currentServings = currentServings + 0.5;
        servingsCount.textContent = currentServings;
        updateModalNutrition();
});
decreaseServings.addEventListener("click", function() {
    if (currentServings > 0.5) {
        currentServings = currentServings - 0.5;
        servingsCount.textContent = currentServings;
        updateModalNutrition();
    }
});
// --Cancel button---
cancelLogMeal.addEventListener("click", function() {
    mealLogModal.classList.add("hidden");
});

// --Click outside the modal--
mealLogModal.addEventListener("click", function(event) {
    if (event.target === mealLogModal) {
        mealLogModal.classList.add("hidden");
    }
});
// -------Confirm Log Meal-----
confirmLogMeal.addEventListener("click", function() {
   let foodItem = {
    name: modalMealName.textContent,
    image: modalMealImage.src,
    type: "Recipe",
    date: new Date().toLocaleDateString("en-CA"),
    time: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
    }),
    servings: currentServings,
    calories: Math.round(currentMealNutrition.calories * currentServings),
    protein: currentMealNutrition.protein * currentServings,
    carbs: currentMealNutrition.carbs * currentServings,
    fat: currentMealNutrition.fat * currentServings
};
    foodLogItems.push(foodItem);
    localStorage.setItem("foodLogItems", JSON.stringify(foodLogItems));
    calculateFoodLogTotals();
    displayFoodLogItems();
    displayWeeklyOverview();
    mealLogModal.classList.add("hidden");
    Swal.fire({
    icon: "success",
    title: "Meal Logged Successfully!",
    text: "Your meal has been added to your food log.",
    confirmButtonText: "Great!",
    confirmButtonColor: "#4F46E5"
});


});
// updateNutritionProgress(1000, 25, 125, 30);
function calculateFoodLogTotals() {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let today = new Date().toLocaleDateString("en-CA");
    for (let i = 0; i < foodLogItems.length; i++) {
        if (foodLogItems[i].date === today) {
            totalCalories += foodLogItems[i].calories;
            totalProtein += foodLogItems[i].protein;
            totalCarbs += foodLogItems[i].carbs;
            totalFat += foodLogItems[i].fat;
        }
    }
    updateNutritionProgress(totalCalories, totalProtein, totalCarbs, totalFat);
}
function displayFoodLogItems() {
    loggedItemsList.innerHTML = "";
    let today = new Date().toLocaleDateString("en-CA");
let todayItems = foodLogItems.filter(function(item) {
    return item.date === today;
});
    loggedItemsCount.textContent = "Logged Items (" + todayItems.length + ")";
clearFoodLog.style.display = todayItems.length > 0 ? "block" : "none";
if (todayItems.length === 0) {
    loggedItemsList.innerHTML = `
        <div class="text-center py-12">
            <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-utensils text-3xl text-gray-300"></i>
            </div>
            <p class="text-gray-500 font-medium mb-2">No food logged today</p>
            <p class="text-gray-400 text-sm mb-4">
                Start tracking your nutrition by logging meals or scanning products
            </p>
            <div class="flex justify-center gap-3">
                <button id="browse-recipes-btn"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all">
                    <i class="fa-solid fa-plus"></i>
                    Browse Recipes
                </button>
                <button id="scan-product-btn"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                    <i class="fa-solid fa-barcode"></i>
                    Scan Product
                </button>
            </div>
        </div>
    `;
    document.getElementById("browse-recipes-btn").addEventListener("click", function() {
        document.querySelector('[data-section="meals-section"]').click();
    });
    document.getElementById("scan-product-btn").addEventListener("click", function() {
        document.querySelector('[data-section="products-section"]').click();
    });
    return;
}
    todayItems.forEach(function(item)  {
         let index = foodLogItems.indexOf(item);
        let div = document.createElement("div");
        div.className = "flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all";
        div.innerHTML = `
            <div class="flex items-center gap-4">
                <img src="${item.image}" alt="${item.name}" class="w-14 h-14 rounded-xl object-cover">
                <div>
                    <p class="font-semibold text-gray-900">${item.name}</p>
                    <p class="text-sm text-gray-500">
                        ${item.servings} ${item.servings === 1 ? "serving" : "servings"}
                        <span class="mx-1">•</span>
                        <span class="text-emerald-600">${item.type}</span>
                    </p>
                    <p class="text-xs text-gray-400 mt-1">${item.time}</p>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <div class="text-right">
                    <p class="text-lg font-bold text-emerald-600">${item.calories}</p>
                    <p class="text-xs text-gray-500">kcal</p>
                </div>
                <div class="hidden md:flex gap-2 text-xs text-gray-500">
                    <span class="px-2 py-1 bg-blue-50 rounded">${Math.round(item.protein)}g P</span>
                    <span class="px-2 py-1 bg-amber-50 rounded">${Math.round(item.carbs)}g C</span>
                    <span class="px-2 py-1 bg-purple-50 rounded">${Math.round(item.fat)}g F</span>
                </div>
                <button class="remove-foodlog-item text-gray-400 hover:text-red-500 transition-all p-2" data-index="${index}">
    <i class="fa-solid fa-trash-can"></i>
</button>
            </div>
        `;
        loggedItemsList.appendChild(div);
    });
    let deleteButtons = document.querySelectorAll(".remove-foodlog-item");
deleteButtons.forEach(function(button) {
    
    button.addEventListener("click", function() {
        let index = button.getAttribute("data-index");
        foodLogItems.splice(index, 1);
        localStorage.setItem("foodLogItems", JSON.stringify(foodLogItems));
        calculateFoodLogTotals();
        displayFoodLogItems();
        displayWeeklyOverview();
    });
});
}
function displayWeeklyOverview() {
    let today = new Date();
    let day = today.getDay();
    let diff = day === 0 ? -6 : 1 - day;
    let monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    let weeklyData = [];
    for (let i = 0; i < 7; i++) {
        let currentDate = new Date(monday);
        currentDate.setDate(monday.getDate() + i);
        let dateKey = currentDate.toLocaleDateString("en-CA");
        let dayItems = foodLogItems.filter(function(item) {
            return item.date === dateKey;
        });
        let totalCalories = 0;
        dayItems.forEach(function(item) {
            totalCalories += item.calories;
        });
        weeklyData.push({
            date: dateKey,
            day: currentDate.toLocaleDateString("en-US", {
                weekday: "short"
            }),
            dayNumber: currentDate.getDate(),
            calories: totalCalories,
            items: dayItems.length
        });
    }
    let totalCalories = 0;
let totalItems = 0;
let daysOnGoal = 0;

weeklyData.forEach(function(day) {
    totalCalories += day.calories;
    totalItems += day.items;

    if (day.items > 0) {
        daysOnGoal++;
    }
});

document.getElementById("weekly-average").textContent =
    Math.round(totalCalories / 7) + " kcal";

document.getElementById("weekly-total-items").textContent =
    totalItems + " items";

document.getElementById("weekly-days-on-goal").textContent =
    daysOnGoal + " / 7";
    weeklyChart.innerHTML = "";
weeklyData.forEach(function(day) {
    let div = document.createElement("div");
    div.className = "text-center " +
        (day.date === new Date().toLocaleDateString("en-CA")
            ? "bg-indigo-100 rounded-xl"
            : "");
    div.innerHTML = `
        <p class="text-xs text-gray-500 mb-1">${day.day}</p>
        <p class="text-sm font-medium text-gray-900">${day.dayNumber}</p>
        <div class="mt-2 ${day.calories > 0 ? "text-emerald-600" : "text-gray-300"}">
            <p class="text-lg font-bold">${Math.round(day.calories)}</p>
            <p class="text-xs">kcal</p>
        </div>
        ${day.items > 0 ? `<p class="text-xs text-gray-400 mt-1">${day.items} items</p>` : ""}
    `;
    weeklyChart.appendChild(div);
});

}
clearFoodLog.addEventListener("click", function() {
    Swal.fire({
        icon: "warning",
        title: "Clear Food Log?",
        text: "Are you sure you want to remove all logged meals?",
        showCancelButton: true,
        confirmButtonText: "Yes, clear it!",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#DC2626"
    }).then(function(result) {
        if (result.isConfirmed) {
            let today = new Date().toLocaleDateString("en-CA");
foodLogItems = foodLogItems.filter(function(item) {
    return item.date !== today;
});
            localStorage.setItem("foodLogItems", JSON.stringify(foodLogItems));
            calculateFoodLogTotals();
            displayFoodLogItems();
            displayWeeklyOverview();
            
        }
    });
});
calculateFoodLogTotals();
displayFoodLogItems();
// ------------------PRODUCT CATEGORIES------------------
// EL ICONS {random shwaya}
let icons = {
    "snacks": "fa-cookie-bite",
    "beverages": "fa-bottle-water",
    "dairies": "fa-glass-water",
    "cheeses": "fa-cheese",
    "yogurts": "fa-bowl-food",
    "chocolates": "fa-candy-cane",
    "biscuits": "fa-cookie",
    "ice-creams": "fa-ice-cream",
    "breakfast-cereals": "fa-wheat-awn",
    "breads": "fa-bread-slice",
    "waters": "fa-droplet",
    "sodas": "fa-glass-water",
    "coffees": "fa-mug-hot",
    "teas": "fa-mug-saucer",
    "fruits": "fa-apple-whole",
    "vegetables": "fa-carrot",
    "meats": "fa-drumstick-bite",
    "fishes": "fa-fish",
    "plant-based-foods": "fa-leaf",
    "chips-and-fries": "fa-french-fries",
    "sauces": "fa-bottle-droplet",
    "spreads": "fa-jar",
    "pastas": "fa-bowl-food",
    "desserts": "fa-cake-candles"
};

getProductCategories().then(function(data) {
     console.table(data.map(function(category) {
        return {
            name: category.name,
            id: category.id
        };
    }));
     data.forEach(function(category) {
        let button = document.createElement("button");
        button.className = "product-category-btn " + category.id;
        let icon = document.createElement("i");
        icon.className = "fa-solid " + icons[category.id] + " mr-2";
        button.appendChild(icon);
        button.append(category.name);
        button.dataset.category = category.id;
        productCategories.appendChild(button);
    });
});
function displayProducts(products, page) {
    currentDisplayedProducts = products;
    if (page === undefined) {
        currentProductsPage = 1;
    } else {
        currentProductsPage = page;
    }
    productsGrid.innerHTML = "";
    let startIndex = (currentProductsPage - 1) * productsPerPage;
    let endIndex = startIndex + productsPerPage;
    let productsToDisplay = products.slice(startIndex, endIndex);
    productsToDisplay.forEach(function(product) {
        let card = document.createElement("div");
        card.className = "product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group";
        card.dataset.barcode = product.barcode;
        let imgContainer = document.createElement("div");
        imgContainer.className = "relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden";
        let img = document.createElement("img");
        img.className = "w-full h-full object-contain group-hover:scale-110 transition-transform duration-300";
        img.src = product.image;
        img.alt = product.name;
        img.loading = "lazy";
        imgContainer.appendChild(img);
       
        let scoreBadge = document.createElement("div");
        scoreBadge.className = "absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded uppercase";
        scoreBadge.textContent = "Nutri-Score " + (product.nutritionGrade || "N/A");
        imgContainer.appendChild(scoreBadge);
        card.appendChild(imgContainer);
        let content = document.createElement("div");
        content.className = "p-4";
        let title = document.createElement("h3");
        title.className = "font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors";
        title.textContent = product.name;
        content.appendChild(title);
        let calories = document.createElement("p");
        calories.className = "text-xs text-gray-500 mb-3";
        calories.innerHTML = '<i class="fa-solid fa-fire mr-1"></i>' + product.nutrients.calories + " kcal/100g";
        content.appendChild(calories);
        let nutrition = document.createElement("div");
        nutrition.className = "grid grid-cols-4 gap-1 text-center";
        let nutrients = [
            { name: "Protein", value: product.nutrients.protein, color: "emerald" },
            { name: "Carbs", value: product.nutrients.carbs, color: "blue" },
            { name: "Fat", value: product.nutrients.fat, color: "purple" }
        ];
        nutrients.forEach(function(item) {
            let box = document.createElement("div");
            box.className = "bg-" + item.color + "-50 rounded p-1.5";
            let value = document.createElement("p");
            value.className = "text-xs font-bold text-" + item.color + "-700";
            value.textContent = item.value + "g";
            let label = document.createElement("p");
            label.className = "text-[10px] text-gray-500";
            label.textContent = item.name;
            box.appendChild(value);
            box.appendChild(label);
            nutrition.appendChild(box);
        });
        content.appendChild(nutrition);
        card.appendChild(content);
        productsGrid.appendChild(card);
    });
    if (products.length === 0) {
        productsCount.textContent = "Showing 0 products";
    } else {
        productsCount.textContent = "Showing " +
            (startIndex + 1) + " - " +
            Math.min(endIndex, products.length) +
            " of " + products.length + " products";
    }
    // ---------------- PAGINATION ----------------
    let pagination = document.getElementById("product-pagination");
    if (!pagination) {
        pagination = document.createElement("div");
        pagination.id = "product-pagination";
        pagination.className = "flex justify-center items-center gap-4 mt-8";
        productsGrid.insertAdjacentElement("afterend", pagination);
    }
    pagination.innerHTML = "";
    let totalPages = Math.ceil(products.length / productsPerPage);
    if (totalPages > 1) {
        let previousBtn = document.createElement("button");
        previousBtn.textContent = "Previous";
        previousBtn.className = "px-4 py-2 rounded bg-gray-200";
        previousBtn.disabled = currentProductsPage === 1;
        previousBtn.addEventListener("click", function() {
            displayProducts(currentDisplayedProducts, currentProductsPage - 1);
        });
        let pageInfo = document.createElement("span");
        pageInfo.textContent = "Page " + currentProductsPage + " of " + totalPages;
        let nextBtn = document.createElement("button");
        nextBtn.textContent = "Next";
        nextBtn.className = "px-4 py-2 rounded bg-emerald-600 text-white";
        nextBtn.disabled = currentProductsPage === totalPages;
        nextBtn.addEventListener("click", function() {
            displayProducts(currentDisplayedProducts, currentProductsPage + 1);
        });
        pagination.appendChild(previousBtn);
        pagination.appendChild(pageInfo);
        pagination.appendChild(nextBtn);
    }
}
productCategories.addEventListener("click", function(event) {
    let selectedButton = event.target.closest("button");
    if (!selectedButton) {
        return;
    }
    let selectedCategory = selectedButton.dataset.category;
    getProductsByCategory(selectedCategory).then(function(products) {
        allProducts = products;
        displayProducts(products);
    }).catch(function(error) {
        console.log("Category products error:", error);
    });
});
//-----------------PRODUCT SEARCH-----------------
searchProductBtn.addEventListener("click", function() {
    let searchValue = productSearchInput.value.trim();
    if (searchValue === "") {
        return;
    }
    getProductsByName(searchValue).then(function(products) {
        allProducts = products;
        console.log("Category products:", products);
        displayProducts(products);
    }).catch(function(error) {
        console.log("Product search error:", error);
    });
});
//-----------------BARCODE SEARCH-----------------
lookupBarcodeBtn.addEventListener("click", function() {
    let barcodeValue = barcodeInput.value.trim();
    if (barcodeValue === "") {
        return;
    }
    getProductByBarcode(barcodeValue).then(function(product) {
        allProducts = [product];
        displayProducts([product]);
    }).catch(function(error) {
        console.log("Barcode search error:", error);
    });
});

// --------------Nutri-Score-------------------
nutriScoreFilters.forEach(function(button) {
    button.addEventListener("click", function() {
        let selectedGrade = button.dataset.grade;
        console.log(allProducts.map(function(product) {
            return {
        name: product.name,
        grade: product.nutritionGrade
    };
        }));

        if (selectedGrade === "") {
            displayProducts(allProducts);
            return;
        }
        let filteredProducts = allProducts.filter(function(product) {
            return product.nutritionGrade &&
                product.nutritionGrade.toLowerCase() === selectedGrade;
        });
        console.log("Selected Grade:", selectedGrade);
console.log("Filtered Products:", filteredProducts);
        displayProducts(filteredProducts);
    });
});


// -----------------VIEW TOGGLE-----------------
listViewBtn.addEventListener("click", function() {
    recipesGrid.classList.remove("grid-cols-4");
    recipesGrid.classList.add("grid-cols-2");
       gridViewBtn.classList.remove("bg-white", "rounded-md", "shadow-sm");
    listViewBtn.classList.add("bg-white", "rounded-md", "shadow-sm");
});
gridViewBtn.addEventListener("click", function() {
    recipesGrid.classList.remove("grid-cols-2");
    recipesGrid.classList.add("grid-cols-4");
      listViewBtn.classList.remove("bg-white", "rounded-md", "shadow-sm");
    gridViewBtn.classList.add("bg-white", "rounded-md", "shadow-sm");
});
// ----------------Search Input-----------------
let searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", function() {
let searchValue = searchInput.value.toLowerCase().trim();
    recipesGrid.innerHTML = "";
    if (searchValue === "") {
        if (searchValue === "") {
    return getMeals().then(function(results) {
        recipesCount.textContent = "Showing " + results.length + " recipes";
        results.forEach(function(meal) {
            let recipe = new RecipeCard(meal);
            recipe.render();
        });
    }).catch(function(error) {
        console.log("Reload meals error:", error);
    });
}
    }

    Promise.all([
        getMealsByName(searchValue),
        getMealsByCategory(searchValue),
        getMealsByIngredient(searchValue)
        
    ]).then(function(results) {

        let allMeals = results[0].concat(results[1], results[2]);

        let uniqueMeals = [];

        allMeals.forEach(function(meal) {

            let exists = uniqueMeals.some(function(item) {
                return item.id === meal.id;
            });

            if (!exists) {
                uniqueMeals.push(meal);
            }

        });

        uniqueMeals.forEach(function(meal) {
            let recipe = new RecipeCard(meal);
            recipe.render();
        });

        recipesCount.textContent = "Showing " + uniqueMeals.length + " recipes";
        }).catch(function(error) {
    console.log("Search error:", error);
    recipesGrid.innerHTML = "<p>Search failed. Please try again.</p>";
    });

});

// ana kont 3amlh kol function lwa7dha bs 3shan a3ml el overlay b3d ma el intial function t5ls fkrt agm3hom kolhm fe promise all wa7dh fa 3shan kdh ms7t el code el 2adem 7ta fe shwayt comments mn el code el2adem elle ms7to ;'D
// w dh tb3n 5ala el API 3ndy asr3 fa project bta3y asr3 mn project bta3 7drtk m3 e7tramy tb3n >,<
// -----------------CATEGORIES-----------------
Promise.all([
    getCategories(),
    getAreas(),
    getMeals()
]).then(function(results) {
    let categories = results[0];
    let areas = results[1];
    let meals = results[2];
       categoriesGrid.innerHTML = "";
    areasFilter.innerHTML = "";
let allButton = document.createElement("button");
allButton.textContent = "All Cuisines";
allButton.className = "px-4 py-2 bg-emerald-600 text-white rounded-full font-medium text-sm whitespace-nowrap hover:bg-emerald-700 transition-all";
areasFilter.appendChild(allButton);
areas.slice(0, 10).forEach(function(area) {
    let areaButton = document.createElement("button");
    areaButton.textContent = area.name;
    areaButton.className = "px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all";
    areasFilter.appendChild(areaButton);
});
    categories.forEach(function(category) {
        let categoryCard = document.createElement("div");
        let icon = "fa-utensils";
       let cardColor = "from-emerald-50 to-teal-50";
        let borderColor = "border-emerald-200 hover:border-emerald-400";
        let iconColor = "from-emerald-400 to-green-500";
     if (category.name === "Beef") {
            icon = "fa-drumstick-bite";
         cardColor = "from-rose-50 to-red-50";
            borderColor = "border-rose-200 hover:border-rose-300";
            iconColor = "from-rose-400 to-rose-500";
        } else if (category.name === "Chicken") {
            icon = "fa-drumstick-bite";
            cardColor = "from-orange-50 to-amber-50";
            borderColor = "border-amber-200 hover:border-amber-300";
        iconColor = "from-amber-400 to-orange-500";
        } else if (category.name === "Dessert") {
            icon = "fa-cake-candles";
            cardColor = "from-pink-50 to-rose-50";
            borderColor = "border-pink-200 hover:border-pink-300";
            iconColor = "from-pink-400 to-rose-500";
      } else if (category.name === "Lamb") {
            icon = "fa-drumstick-bite";
            cardColor = "from-orange-50 to-amber-50";
            borderColor = "border-orange-200 hover:border-orange-300";
            iconColor = "from-orange-400 to-amber-500";
        } else if (category.name === "Miscellaneous") {
            icon = "fa-bowl-food";
            cardColor = "from-slate-50 to-gray-50";
            borderColor = "border-slate-200 hover:border-slate-300";
            iconColor = "from-slate-400 to-gray-500";
        } else if (category.name === "Pasta") {
            icon = "fa-bowl-food";
            cardColor = "from-yellow-50 to-amber-50";
            borderColor = "border-yellow-200 hover:border-yellow-300";
            iconColor = "from-yellow-400 to-amber-500";
        } else if (category.name === "Pork") {
            icon = "fa-bacon";
            cardColor = "from-rose-50 to-red-50";
            borderColor = "border-rose-200 hover:border-rose-300";
            iconColor = "from-rose-400 to-red-500";
        } else if (category.name === "Seafood") {
            icon = "fa-fish";
            cardColor = "from-sky-50 to-blue-50";
            borderColor = "border-blue-200 hover:border-blue-300";
            iconColor = "from-cyan-400 to-blue-500";
     } else if (category.name === "Side") {
            icon = "fa-bowl-rice";
            cardColor = "from-emerald-50 to-green-50";
            borderColor = "border-emerald-200 hover:border-emerald-300";
            iconColor = "from-emerald-400 to-green-500";
     } else if (category.name === "Starter") {
            icon = "fa-utensils";
            cardColor = "from-teal-50 to-cyan-50";
            borderColor = "border-teal-200 hover:border-teal-300";
            iconColor = "from-teal-400 to-cyan-500";
        } else if (category.name === "Vegan") {
            icon = "fa-leaf";
            cardColor = "from-green-50 to-emerald-50";
            borderColor = "border-green-200 hover:border-green-300";
            iconColor = "from-green-400 to-emerald-500";
        } else if (category.name === "Vegetarian") {
            icon = "fa-seedling";
            cardColor = "from-lime-50 to-green-50";
            borderColor = "border-lime-200 hover:border-lime-300";
            iconColor = "from-lime-400 to-green-500";
        } else if (category.name === "Breakfast") {
            icon = "fa-mug-hot";
            cardColor = "from-amber-50 to-yellow-50";
            borderColor = "border-amber-200 hover:border-amber-300";
            iconColor = "from-amber-400 to-yellow-500";
        } else if (category.name === "Goat") {
            icon = "fa-drumstick-bite";
cardColor = "from-blue-50 to-cyan-50";
borderColor = "border-blue-200 hover:border-blue-300";
iconColor = "from-blue-400 to-cyan-500";
        }

        categoryCard.className = "category-card bg-gradient-to-br " + cardColor +
            " rounded-xl p-3 border " + borderColor +
            " hover:shadow-md cursor-pointer transition-all group";
        categoryCard.innerHTML = `
         <div class="flex items-center gap-2.5">
         <div class="text-white w-9 h-9 bg-gradient-to-br ${iconColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                 <i class="fa-solid ${icon}"></i>
          </div>
                <div>
                  <h3 class="text-sm font-bold text-gray-900">${category.name}</h3>
                </div>
        </div>
        `;
        // fe el main project msh zahr el breakfast w el goat w el veiw all btn msh sha8al bs ana sha8lto fe project dh b7es eno yzhr el 2 badges dol
        categoryCard.dataset.category = category.name;
        if (category.name === "Breakfast" || category.name === "Goat") {
          categoryCard.classList.add("hidden");
        }
        categoriesGrid.appendChild(categoryCard);
    });
let viewAllButton = document.querySelector("#meal-categories-section button");
viewAllButton.addEventListener("click", function() {
    let hiddenCategories = document.querySelectorAll(".category-card.hidden");
     hiddenCategories.forEach(function(card) {
        card.classList.remove("hidden");
    });
    viewAllButton.classList.add("hidden");
});
 categoriesGrid.addEventListener("click", function(event) {
    let selectedCard = event.target.closest(".category-card");
    if (selectedCard) {
        let selectedCategory = selectedCard.dataset.category;
        recipesGrid.innerHTML = "";
        getMealsByCategory(selectedCategory).then(function(meals) {
            recipesCount.textContent = "Showing " + meals.length + " " + selectedCategory + " recipes";
            meals.forEach(function(meal) {
                let recipe = new RecipeCard(meal);
                 recipe.render();
            })
            
        }).catch(function(error) {
    console.log("Category filtering error:", error);
    recipesGrid.innerHTML = "<p>Failed to load category meals.</p>";
});
        
    }
    
})

// --------------------------AREAS FILTER-------------------------

areasFilter.addEventListener("click", function(event) {
    let selectedButton = event.target.closest("button");
    if (!selectedButton) {
      return;
    }
    let allAreaButtons = areasFilter.querySelectorAll("button");
    allAreaButtons.forEach(function(button) {
      button.classList.remove("bg-emerald-600", "text-white");
        button.classList.add("bg-gray-100", "text-gray-700");
    });
    selectedButton.classList.remove("bg-gray-100", "text-gray-700");
   selectedButton.classList.add("bg-emerald-600", "text-white");
    let selectedArea = selectedButton.textContent;
    recipesGrid.innerHTML = "";

    if (selectedArea === "All Cuisines") {
        getMeals().then(function(meals) {
            recipesCount.textContent = "Showing " + meals.length + " recipes";

            meals.forEach(function(meal) {
                let recipe = new RecipeCard(meal);
                recipe.render();
            });
        }).catch(function(error) {
            console.log("All cuisines error:", error);
            recipesGrid.innerHTML = "<p>Failed to load meals.</p>";
        });
    } else {
        getMealsByArea(selectedArea).then(function(meals) {
            recipesCount.textContent = "Showing " + meals.length + " " + selectedArea + " recipes";
            meals.forEach(function(meal) {
             let recipe = new RecipeCard(meal);
             recipe.render();
            });
        }).catch(function(error) {
            console.log("Area filtering error:", error);
            recipesGrid.innerHTML = "<p>Failed to load area meals.</p>";
        });
    }
});
// --------------------------INITIAL MEALS-------------------------
console.log(meals.length);
recipesCount.textContent = "Showing " + meals.length + " recipes";
meals.forEach(function(meal) {
    let recipe = new RecipeCard(meal);
    recipe.render();
});
}).catch(function(error) {
 console.log("Initial loading error:", error);
 recipesGrid.innerHTML = "<p>Failed to load meals. Please refresh the page.</p>";
}).finally(function() {
    appLoadingOverlay.classList.add("hidden");
});
// -----------------RECIPE CARD CLASS-----------------
class RecipeCard {
    constructor(meal) {
        this.meal = meal;
    }
    
  

render() {
    let card = document.createElement("div");
    card.className = "recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group";
    let imgContainer = document.createElement("div");
    imgContainer.className = "relative h-48 overflow-hidden";
    let img = document.createElement("img");
      img.src = this.meal.thumbnail;
    img.className = "w-full h-full object-cover group-hover:scale-110 transition-transform duration-500";
    img.alt = this.meal.name;
     img.loading = "lazy";
    imgContainer.appendChild(img);
let selectedMeal = this.meal;
currentMeal = selectedMeal;
let favoriteBtn = document.createElement("button");
favoriteBtn.className = favoriteBtn.style.position = "absolute";
favoriteBtn.style.top = "10px";
favoriteBtn.style.right = "10px";
favoriteBtn.style.zIndex = "999";
favoriteBtn.style.backgroundColor = "white";
favoriteBtn.style.borderRadius = "50%";
favoriteBtn.style.width = "40px";
favoriteBtn.style.height = "40px";
favoriteBtn.style.display = "flex";
favoriteBtn.style.alignItems = "center";
favoriteBtn.style.justifyContent = "center";
favoriteBtn.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
favoriteBtn.innerHTML = favoriteMeals.includes(selectedMeal.id)
    ? '<i class="fa-solid fa-heart text-red-500 text-lg"></i>'
    : '<i class="fa-regular fa-heart text-gray-400 text-lg"></i>';
favoriteBtn.addEventListener("click", function(event) {
    event.stopPropagation();
    if (favoriteMeals.includes(selectedMeal.id)) {
        favoriteMeals = favoriteMeals.filter(function(id) {
            return id !== selectedMeal.id;
        });
    } else {
        favoriteMeals.push(selectedMeal.id);
    }
    localStorage.setItem("favoriteMeals", JSON.stringify(favoriteMeals));
console.log("Favorite Meals:", favoriteMeals);
    favoriteBtn.innerHTML = favoriteMeals.includes(selectedMeal.id)
        ? '<i class="fa-solid fa-heart text-red-500 text-lg"></i>'
        : '<i class="fa-regular fa-heart text-gray-400 text-lg"></i>';
});


imgContainer.appendChild(favoriteBtn);
    let imageBadges = document.createElement("div");
      imageBadges.className = "absolute bottom-3 left-3 flex gap-2";
      let imageCategoryBadge = document.createElement("span");
    imageCategoryBadge.className = "px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700";
    let categoryIcon = document.createElement("i");
    categoryIcon.className = "fa-solid fa-tag text-emerald-600 mr-1";
    imageCategoryBadge.appendChild(categoryIcon);
    imageCategoryBadge.append(this.meal.category);
     imageBadges.appendChild(imageCategoryBadge)
    let imageAreaBadge = document.createElement("span");
    imageAreaBadge.className = "px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700";
    let imageAreaIcon = document.createElement("i");
    imageAreaIcon.className = "fa-solid fa-globe text-blue-500 mr-1";
     imageAreaBadge.appendChild(imageAreaIcon);
    imageAreaBadge.append(this.meal.area);
    imageBadges.appendChild(imageAreaBadge);
    imgContainer.appendChild(imageBadges);
    card.appendChild(imgContainer);
    let contentContainer = document.createElement("div");
    contentContainer.className = "p-4";
    let title = document.createElement("h3");
    title.className = "text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1";
      title.textContent = this.meal.name;
    contentContainer.appendChild(title);
      let description = document.createElement("p");
    description.className = "text-xs text-gray-600 mb-3 line-clamp-2";
    description.textContent = "Delicious recipe to try!";
    contentContainer.appendChild(description);
    let footer = document.createElement("div");
     footer.className = "flex items-center justify-between text-xs";
      let badge = document.createElement("span");
    badge.className = "font-semibold text-gray-900";
     let badgeIcon = document.createElement("i");
    badgeIcon.className = "fa-solid fa-utensils text-emerald-600 mr-1";
    badge.appendChild(badgeIcon);
    badge.append(this.meal.category);
    footer.appendChild(badge);
    let areaBadge = document.createElement("span");
    areaBadge.className = "font-semibold text-gray-500";
    let areaBadgeIcon = document.createElement("i");
    areaBadgeIcon.className = "fa-solid fa-globe text-blue-500 mr-1";
    areaBadge.appendChild(areaBadgeIcon);
    areaBadge.append(this.meal.area);
    footer.appendChild(areaBadge);
    contentContainer.appendChild(footer);
    card.appendChild(contentContainer);
    card.addEventListener("click", function() {
        
        detailsImage.src = selectedMeal.thumbnail;
        detailsTitle.textContent = selectedMeal.name;
        // ----------------------------------------
        instructionsList.innerHTML = "";
        selectedMeal.instructions.forEach(function(instruction, i){
            let step = document.createElement("div");
            let number = document.createElement("div");
            let instructionText = document.createElement("p");
            step.className = "flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors";
            number.className = "w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0";
            number.textContent = i + 1;
            instructionText.className = "text-gray-700 leading-relaxed pt-2";
            step.appendChild(number);
            instructionText.textContent = instruction;
            step.appendChild(instructionText);
            instructionsList.appendChild(step);
        });
        ingredientsLength.textContent = selectedMeal.ingredients.length + " items";

        ingredientsList.innerHTML = "";
        selectedMeal.ingredients.forEach(function(ingredient) {
            let ingredientItem = document.createElement("div");
            let checkbox = document.createElement("input");
            let ingredientText = document.createElement("span");
            let measure = document.createElement("span");
            ingredientItem.className = "flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors";
            checkbox.type = "checkbox";
            checkbox.className = "ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300";
            ingredientText.className = "text-gray-700";
            measure.className = "font-medium text-gray-900";
            measure.textContent = ingredient.measure + " ";
            ingredientText.appendChild(measure);
            ingredientText.append(ingredient.ingredient);
            ingredientItem.appendChild(checkbox);
            ingredientItem.appendChild(ingredientText);
            ingredientsList.appendChild(ingredientItem);
});
        if (selectedMeal.area){
            detailsCuisine.textContent = selectedMeal.area;
            detailsCuisine.classList.remove('hidden');
        } else {
            detailsCuisine.classList.add('hidden');
        }
       if (!selectedMeal.category) {
        detailsIngredient.classList.add("hidden");
        } else {
        detailsIngredient.textContent = selectedMeal.category;
            detailsIngredient.classList.remove("hidden");
}
        // ----------------------------------------
        history.pushState({ page: "details" }, "", "#details");
        mealDetails.classList.remove("hidden");
        mealsSection.classList.add("hidden");
allRecipesSection.classList.add("hidden");
categoriesSection.classList.add("hidden");
searchSection.classList.add("hidden");
console.log(selectedMeal);
heroCalories.textContent = "Calculating...";
nutritionLoading.classList.remove("hidden");
nutritionFactsContainer.classList.add("hidden");
analyzeMeal(selectedMeal).then(function(data){
    let perServing = data.data.perServing;
    let totals = data.data.totals;
    logMealBtn.onclick = function() {
    currentMealNutrition = perServing;
    currentServings = 1;
    servingsCount.textContent = currentServings;
    modalMealImage.src = selectedMeal.thumbnail;
    modalMealName.textContent = selectedMeal.name;
    updateModalNutrition();
    mealLogModal.classList.remove("hidden");
};


    nutritionLoading.classList.add("hidden");
    nutritionFactsContainer.classList.remove("hidden");
    console.log(data)
    console.log(data.data.ingredients[0].nutrition);
    console.log(data.data.perServing);
    console.log({
    nutritionCalories,
    nutritionTotalCalories,
    nutritionProtein,
    nutritionCarbs,
    nutritionFat,
    nutritionFiber,
    nutritionSugar,
    nutritionSaturatedFat
});
    heroCalories.textContent = data.data.perServing.calories + " cal/serving";
    nutritionCalories.textContent = perServing.calories;
nutritionTotalCalories.textContent = "Total: " + totals.calories + " cal";
     nutritionProtein.textContent = perServing.protein + "g";
    nutritionCarbs.textContent = perServing.carbs + "g";
        nutritionFat.textContent = perServing.fat + "g";
        nutritionFiber.textContent = perServing.fiber + "g";
        nutritionSugar.textContent = perServing.sugar + "g";
        nutritionSaturatedFat.textContent = perServing.saturatedFat+ "g";
        // ml2tsh API y7dd elnsb fa ana ettaret a3ml el div bta3 line el nsb b 2smthm 3ala elmgmo3 elkoly lehom 3shan nsb tzbot
    
        let totalMacros = perServing.protein + perServing.carbs + perServing.fat + perServing.fiber + perServing.sugar ;
        proteinBar.style.width = (perServing.protein / totalMacros * 100) + "%";
carbsBar.style.width = (perServing.carbs / totalMacros * 100) + "%";
fatBar.style.width = (perServing.fat / totalMacros * 100) + "%";
        fiberBar.style.width = (perServing.fiber / totalMacros * 100) + "%";
sugarBar.style.width = (perServing.sugar / totalMacros * 100) + "%";
saturatedFatBar.style.width = (perServing.saturatedFat / totalMacros * 100) + "%";
}).catch(function(error) {
    console.log("Nutrition analysis error:", error);
    nutritionLoading.classList.add("hidden");
    nutritionFactsContainer.classList.remove("hidden");
    heroCalories.textContent = "Nutrition unavailable";
});
if (selectedMeal.youtube) {
    youtubeVideo.src = selectedMeal.youtube.replace("watch?v=", "embed/");
// 3shan el API byrg3 YouTube link b format watch,
// w el iframe by7tag format embed 3shan y3rd el video gwa el website.
    youtubeVideo.classList.remove("hidden");
} else {
    youtubeVideo.src = "";
    youtubeVideo.classList.add("hidden");
}

});


    recipesGrid.appendChild(card);
}

}

// --------------BACK BUTTON-----------------

backButton.addEventListener("click", function() {
    mealDetails.classList.add("hidden");
    mealsSection.classList.remove("hidden");
    allRecipesSection.classList.remove("hidden");
    categoriesSection.classList.remove("hidden");
    searchSection.classList.remove("hidden");
});
window.addEventListener("popstate", function() {
    mealDetails.classList.add("hidden");
    mealsSection.classList.remove("hidden");
    allRecipesSection.classList.remove("hidden");
    categoriesSection.classList.remove("hidden");
    searchSection.classList.remove("hidden");
});
// ---------------------------------
