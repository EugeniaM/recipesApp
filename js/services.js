var recipeServices = angular.module('recipeServices', []);

//сервис, загружающий рецепты с сервера и возвращающий промис-объект
recipeServices.factory('getGalleryData', ['$http', '$q', function($http, $q){
    return{
        getData: function(){
            var deferred = $q.defer();
            $http({method: 'GET', url: 'https://jsonblob.com/api/jsonBlob/56c089b3e4b01190df4ef1ce'}).
             success(function(data) {
                deferred.resolve(data.recipes);
            }).
            error(function(status) {
                deferred.reject(status);
            });
             
            return deferred.promise;
        }
    }
}]);

//сохранение и извлечение данных из localStorage
recipeServices.factory('saveToLocalStorage', ['$window', function(window){
	var key = 'myRecipeApplicationKey';
    return{
        setData: function (data) {
        	localStorage.setItem(key, JSON.stringify(data));
       	},
      	getData: function (key) {
        	return localStorage.getItem(key);
      	},
      	key
   	}
}
]);

//сохранение выбранного для отображения рецепта в localStorage и извлечение его данных
recipeServices.factory('defineRecipeToView', ['$window', function(window){
	var currentRecipeKey = 'myRecipeApplicationCurrentKey'
    return{
        setRecipeObject: function (object) {
      		localStorage.setItem(currentRecipeKey, JSON.stringify(object));
      	},
      	getRecipeObject: function (key) {
      		return JSON.parse(localStorage.getItem(key));
      	},
      	currentRecipeKey
   	}
}]);