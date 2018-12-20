const doctor_checkbox = document.querySelector('input[name=filter_doctors]');
var doctor_checkboxCLICKED = false;

const doctor_role_checkbox = document.querySelector('input[name=filter_doctor_role]');
var doctor_role_checkboxCLICKED = false;

const date_checkbox = document.querySelector('input[name=filter_date]');
var date_checkboxCLICKED = false;

const clinics_checkbox = document.querySelector('input[name=filter_clinics]');
var clinics_checkboxCLICKED = false;

const doctors_input = document.querySelector('input[name=search_doctors]');
const roles_input = document.querySelector('input[name=search_roles]');
const clinics_input = document.querySelector('input[name=search_clinics]');
const date_input = document.querySelector('input[name=select_date]');

var alertHidden = true;

var filterAlert = document.querySelector(".alert");

var fetchConfig = {
  method: 'post',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
};

var locations = [];
var map;
var markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: { lat: 24.8607, lng: 67.0011 }
  });
}

function addPlaces(filters) {
  /* fetch func */
  fetch('/clinics', {
    ...fetchConfig,
    body: JSON.stringify(filters)
  })
    .then(result => result.json())
    .then(resultJson => {
      if (resultJson.length != 0) {
        locations = resultJson;
        // get the list, pass to function to set markers
        placeMarkers(locations);
      }
      else {
        showAlert('We\'re sorry, we couldn\'t find anything that suits your requirements.')
      }
    })
    .catch(err => showAlert(err));
}

function placeMarkers(locations) {
  var bounds = new google.maps.LatLngBounds();
  var pos;
  var place;
  var placeId;

  // clear pre-existing markers
  clearMarkers();

  for (i = 0; i < locations.length; i++) {
    pos = new google.maps.LatLng(locations[i][1], locations[i][2]);
    place = locations[i][0];
    placeId = locations[i][3];
    markers[i] = new google.maps.Marker({
      map: map,
      draggable: false,
      animation: google.maps.Animation.DROP,
      position: pos
    });

    createInfoWindow(markers[i], place, placeId);

    bounds.extend(pos); // extend map bounds to fit location
    markers[i].setMap(map); // set marker onto map
  }

  map.fitBounds(bounds);
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

function createInfoWindow(marker, place, placeId) {
  google.maps.event.addListener(marker, 'click', function () {
    infoWindow = new google.maps.InfoWindow();
    infoWindow.setContent('<a href="clinics/'+placeId+'">' + place + '</a>');
    infoWindow.open(map, this);
  });
}

doctor_checkbox.addEventListener('change', function (e) {
  if (doctor_checkbox.checked) {
    doctor_checkboxCLICKED = true;
    console.log('doc_clicked')
    // since doctor specified, role becomes apparent
    if (doctor_role_checkbox.disabled == false || clinics_checkbox.disabled == false) {
      doctor_role_checkbox.disabled = true;
      clinics_checkbox.disabled = true;
    }
  }
  else {
    doctor_checkboxCLICKED = false;
    if (doctor_role_checkbox.disabled || clinics_checkbox.disabled) {
      doctor_role_checkbox.disabled = false;
      clinics_checkbox.disabled = false;
    }
  }
})

doctor_role_checkbox.addEventListener('change', function (e) {
  if (doctor_role_checkbox.checked) {
    doctor_role_checkboxCLICKED = true;
    console.log('rol_clicked')
    // since role specified, doctor becomes apparent
    if (doctor_checkbox.disabled == false) {
      doctor_checkbox.disabled = true;
    }
  }
  else {
    doctor_role_checkboxCLICKED = false;
    if (doctor_checkbox.disabled) {
      doctor_checkbox.disabled = false;
    }
  }
})

clinics_checkbox.addEventListener('change', function (e) {
  if (clinics_checkbox.checked) {
    clinics_checkboxCLICKED = true;
    console.log('clin_clicked');
    if (doctor_checkbox.disabled == false) {
      doctor_checkbox.disabled = true;
    }
  }
  else {
    clinics_checkboxCLICKED = false;
    if (doctor_checkbox.disabled) {
      doctor_checkbox.disabled = false;
    }
  }
})

date_checkbox.addEventListener('change', function (e) {
  if (date_checkbox.checked) {
    console.log('date_clicked')
    date_checkboxCLICKED = true;
  }
  else {
    date_checkboxCLICKED = false;
  }
})

function filter_search() {
  if ((doctor_checkboxCLICKED && doctors_input.value.length == 0) ||
    (clinics_checkboxCLICKED && clinics_input.value.length == 0) ||
    (doctor_role_checkboxCLICKED && roles_input.value.length == 0) ||
    (date_checkboxCLICKED && date_input.value.length == 0)) {
    showAlert('One or more required fields missing.');
  }
  else {
    hideAlert();
    var filters = [];

    // add selections
    if (clinics_checkboxCLICKED) {
      filters.push(clinics_input.value);
    }
    else {
      filters.push(false);
    }
    if (doctor_checkboxCLICKED) {
      filters.push(doctors_input.value);
    }
    else {
      filters.push(false);
    }
    if (doctor_role_checkboxCLICKED) {
      filters.push(roles_input.value);
    }
    else {
      filters.push(false);
    }
    if (date_checkboxCLICKED) {
      filters.push(date_input.value);
    }
    else {
      filters.push(false);
    }
    addPlaces(filters);
  }
}

function showAlert(message) {
  filterAlert.querySelector('.alert_message').innerHTML = message;
  filterAlert.classList.remove('hide');
  alertHidden = false;
};


function hideAlert() {
  if (!alertHidden) {
    filterAlert.classList.add('hide');
    alertHidden = true;
  }
}