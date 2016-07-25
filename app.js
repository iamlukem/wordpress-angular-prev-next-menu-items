
angular.module('myapp', ['ngRoute','ngAnimate','ngSanitize'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider
    	.when('/:slug', { // :slug turns the url into a variable
    		templateUrl: 'page.php',
    		controller: 'Main' 
    	})
})

.controller('Main', function($scope, $rootScope, $http, $routeParams) {

    var slug = $routeParams.slug; // store the slug

	$http.get('/wp-json/wp/v2/pages/?filter[name]=' + slug).success(function(res){
        // The above call retrieves a page that matches the current slug
		$scope.post = res[0]; // pass the data to the view.
	});

    $http.get('/wp-json/wp-api-menus/v2/menu-locations/main_navigation_menu ').success(function(menu){
        // The above call retrieves a menu in the location 'main_navigation_menu'

        var location = 0; // set a default location
        var menuLength = menu.length-1; // cause arrays start with 0

        angular.forEach(menu, function(value, key) { // loop through the menu items
            var url = value.url; // store the url of the current menu item
            if(url.indexOf(slug) > -1) { // check to see if the current menu item contains our page slug
                location = key; // if it does store the location of this menu item.
            }
        });

        // The below statements make it so the prev/next will repeat like a carousel.
        // if you just want the prev and next links just use:
        //
        // $scope.menunext = menu[location+1];
        // $scope.menuprev = menu[location-1];

        if(location == 0) { // If the menu item is at the start
            $scope.menunext = menu[location+1]; // make the next link the next menu item and pass to the view
            $scope.menuprev = menu[menuLength]; // make the prev link the last menu item and pass to the view

        } else if(location == menuLength) { // If the menu item is at the end
            $scope.menunext = menu[0]; // make the next link the first menu item and pass to the view
            $scope.menuprev = menu[location-1]; // make the prev link the previous menu item and pass to the view

        } else { // if it is somewhere in the middle
            $scope.menunext = menu[location+1]; // make the next link the next menu item and pass to the view
            $scope.menuprev = menu[location-1]; // make the prev link the previous menu item and pass to the view
        }
    });
});
