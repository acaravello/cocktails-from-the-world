class UI {

    displayCategories() {
        const categoryList = cocktail.getCategories().then((categories) => {
            console.log(categories);
            const catList = categories.drinks;
            const firstOption = document.createElement('option');
            firstOption.textContent ='- Select - ';
            firstOption.value = '';
            document.querySelector('#search').appendChild(firstOption);
            for(let i = 0; i <catList.length;i++) {
                const otherOption = document.createElement('option');
                otherOption.textContent =catList[i].strCategory;
                otherOption.value = catList[i].strCategory.split(' ').join('_');
                document.querySelector('#search').appendChild(otherOption);
            }
        });
    }

    displaySingleRecipe(recipe) {
        console.log(recipe);
        const modalTitle = document.querySelector('.modal-title');
        const modalDescription = document.querySelector('.modal-body .description-text');
        const modalIngredients = document.querySelector('.modal-body .ingredient-list .list-group');
        modalTitle.innerHTML = recipe.strDrink;
        modalDescription.innerHTML = recipe.strInstructions;
        let ingredientsList = this.displayIngredients(recipe);
        modalIngredients.innerHTML = ingredientsList;
    }


    displayDrinks(drinks) {
        console.log(drinks);
        const resultWrapper = document.querySelector('.results-wrapper');
        resultWrapper.style.display ='block';
        const resultsDiv = document.querySelector('#results');
        drinks.forEach((drink) => {
            resultsDiv.innerHTML += `
            <div class="col-md-4">
            <div class="card my-3">
            <button type="button" data-id="${drink.idDrink}" class="favorite-btn btn btn-outline-info">
            +
            </button>
            <img class="card-img-top" src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
            <div class="card-body">
            <h2 class="card-title text-center">${drink.strDrink}</h2>
            <a data-target="#recipe" class ="btn btn-success get-recipe" href="#" data-toggle="modal" data-id="${drink.idDrink}">
            Get Recipe</a>
            </div>
            </div>
            </div>
            `
        });
        this.isFavorite();
    }

    displayDrinksWithIngredients(drinks) {
        console.log(drinks);
        const resultWrapper = document.querySelector('.results-wrapper');
        resultWrapper.style.display ='block';
        const resultsDiv = document.querySelector('#results');
        drinks.forEach((drink) => {
            resultsDiv.innerHTML += `
            <div class="col-md-6">
            <div class="card my-3">
            <button type="button" data-id="${drink.idDrink}" class="favorite-btn btn btn-outline-info">
            +
            </button>
            <img class="card-img-top" src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
            <div class="card-body">
            <h2 class="card-title text-center">${drink.strDrink}</h2>
            <p class="card-text font-weight-bold">Instructions</p>
            <p class="card-text"> ${drink.strInstructions}</p>
            <p class="card-text">
            <ul class="list-group">
            <li class="list-group-item alert alert-danger">Ingredients</li>
            ${this.displayIngredients(drink)}
            </ul>
            </p>
            <p class="card-text font-weight-bold">Extra info:</p>
            <p class="card-text">
            <span class="badge badge-pill badge-success">
            ${drink.strAlcoholic}
            </span>
            <span class="badge badge-pill badge-warning">
            Category: ${drink.strCategory}
            </span>
            </p>
            </div>
            </div>
            </div>
            `
        });
        this.isFavorite();
    }

    displayIngredients(drink) {
        let ingredients = [];
        for(let i = 1;i < 16; i++) {
            const ingredientMeasure = {};
            if(drink[`strIngredient${i}`]) {
                ingredientMeasure.ingredient = drink[`strIngredient${i}`];
                if(drink[`strMeasure${i}`]) {
                    ingredientMeasure.measure = '- ' + drink[`strMeasure${i}`];
                } else {
                    ingredientMeasure.measure = '';
                }
                ingredients.push(ingredientMeasure);
            }
        }
        let ingredientsTemplate = '';
        ingredients.forEach((ing) => {
            ingredientsTemplate += `
            <li class="list-group-item">${ing.ingredient} ${ing.measure}</li>
            `
        });
        return ingredientsTemplate;
    }



    printMessage(message, className) {
        const div=document.createElement('div');
        div.innerHTML = `
        <div class="alert alert-dismissible alert-${className}">
        <button type="button" class="close" data-dismiss="alert">x</button>
        ${message}
        </div>
        `;
        const reference = document.querySelector('.jumbotron h1');
        const parentNode = reference.parentElement;
        parentNode.insertBefore(div, reference);

        setTimeout(() => {
            const myButton = document.querySelector('.alert');
            if(myButton) myButton.remove();
        },5000);
    }

    clearResults() {
        const resultDiv = document.querySelector('#results');
        resultDiv.innerHTML = '';
    }

    displayFavorites(favorites) {
        const favoritesTable = document.querySelector('#favorites tbody');
        favorites.forEach(drink => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>
            <img src="${drink.image}" alt="${drink.name}" width="100">
            </td>
            <td>${drink.name}</td>
            <td>
            <a href="#" data-toggle="modal" data-target="#recipe" data-id="${drink.id}"
            class="btn btn-success get-recipe">
            View
            </a>
            </td>
            <td>
            <a href="#" data-id="${drink.id}"
            class="btn btn-danger remove-recipe">
            Remove
            </a>
            </td>
            `;
            favoritesTable.appendChild(tr);
        })
    }

    removeFavorite(element) {
        element.remove();
    }

    isFavorite() {
        const drinks = cocktailDB.getFromDB();
        drinks.forEach(drink => {
         let {id} = drink;
         let favoriteDrink = document.querySelector(`[data-id="${id}"]`);
         if(favoriteDrink) {
             favoriteDrink.classList.add('is-favorite');
             favoriteDrink.textContent = '-';
         }
        });
    }
}