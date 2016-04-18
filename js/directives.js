var recipeDirectives = angular.module('recipeDirectives', []);

//применение jQuery плагина на элементе для оживления галереи (ideas.html)
recipeDirectives.directive('myCarousel', ['$document', function($document) {
   	return {
   		restrict: 'A',
        link: function (scope, element, attrs) {                                                                                                                  
        	//код, который позволяет применить jQuery плагин после выполнения ngRepeat 
        	var watch = scope.$watch(
        		function() {
                	return $(element).find('.indicators').children().length;
            	},	
            	function() {
                	if( $(element).find('.indicators').children().length ){
	                	scope.$evalAsync(function() {
		                    $(element).carousel({
					            leftButton: '.glyphicon-chevron-left',
					            rightButton: '.glyphicon-chevron-right',
					            navigationPanel: '.indicators',
					            slideCaption: '.gallery-title',
					            slideContainer: '.recipe-gallery',
					            containerWidth: 660
		        			});
		            	});
		        	}
                }
            );
  		}
 	}
}]);

//директива для добавления нового элемента input в список ингредиентов при клике на кнопке 'Добавить' (addRecipe.html)
recipeDirectives.directive('myAddingredients', ['$document', '$compile', function($document, $compile) {
   	return {
   		link: function (scope, element, attrs) {

   			function addInput(){                                                                                                                  
        		var parentElem = $(element).prev();
        		var index = parentElem.children().length;
        		var content = $(parentElem.children()[0]).clone().find('input').attr('ng-model', 'ingredients.ingredients'+index)
        		.attr('name', 'ingredients'+index).val('').end()
        		.find('.invalid').attr('ng-show', 'addRecipeForm.ingredients'+index+'.$error.maxlength').end();

				var newElem = angular.element(content);
        		var compileFn = $compile(newElem);
        		compileFn(scope);
        		parentElem.append(newElem);
        	};

        	$(element).click(addInput);                                     
  		}
 	}
}]);

//директива для удаления элемента input из списка ингредиентов при клике на glyphicon-remove (addRecipe.html)
recipeDirectives.directive('myRemoveingredients', ['$document', function($document) {
   	return {
   		link: function (scope, element, attrs) {

   			function removeInput(){
   				//удалить значение из scope
   				if(jQuery.type(scope.ingredients === 'object')){
	   				var attribute = $(element).prev().attr('name');
   					delete scope.ingredients[attribute];
   				}; 
   				//удалить элемент                                                                                                     
        		$(element).parent().parent().remove();
        	};

        	$(element).click(removeInput);                                     
  		}
 	}
}]);

//директива для изменения внешнего вида кнопок 'Избранное', 'Покупки', 'План' при клике на них
recipeDirectives.directive('myChangebtn', ['$document', function($document) {
   	return {
   		link: function (scope, element, attrs) {
   			$(function(){
	   			var id = $(element).attr('id');
	   				//при переходе в представление отображать кнопку зажатой, если соответствующее ей свойство в объекте рецепта true
	   				if(scope.recipe[id]) $(element).addClass('btn-pressed');
	   			
	   			//изменить вид кнопки при клике на ней в соответствие со значением соответствующего свойства в объекте
	   			function changeClass(){                                                                                                                  
	        		if(scope.recipe[id]){
	        			$(element).addClass('btn-pressed');
	        		}else{
	        			$(element).removeClass('btn-pressed');
	        		};
	        	};

	        	$(element).click(changeClass);
	        })                                 
  		}
 	}
}]);