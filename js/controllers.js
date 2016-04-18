
//модуль контроллеров
var recipeControllers = angular.module('recipeControllers', [
	'recipeServices',
	'recipeDirectives'
]);

//блок, определяющий текущий маршрут
//необходим для определения, какому пункту меню добвлять класс 'active' и отображать ли панель меню списков (в index.html)
recipeControllers.run(['$rootScope', '$location', function ($rootScope, $location) {
	$rootScope.currentPosition = '#/';
	$rootScope.currentlyInLists;
	
    $rootScope.$on('$locationChangeSuccess', function () {
        var url = $location.url();
	
		if(url.indexOf('myRecipes') !==-1){
			$rootScope.currentPosition = '#/myRecipes';
			$rootScope.currentlyInLists = false;
		}else if(url.indexOf('lists') !==-1 ){
			$rootScope.currentPosition = '#/lists/chosenRecipes';
			$rootScope.currentlyInLists = true;
		}else{
			$rootScope.currentPosition = '#/';
			$rootScope.currentlyInLists = false;
		};

		//используется для определения подпункта меню списков, которому добавляется класс 'tab-active' (в index.html)
		$rootScope.findCurrentListPosition = function (id) {
			return url.indexOf(id) !==-1;
		}
    });
}]);

//пункты меню и их маршруты (index.html)
recipeControllers.controller('navigationCtrl', ['$scope', function ($scope) {
		$scope.menuList = [
			{title: 'Идеи', route: '#/'},
			{title: 'Мои рецепты', route: '#/myRecipes'},
			{title: 'Списки', route: '#/lists/chosenRecipes'}
		];
	}
]);

//контроллер маршрута 'Идеи' (ideas.html)
recipeControllers.controller('IdeasCtrl', ['$scope', 'getGalleryData', 'defineRecipeToView', 'saveToLocalStorage', '$location',
function ($scope, getGalleryData, defineRecipeToView, saveToLocalStorage, $location) {
	$scope.ideasRecipes = [];
	//получить данные для галереи с помощью сервиса 'getGalleryData' и добавить недостающие параметры
	var promiseObj=getGalleryData.getData();
    promiseObj.then(function(result) {
    	$scope.ideasRecipes = result;
    	for(var i = 0; i<$scope.ideasRecipes.length; i++){
        	$scope.ideasRecipes[i].chosen = false;
        	$scope.ideasRecipes[i].planned = false;
        	$scope.ideasRecipes[i].productsToPurchase = false;
		}
    });

    //переход на указанный маршрут (используется при клике на названии рецепта в галерее)
    $scope.goTo = function ( path ) {
  		$location.path( path );
	};
	//при клике на названии рецепта передать объект этого рецепта в сервис 'defineRecipeToView'
    $scope.sendRecipeObject = function(object){
		defineRecipeToView.setRecipeObject(object);
	};
	$scope.saveRecipeObject = function(object){

		var recipe = object;
		//ключ, по которому находим все сохраненные в ocalStorage объекты
		var key = saveToLocalStorage.key;
		//получить массив сохраненных рецептов
		var storedRecipesArray = JSON.parse(saveToLocalStorage.getData(key));
		//определить индекс отображаемого в представлении объекта в массиве рецептов
		var index = _.indexOf(storedRecipesArray, _.find(storedRecipesArray, {title: recipe.title}));
		//если объект рецепта не содержится в массиве сохраненных рецептов - добавляем его в массив
		if(index === -1){
			storedRecipesArray.push(recipe);
		};
		saveToLocalStorage.setData(storedRecipesArray);
	};
}]);

//добавление нового рецепта (addRecipe.html)
recipeControllers.controller('AddRecipeCtrl', ['$scope', 'saveToLocalStorage', '$location', 
function ($scope, saveToLocalStorage, $location) {

	$scope.recipe = {};
	$scope.title ='';
	$scope.description = '';
	$scope.photoUrl = '';
	$scope.time = '';
	$scope.ingredients = {};
	$scope.instruction = '';
	
	//ключ для поиска данных в localStorage
	var key = saveToLocalStorage.key;

	$scope.saveRecipe = function(addRecipeForm){
		//получить данные, которые хранятся в localStorage по ключу key
		var savedData = JSON.parse(saveToLocalStorage.getData(key));

		if(addRecipeForm.$valid){
			//определить объект рецепта по данным, введенным в форму
			$scope.recipe = {
				title: $scope.title,
				description: $scope.description,
				photoUrl: $scope.photoUrl,
				time: $scope.time,
				ingredients: (function(){
					var arr = [];
					for (key in $scope.ingredients){
						arr.push($scope.ingredients[key]);
					};
					return arr;
				})(),
				instruction: $scope.instruction,
				chosen: false,
				planned: false,
				productsToPurchase: false
			};

			//добавить объект нового рецепта в localStorage
			if(savedData){
				savedData.push($scope.recipe);
			}else{
				savedData = [];
				savedData.push($scope.recipe);
			};
			saveToLocalStorage.setData(savedData);

			//после отправки формы перейти на вкладку "Мои рецепты"
			$scope.goTo('/myRecipes');
		}
	}

	//переход на указанный маршрут
	$scope.goTo = function ( path ) {
  		$location.path( path );
	};
}]);

