;(function ( $, window, document, undefined ) {

    var pluginName = 'carousel';

    var defaults = {};


    function Plugin( element, options ) {
        this.element = element;

        this.options = $.extend( {}, defaults, options) ;
        this.leftButton = this.options.leftButton;
        this.rightButton = this.options.rightButton;
        this.navigationPanel = this.options.navigationPanel;
        this.slideCaption = this.options.slideCaption;
        this.slideContainer = this.options.slideContainer;
        this.containerWidth = this.options.containerWidth;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype.init = function () {
        var $element = $(this.element);
		var that = this;
		if( !that.options.leftButton || 
			!that.options.rightButton || 
			!that.options.navigationPanel || 
			!that.options.slideContainer || 
			!that.options.containerWidth ) throw 'One or more of the required parameters are not defined';

		$(that.leftButton).parent()
    		.mouseenter(function(e){
                    $(that.leftButton).parent().addClass('side-active-left');
                    $(that.leftButton).addClass('arrows-active');           
    		})
    		.mouseleave(function(e){                
    			    $(that.leftButton).parent().removeClass('side-active-left');
            	    $(that.leftButton).removeClass('arrows-active');                
    		});

   		$(that.rightButton).parent()
    		.mouseenter(function(e){                
    			    $(that.rightButton).parent().addClass('side-active-right');
    			    $(that.rightButton).addClass('arrows-active');                
    		})
    		.mouseleave(function(e){
                    $(that.rightButton).parent().removeClass('side-active-right');
    			    $(that.rightButton).removeClass('arrows-active');
    		});
    	
		$(that.navigationPanel + ' > li')
			.mouseenter(function(e){$(e.target).addClass('indicator-hover')})
			.mouseleave(function(e){$(e.target).removeClass('indicator-hover')});

		$(that.slideCaption)
			.mouseenter(function(e){$(this).addClass('text-hover')})
			.mouseleave(function(e){$(this).removeClass('text-hover')});

    	var index=0;

    	$(that.navigationPanel).children()[0].classList.add('indicator-active')

    	function goToSlide(index){
		    $(that.navigationPanel).children().removeClass('indicator-active');
		    $(that.navigationPanel).children()[index].classList.add('indicator-active');
		    var leftShift = -(that.containerWidth * index);
		    $(that.slideContainer).stop().animate({ left: leftShift+'px' }, 1000);
		};

		var intervalID = setInterval(function(){ 
		    index++;
		    if(index === $(that.navigationPanel).children().length) index=0;
		    goToSlide(index);
		    
		 }, 2000);

		$element.on('click', function(e){
		    var currnetIndex = $(that.navigationPanel + ' > .indicator-active').index();
		    if($(e.target).hasClass(that.leftButton.substr(1))){
				clearInterval(intervalID);
				index = currnetIndex - 1;
		    };
		    if($(e.target).hasClass(that.rightButton.substr(1))){
				clearInterval(intervalID);
				index = currnetIndex + 1;
		    };
		    if($(e.target).parent().hasClass(that.navigationPanel.substr(1))){
				clearInterval(intervalID);
				index = $(e.target).index();
		    };
            if($(e.target).hasClass(that.slideCaption.substr(1))){
                clearInterval(intervalID);
                return;
            };


		    if(index===-1){
				index = $(that.navigationPanel).children().length - 1;
		    };

		    if(index===$(that.navigationPanel).children().length){
				index = 0;
		    };
		    
		    goToSlide(index);
		});

        $('body').on('click', function (e) {
            if(e.target.tagName === 'A'){
                clearInterval(intervalID);
            }; 
        })
				
    };

    $.fn[pluginName] = function ( options ) {
    	if( $.type(options) === 'object' ){
    		return this.each(function () {
	            if (!$.data(this, 'plugin_' + pluginName)) {
	                $.data(this, 'plugin_' + pluginName,
	                new Plugin( this, options ));
	            }
	        });
    	}else{
	        throw 'Argument is not an Object';
        };
    }

})( jQuery, window, document );