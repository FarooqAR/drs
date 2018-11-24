var marker;
var setCentre;
var proceed = false;
var alertHidden = true;
var x = 0;
var y = 0;
var proceedAlert = document.querySelector(".alert");

var fetchConfig = {
  method: 'post',
  headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
  },
};

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {lat: 24.8928, lng:  67.0755}
    });

    var input = document.getElementById('map_input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
        });
    
    var markers = [];
      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
          }
        // get rid of previous markers if on map
        markers.forEach(function(m) {
          m.setMap(null);
        });
        markers = [];
          
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
        // set bounds to matching places so user can reposition in their desired area
            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }

        setCentre = place;    // get a valid place in suggestions so user can reposition only that one marker
        return setCentre;
        });

        marker = new google.maps.Marker({
            map: map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: setCentre.geometry.location
            }); 

        markers.push(marker);
        showLocation(marker.getPosition());
        google.maps.event.addListener(marker, "drag", function(e){
            showLocation(marker.getPosition());  // get moving marker position
            });
          map.fitBounds(bounds);        // fit map to cover suggestions area
        });
}

function showLocation(position)
{
  x = position.lat().toFixed(3);
  y = position.lng().toFixed(3);
  var insert = document.getElementById("show_position");
   if (insert.firstChild){
     insert.removeChild(insert.firstChild);
   }
  var locationText = 'Lat:  '+x+',  Lon: '+y;
  var child = document.createTextNode(locationText);
  insert.appendChild(child);
  proceed = true;
}

function Proceed(){
  if (proceed){
    hideAlert();
    /* fetch func */
    fetch('/settings/location', {
      ...fetchConfig,
      body: JSON.stringify({ x, y })
    })
  }
  else{
    showAlert("Please set location.");
  }
}

function showAlert(message) {
  proceedAlert.querySelector('.alert_message').innerHTML = message;
  proceedAlert.classList.remove('hide');
  alertHidden = false;
};


function hideAlert() {
  if (!alertHidden) {
    proceedAlert.classList.add('hide');
    alertHidden = true;
  }
}