//"Мои рецепты" (myRecipes.html)
recipeControllers.controller('MyRecipesCtrl', ['$scope', 'saveToLocalStorage', 'defineRecipeToView', 
	function ($scope, saveToLocalStorage, defineRecipeToView) {
		var key = saveToLocalStorage.key;
		//получить данные для отображения
		$scope.recipesList = JSON.parse(saveToLocalStorage.getData(key));

		//при нажатии на кнопке "Посмотреть рецепт" передать объект рецепта в сервис 'defineRecipeToView'
		$scope.sendRecipeObject = function(object){
			defineRecipeToView.setRecipeObject(object);
		}
	}
]);

//просмотр рецепта (viewRecipe.html)
recipeControllers.controller('MyRecipeViewCtrl', ['$scope', 'defineRecipeToView', 'saveToLocalStorage', '$routeParams', 
	function ($scope, defineRecipeToView, saveToLocalStorage, $routeParams) {
		//получить ключ, по которому хранится необходимый объект рецепта в localStorage
		var currentRecipeKey = defineRecipeToView.currentRecipeKey;
		//получить объект рецепта
		$scope.recipe = defineRecipeToView.getRecipeObject(currentRecipeKey);
		//ключ, по которому находим все сохраненные в ocalStorage объекты
		var key = saveToLocalStorage.key;

		$scope.routeID = $routeParams.recipe;

		//функция изменения флагов, определяющих добавление рецепта в списки
		//выполняется при нажатии на кнопку 'Избранное', 'План' или 'Покупки'
		$scope.changeOption = function(option){
			//получить массив сохраненных рецептов
			var storedRecipesArray = JSON.parse(saveToLocalStorage.getData(key));
			//определить индекс отображаемого в представлении объекта в массиве рецептов
			var index = _.indexOf(storedRecipesArray, _.find(storedRecipesArray, {title: $scope.recipe.title}));
			//поменять необходимые параметры
			if($scope.recipe[option]){
				$scope.recipe[option] = false;
			}else{
				$scope.recipe[option] = true;
			}
			/*если объект рецепта содержится в массиве сохраненных рецептов - заменяем его
			иначе (рецепт был загружен с сервера) - добавляем объект рецепта в массив
			(делаем предположение, что если пользователь добавляет загруженный с сервера рецепт в один из списков, 
			он не против добавить этот рецепт в список 'Мои рецепты')*/
			if(index !== -1){
				storedRecipesArray.splice(index, 1, $scope.recipe);
			}else{
				storedRecipesArray.push($scope.recipe);
			};
			saveToLocalStorage.setData(storedRecipesArray);
		};
	}
]);

