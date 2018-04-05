var map;
var infowindow;
var radius = 1000;

available_places = [
    ['ATM', 'atm'],
    ['Banks', 'bank'],
    ['Schools', 'school'],
    ['Theatre', 'movie_theater'],
    ['Parks', 'park'],
    ['Hotels', 'lodging'],
    ['Temples', 'place_of_worship'],
    ['Hospitals', 'hospital'],
    ['Pharmacy', 'pharmacy'],
    ['Bus Stops', 'bus_station'],
    ['Train Stations', 'train_station'],
    ['Petrol Pumps', 'gas_station'],
    ['Airport', 'airport'],
    ['Supermarket', 'grocery_or_supermarket'],
    ['Markets', 'department_store'],
    ['Malls', 'shopping_mall'],
    ['Restaurants', 'restaurant']
];

var amneties = [];

$(document).ready(function() {
    var x = '';
    for (var i = 0; i < available_places.length; i++) {
        x += "<button  class='my_button btn btn-primary btn-lg gradient' value='" + i.toString() + "'>" + available_places[i][0] + "</button>";
    }
    $('#floating-panel').html(x);

    $.getJSON("amneties.json", function(json) {
        console.log(json);
        amneties = json;
        console.log(amneties[0][0]);
    });
    google.maps.event.addDomListener(window, 'load', initialize);

    function initialize() {
        var input = document.getElementById('pac-input');
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.addListener('place_changed', function() {
            var place = autocomplete.getPlace();
            lat = place.geometry['location'].lat();
            long = place.geometry['location'].lng();
            p = '0';
            displayMap(lat, long, available_places[0][1]);
        });
    }
});


var p = '0';
var b = 0;
var lat = 17.4400802;
var long = 78.34891679999998;

function displayMap(lat, long, type) {
    var pyrmont = {
        lat: lat,
        lng: long
    };
    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 14
    });
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: pyrmont,
        radius: radius,
        type: type,
    }, callback);
}


function initMap() {

    $('select').on('change', function() {
        b = this.value;
        p = '0';
        console.log(this.value);
        for (var i = 0; i < amneties.length; i++) {
            if (amneties[i][0] === locations[b][0]) {
                var ans = amneties[i][1];
                console.log(ans);
            }
        }
        displayMap(lat, long, available_places[0][1]);
    });


    $('.my_button').click(function() {
        var a = $(this).attr("value");
        p = a;
        displayMap(lat, long, available_places[parseInt(a)][1]);
    });
    displayMap(lat, long, available_places[0][1]);
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        $('#results').html("<h3>" + results.length.toString() + " " + available_places[parseInt(p)][0] + " Found Nearby" + "</h3>");
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    } else {
        $("#results").html("<h3>No " + available_places[parseInt(p)][0] + " Found Nearby");
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}