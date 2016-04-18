//Основной модуль приложения
var recipesApp = angular.module('recipesApp', [
	'ngRoute',
	'ngSanitize',
	'recipeControllers',
	'recipeFilters',
	'recipeDirectives'
]);

//маршруты
recipesApp.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: "templates/ideas.html",
		controller: 'IdeasCtrl'
	});
	$routeProvider.when('/myRecipes', {
		templateUrl: "templates/myRecipes.html",
		controller: 'MyRecipesCtrl'
	});
	$routeProvider.when('/myRecipes/add', {
		templateUrl: "templates/addRecipe.html",
		controller: 'AddRecipeCtrl'
	});
	$routeProvider.when('/myRecipes/:recipe', {
		templateUrl: "templates/viewRecipe.html",
		controller: 'MyRecipeViewCtrl'
	});
	$routeProvider.when('/myRecipes/:recipe/edit', {
		templateUrl: "templates/editRecipe.html",
		controller: 'MyRecipeEditCtrl'
	});
	$routeProvider.when('/lists/chosenRecipes', {
		templateUrl: "templates/chosenRecipes.html",
		controller: 'ChosenRecipesCtrl'
	});
	$routeProvider.when('/lists/plannedRecipes', {
		templateUrl: "templates/plannedRecipes.html",
		controller: 'PlannedRecipesCtrl'
	});
	$routeProvider.when('/lists/productsToPurchase', {
		templateUrl: "templates/productsToPurchase.html",
		controller: 'PurchasesCtrl'
	});
}]);