//изменение рецепта (editRecipe.html)
recipeControllers.controller('MyRecipeEditCtrl', ['$scope', 'defineRecipeToView', 'saveToLocalStorage', '$location', 
	function ($scope, defineRecipeToView, saveToLocalStorage, $location) {
		var currentRecipeKey = defineRecipeToView.currentRecipeKey;
		//получить объект рецепта для редактирования
		$scope.recipeToEdit = defineRecipeToView.getRecipeObject(currentRecipeKey);
		//определить значения полей формы для отображения их в представлении
		$scope.title = $scope.recipeToEdit.title || '';
		$scope.description = $scope.recipeToEdit.description || '';
		$scope.photoUrl = $scope.recipeToEdit.photoUrl || '';
		$scope.time = $scope.recipeToEdit.time || '';
		$scope.ingredients = [];
		for(var i = 0; i < $scope.recipeToEdit.ingredients.length; i++){
			$scope.ingredients[i] ={};
			$scope.ingredients[i].ingredient = $scope.recipeToEdit.ingredients[i];
		}
		$scope.instruction = $scope.recipeToEdit.instruction || '';
		$scope.chosen = $scope.recipeToEdit.chosen;
		$scope.planned = $scope.recipeToEdit.planned;
		$scope.productsToPurchase =$scope.recipeToEdit.productsToPurchase;

		var key = saveToLocalStorage.key;

		//добавить новый ингредиент
		$scope.addIngredient = function(){
			$scope.ingredients.push({ingredient: ''});
		};

		//удалить ингредиент
		$scope.removeIngredient = function(item){
			var index = $scope.ingredients.indexOf(item);
			$scope.ingredients.splice(index, 1);
		};

		$scope.saveRecipe = function(editRecipeForm){
			//получить массив сохраненных рецептов
			var savedData = JSON.parse(saveToLocalStorage.getData(key));
			if(!savedData){
				savedData = [];
			};
			if(editRecipeForm.$valid){
				//определить объект рецепта по данным, введенным в форму
				$scope.recipe = {
					title: $scope.title,
					description: $scope.description,
					photoUrl: $scope.photoUrl,
					time: $scope.time,
					ingredients: (function(){
						var arr = [];
						for (var i = 0; i < $scope.ingredients.length; i++){
							arr.push($scope.ingredients[i].ingredient);
						};
						return arr;
					})(),
					instruction: $scope.instruction,
					chosen: $scope.chosen,
					planned: $scope.planned,
					productsToPurchase: $scope.productsToPurchase
				};
				
				var index = _.indexOf(savedData, _.find(savedData, {title: $scope.recipeToEdit.title}));

				/*если объект рецепта содержится в массиве сохраненных рецептов - заменяем его
				иначе (рецепт был загружен с сервера) - добавляем объект рецепта в массив
				(делаем предположение, что если пользователь изменяет загруженный с сервера рецепт, 
				он хочет добавить этот рецепт в список 'Мои рецепты')*/
				if(index === -1){
					savedData.push($scope.recipe);
				}else{
					savedData.splice(index, 1, $scope.recipe);
				}
				saveToLocalStorage.setData(savedData);
				//переход на вкладку 'Мои рецепты'
				$scope.goTo('/myRecipes');
			}
		};

		$scope.goTo = function ( path ) {
  			$location.path( path );
		};
	}
]);

//список избранных рецептов (chosenRecipes.html)
recipeControllers.controller('ChosenRecipesCtrl', ['$scope', 'defineRecipeToView', 'saveToLocalStorage', 
	function ($scope, defineRecipeToView, saveToLocalStorage) {
		var key = saveToLocalStorage.key;
		var localStorageData = JSON.parse(saveToLocalStorage.getData(key));

		//отобрать те объекты рецептов из массива сохраненных, у которых свойство chosen === true
		$scope.chosenRecipes = _.filter(localStorageData, {'chosen': true});

		//при нажатии на кнопке "Посмотреть рецепт" передать объект рецепта в сервис 'defineRecipeToView'
		$scope.sendRecipeObject = function(object){
			defineRecipeToView.setRecipeObject(object);
		};
	}
]);

//список запланированных рецептов (plannedRecipes.html)
recipeControllers.controller('PlannedRecipesCtrl', ['$scope', 'defineRecipeToView', 'saveToLocalStorage', 
	function ($scope, defineRecipeToView, saveToLocalStorage) {
		var key = saveToLocalStorage.key;
		var localStorageData = JSON.parse(saveToLocalStorage.getData(key));

		//отобрать те объекты рецептов из массива сохраненных, у которых свойство planned === true
		$scope.plannedRecipes = _.filter(localStorageData, {'planned': true});

		//при нажатии на кнопке "Посмотреть рецепт" передать объект рецепта в сервис 'defineRecipeToView'
		$scope.sendRecipeObject = function(object){
			defineRecipeToView.setRecipeObject(object);
		};
	}
]);

//список покупок (productsToPurchase.html)
recipeControllers.controller('PurchasesCtrl', ['$scope', 'saveToLocalStorage', 
	function ($scope, saveToLocalStorage) {
		var key = saveToLocalStorage.key;
		var localStorageData = JSON.parse(saveToLocalStorage.getData(key));

		//отобрать те объекты рецептов из массива сохраненных, у которых свойство productsToPurchase === true
		var purchaseRecipes = _.filter(localStorageData, {'productsToPurchase': true});

		//отобрать все элементы из массива свойства ingredients полученных объектов в массив
		$scope.productsToPurchase = [];
		for(var i = 0; i < purchaseRecipes.length; i++){
			$scope.productsToPurchase = $scope.productsToPurchase.concat(purchaseRecipes[i].ingredients);
		};		
	}
]);
