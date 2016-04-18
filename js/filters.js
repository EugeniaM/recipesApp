var recipeFilters = angular.module('recipeFilters', []);

//фильтр, ограничивающий строку 200 символами
recipeFilters.filter('cutString', function() {
  	return function(str) {
  		var string = str.substring(0, 200)+'...';
  		return string;
  	};
});