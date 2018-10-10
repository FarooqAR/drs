/*
doctor/settings.js 
*/
const fetchConfig = {
  method: 'post',
  // req.body (in express) will be empty if I don't add these headers
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
};
var alertHidden = true; // there will be only one alert in whole settings page
const form_qualification = document.getElementById('form_qualification');
const alert = document.querySelector('.alert');

// hide the alert if user starts typing in any input field in settings page
document.querySelectorAll('input').forEach(function (el) {
  el.addEventListener('change', function () {
    if (!alertHidden)
      hideAlert();
  })
})

// submit listener for the first form (add qualification) 
form_qualification.addEventListener('submit', function (event) {
  event.preventDefault();
  const data = serialize(  // get all the fields (3) for qualification
    document.getElementById('form_qualification'),
    { hash: true }
  );
  const qualification = data.qualification; // [college, degree, year]
  addQualification(qualification);
});

function showAlert(message) {
  alert.querySelector('.alert_message').innerHTML = message;
  alert.classList.remove('hide');
  alertHidden = false;
}
function hideAlert() {
  alert.classList.add('hide');
  alertHidden = true;
}
function clearQualificationFields() {
  document.getElementById('form_qualification')
  .querySelectorAll("input[type='text']")
  .forEach(el => {
    el.value = '';
  });
}
function renderQualifications(qualifications) {
  const qualifications_list = document.querySelector('.qualifications_list');
  let html = '';
  qualifications.forEach(function (qualification) {
    const id = qualification[0];
    const college = qualification[1];
    const degree = qualification[2];
    const year = qualification[3];
    html += `
    <div class="qualification container_flex text_centered items_centered">
      <div class="qualification_college flex_1">${college}</div>
      <div class="qualification_degree flex_1">${degree}</div>
      <div class="qualification_year flex_1">${year}</div>
      <div class="controls flex_1">
        <button class="btn" onclick="editQualification(${id})">Edit</button><span> </span>
        <button class="btn btn-danger" onclick="deleteQualification(${id})">Delete</button>
      </div>
    </div>
    `;
  });
  qualifications_list.innerHTML = html;
}
function addQualification(qualification) {
  // show error if one of the fields is missing
  if (qualification.length != 3) {
    showAlert('Qualification: Missing one or more fields');
    return;
  }
  // request server to add qualification to database
  fetch('/settings/add/qualification', {
    ...fetchConfig, // add all the properties from fetchConfig in this object
    body: JSON.stringify(qualification) // convert array to string since body only accept a string to be sent
  })
    .then(result => result.json()) // convert the response coming from server to javascript readable object
    .then(resultJson => {
      if (resultJson.error) {
        showAlert('Qualification: ' + resultJson.error);
        return;
      }
      // show the list of qualifications if no error occurred
      renderQualifications(resultJson.qualifications);
      clearQualificationFields();
    });

}
function editQualification(id) {
  console.log('edit', id);
}
function deleteQualification(id) {
  fetch('/settings/delete/qualification', {
    ...fetchConfig,
    body: JSON.stringify({ id })
  })
    .then(result => result.json()) // convert the response coming from server to javascript readable object
    .then(resultJson => {
      if (resultJson.error) {
        showAlert('Qualification: ' + resultJson.error);
        return;
      }
      // show the list of qualifications if no error occurred
      renderQualifications(resultJson.qualifications);
    });
}
