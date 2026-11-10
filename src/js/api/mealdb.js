// -------------------API---------------------------
var BASE_URL = "https://nutriplan-api.vercel.app/api";

console.log("BASE URL:", BASE_URL);

Promise.all([
    getMeals(),
    getCategories(),
    getAreas()
]).then(function(results) {
    console.log("Meals:", results[0]);
    console.log("Categories:", results[1]);
    console.log("Areas:", results[2]);
}).catch(function(error) {
    console.log("API TEST ERROR:", error);
});
// -------------------Meals---------------------------
export function getMeals(){
   return fetch(BASE_URL + "/meals/search?q=chicken&page=1&limit=25")
    .then(function(response) {
         if (!response.ok) {
                throw new Error("Failed to fetch meals");
            }
        return response.json();
    })
    .then(function(data){
        return data.results;
    });
}
// -------------------Meal by ID---------------------------
export function analyzeMeal(meal){
    return fetch(BASE_URL + "/nutrition/analyze", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "x-api-key": "P9nkkKQJbtHjfTMKjbQqCzDfctNMnJmctjmdbLTb"
    },
    body: JSON.stringify({
        recipeName: meal.name,
        ingredients: meal.ingredients.map(function(item) {
    return item.measure + " " + item.ingredient;
})
    })
})
.then(function(response) {
    if (!response.ok) {
    throw new Error("Nutrition analysis failed");
}
    return response.json();
});}
// -------------------Categories---------------------------
export function getCategories (){
    return fetch (BASE_URL + "/meals/categories")
    .then(function(response) {
         if (!response.ok) {
                throw new Error("Failed to fetch categories");
            }
        return response.json();
    })
    .then(function(data){
        return data.results;
    });
}
// -------------------Meals by Category---------------------------
export function getMealsByCategory(category) {
    return fetch(BASE_URL + "/meals/filter?category=" + category + "&limit=25")
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Failed to fetch category meals");
            }

            return response.json();
        })
        .then(function(data) {
            return data.results;
        });
}
// -------------------Area's Names---------------------------
export function getAreas() {
    return fetch(BASE_URL + "/meals/areas")
        .then(function(response) {
             if (!response.ok) {
                throw new Error("Failed to fetch areas");
            }
            return response.json();
        })
        .then(function(data) {
            return data.results;
        });
}
// -------------------Meals by Area---------------------------
export function getMealsByArea(area) {
    return fetch(BASE_URL + "/meals/filter?area=" + area + "&limit=25")
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Failed to fetch area meals");
            }
            return response.json();
        })
        .then(function(data) {
            return data.results;
        });
}
// -------------------Meals by Ingredient---------------------------
export function getMealsByIngredient(ingredient) {
    return fetch(BASE_URL + "/meals/filter?ingredient=" + ingredient + "&limit=25")
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Failed to fetch ingredient meals");
            }
            return response.json();
        })
        .then(function(data) {
            return data.results;
        });
}
// -------------------Meals by Name---------------------------
export function getMealsByName(query) {
    return fetch(BASE_URL + "/meals/search?q=" + query + "&page=1&limit=25")
      .then(function(response) {
            if (!response.ok) {
             throw new Error("Failed to search meals by name");
            }
            return response.json();
        })
     .then(function(data) {
            return data.results;
        });
}
// -------------------Product by Barcode---------------------------
export function getProductByBarcode(barcode) {
    return fetch(BASE_URL + "/products/barcode/" + barcode)
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Failed to fetch product by barcode");
            }
            return response.json();
        })
        .then(function(data) {
            return data.result;
        });
}
// -------------------Product Categories---------------------------
export function getProductCategories() {
    return fetch(BASE_URL + "/products/categories")
      .then(function(response) {
            if (!response.ok) {
                throw new Error("Failed to fetch product categories");
            }
            return response.json();
        })
        .then(function(data) {
            return data.results;
       });
}
// -------------------Products by Category---------------------------
export function getProductsByCategory(category) {
    return fetch(BASE_URL + "/products/category/" + category + "?page=1&limit=24")
        .then(function(response) {
        if (!response.ok) {
                throw new Error("Failed to fetch products by category");
        }
            return response.json();
        })
        .then(function(data) {
            return data.results;
        });
}
// -------------------Products by Name-------------------//
export function getProductsByName(query) {
    return fetch(BASE_URL + "/products/search?q=" + encodeURIComponent(query) + "&page=1&limit=24")
    .then(function(response) {
        if (!response.ok) {
            throw new Error("Failed to search products by name");
        }
        return response.json();
    })
    .then(function(data) {
        return data.results;
    });
}