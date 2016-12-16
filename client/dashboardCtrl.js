angular.module('myApp').controller('dashboardController',
	['$scope', 'AuthService', '$http', '$timeout', '$location', function($scope, AuthService, $http, $timeout, $location){
	$scope.createHangout = function(){
		AuthService.createHangout(
			$scope.hangoutForm.name,
			$scope.hangoutForm.startDate,
			$scope.hangoutForm.endDate,
			$scope.hangoutForm.invited,
			$scope.place,
			$scope.latLong
		).then(function(response){
       $('#myModal').modal('toggle');
        console.log(response.data._id);
        $timeout(function(){$location.path('/calendar/' + response.data._id);}, 1000);
      });
    
     // how to grab the hangouts id and location.path change?
		
	};
	$scope.showHangouts = function(){
		$http({
			url: '/user/hangouts',
			method: 'GET'
		}).then(function(response){
			$scope.results = response.data;
			console.log(response.data);
		
		});
	};
 
	//trying to add maps here:
	$scope.initMap = function() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 33.9932485, lng: -117.9266394},
    zoom: 13
  });

  var input = document.getElementById('pac-input');

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: map
  });
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    var place = autocomplete.getPlace();
    console.log(place.place_id);
   
    
    $scope.place = place.place_id;
    if (!place.geometry) {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
      console.log(place.geometry);
      $scope.latLong = place.geometry.location;
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
       console.log(place.geometry.location);
       $scope.latLong = place.geometry.location;
    }

    // Set the position of the marker using the place ID and location.
    marker.setPlace({
      placeId: place.place_id,
      location: place.geometry.location
    });
    marker.setVisible(true);

    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
        'Place ID: ' + place.place_id + '<br>' +
        place.formatted_address);
    infowindow.open(map, marker);
  });

};
$scope.showMap = function(){
$timeout($scope.initMap, 1000);
};	
}]);