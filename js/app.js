const ui = new UI();
const cocktail = new CocktailAPI();
const cocktailDB = new CocktailDB();
function eventListeners() {
document.addEventListener('DOMContentLoaded', documentReady);
const searchForm = document.querySelector('#search-form');
if(searchForm) {
    searchForm.addEventListener('submit',getCocktails);
    }

const resultsDiv = document.querySelector('#results');
if(resultsDiv) {
    resultsDiv.addEventListener('click', resultsDelegation);
}
}


eventListeners();


function getCocktails(e) {
    e.preventDefault();
    const searchTerm = document.querySelector('#search').value;
    if(!searchTerm) {
        ui.printMessage('Please add something into the form', 'danger');
    } else {
        let serverResponse;
        const type = document.querySelector('#type').value;
        switch(type) {
            case 'name':
            serverResponse = cocktail.getDrinksByName(searchTerm);
            break;
            case 'ingredient':
            serverResponse = cocktail.getDrinksByIngredient(searchTerm);
            break;
            case 'category':
            serverResponse = cocktail.getDrinksByCategory(searchTerm);
            break;
            case 'alcohol':
            serverResponse = cocktail.getDrinksByAlcohol(searchTerm);
        }

        ui.clearResults();
        serverResponse.then((cocktails) => {
            if(!cocktails.drinks) {
                ui.printMessage('There\'s no results. Try anothert term', 'danger');
            } else {            
                if (type === 'name') {
                    ui.displayDrinksWithIngredients(cocktails.drinks);
                } else {
                    ui.displayDrinks(cocktails.drinks);
                }
            }
        })
    }
}

function resultsDelegation(e) {
    e.preventDefault();
    if(e.target.classList.contains('get-recipe')) {
        cocktail.getSingleRecipe(e.target.dataset.id).then((recipe) => {
            ui.displaySingleRecipe(recipe.drinks[0]);
        });
    }

    if(e.target.classList.contains('favorite-btn')) {
        if(e.target.classList.contains('is-favorite')) {
            e.target.classList.remove('is-favorite');
            e.target.textContent = '+';
            cocktailDB.removeFromDB(e.target.dataset.id);
        } else {
            e.target.classList.add('is-favorite');
            e.target.textContent = '-';
            const cardBody = e.target.parentElement;
            const drinkInfo = {
                id: e.target.dataset.id,
                name: cardBody.querySelector('.card-title').textContent,
                image: cardBody.querySelector('.card-img-top').src
            }
            cocktailDB.saveIntoDB(drinkInfo);
        } 
    }   
}

function documentReady() {
    ui.isFavorite();
    const searchCategory = document.querySelector('.search-category');
    if(searchCategory) {
        ui.displayCategories();
    }
    const favoritesTable = document.querySelector('#favorites');
    if(favoritesTable) {
        const drinks = cocktailDB.getFromDB();
        ui.displayFavorites(drinks);

        favoritesTable.addEventListener('click', (e) =>{
           e.preventDefault;
           if(e.target.classList.contains('get-recipe')) {
            cocktail.getSingleRecipe(e.target.dataset.id).then((recipe) => {
                ui.displaySingleRecipe(recipe.drinks[0]);
            });
           }
           if(e.target.classList.contains('remove-recipe')) {
               ui.removeFavorite(e.target.parentElement.parentElement);
               cocktailDB.removeFromDB(e.target.dataset.id);
           }
        });
    }
}