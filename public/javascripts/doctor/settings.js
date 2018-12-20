/*
doctor/settings.js 
*/

// fetchConfig are additional options to be sent with post requests 
const fetchConfig = {
  method: 'post',
  // req.body (in express) will be empty if I don't add these headers
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
};
const alertHidden = [true, true]; // [alertQualHidden, alertClinicHidden]
fetchAndRenderColleges();
fetchAndRenderDegrees();
fetchAndRenderQualifications();
fetchAndRenderClinics();
fetchAndRenderRoles();
fetchAndRenderAffiliations();
const formQual = document.getElementById('form_qualification');
const formClinic = document.getElementById('form_clinic');
// error alert for qualification form
const qualAlert = document
  .querySelector('.qualifications_container')
  .querySelector('.alert');
// error alert for clinic form
const clinicAlert = document
  .querySelector('.clinics_container')
  .querySelector('.alert');
// add both alerts to an array so we only have to use one generic function to show either of them
const alerts = [qualAlert, clinicAlert];
// timings for current clinic (that hasn't yet been added)
const currentClinicTimings = [
  // [id, day, timing_from, timing_to]
];
// hide the qualAlert if user starts typing in any input field in formQual
formQual.querySelectorAll('select').forEach(function (el) {
  el.addEventListener('change', function () {
    if (!alertHidden[0])
      hideAlert(0);
  })
});
// hide the clinicAlert if user starts typing in any input field in formClinic
formClinic.querySelectorAll('select').forEach(function (el) {
  el.addEventListener('change', function () {
    if (!alertHidden[1])
      hideAlert(1);
  })
});
formClinic.querySelectorAll('input').forEach(function (el) {
  el.addEventListener('change', function () {
    if (!alertHidden[1])
      hideAlert(1);
  })
});

// submit listener for formQual 

// ISMEN YEH HORAHA HAI K JESE HAI 
formQual.addEventListener('submit', function (event) {
  event.preventDefault();
  const data = serialize(  // get all the fields (3) for qualification
    document.getElementById('form_qualification'),
    { hash: true }
  );
  const qualification = data.qualification; // [college, degree, year]
  addQualification(qualification);
});

// submit listener for formClinic  
formClinic.addEventListener('submit', function (event) {
  event.preventDefault();
  const data = serialize(
    formClinic,
    { hash: true }
  );
  const clinic = [data.clinic_name, data.clinic_role];
  addAffiliation(clinic);
});

function showAlert(message, i) {
  alerts[i].querySelector('.alert_message').innerHTML = message;
  alerts[i].classList.remove('hide');
  alertHidden[i] = false;
}

function hideAlert(i) {
  alerts[i].classList.add('hide');
  alertHidden[i] = true;
}

function clearQualificationFields() {
  formQual.querySelector('#colleges_list').value = '-1';
  formQual.querySelector('#degrees_list').value = '-1';
}
function fetchAndRenderColleges() {
  fetch('/qualification/colleges', {
    ...fetchConfig,
    method: 'get'
  })
    .then(result => result.json())
    .then(colleges => {
      let html = `<option value="-1" disabled selected>Select College</option>`;
      html += colleges.map(college =>
        `<option value='${college.collegeId}'>${college.name}</option>`)
        .join('');

      document.getElementById('colleges_list').innerHTML = html;

    }).catch(e => console.log(e))
}
function fetchAndRenderDegrees() {
  fetch('/qualification/degrees', {
    ...fetchConfig,
    method: 'get'
  })
    .then(result => result.json())
    .then(degrees => {
      let html = `<option value="-1" disabled selected>Select Degree</option>`;
      html += degrees.map(degree =>
        `<option value='${degree.degreeId}'>${degree.name}</option>`)
        .join('');

      document.getElementById('degrees_list').innerHTML = html;

    }).catch(e => console.log(e))
}
function fetchAndRenderQualifications(qualifications) {
  fetch('/qualification', {
    ...fetchConfig,
    method: 'get'
  })
    .then(result => result.json())
    .then(qualifications => {
      const qualList = document.querySelector('.qualifications_list');
      let html = '';
      qualifications.forEach(function (qualification) {
        const { doctorQualificationId, college, degree, year } = qualification;
        html += `
      <div class="qualification container_flex text_centered items_centered">
        <div class="qualification_college flex_1">${college}</div>
        <div class="qualification_degree flex_1">${degree}</div>
        <div class="qualification_year flex_1">${year}</div>
        <div class="controls flex_1">
          <button class="btn btn-danger" onclick="deleteQualification(${doctorQualificationId})">Delete</button>
        </div>
      </div>
      `;
      });
      qualList.innerHTML = html; // render qualifications on screen
    }).catch(e => console.log(e))
}
function fetchAndRenderClinics() {
  fetch('/clinics', {
    ...fetchConfig,
    method: 'get'
  })
    .then(result => result.json())
    .then(clinics => {
      let html = `<option value="-1" disabled selected>Select Clinic</option>`;
      html += clinics.map(clinic =>
        `<option value='${clinic.clinicId}'>${clinic.name}</option>`)
        .join('');

      document.getElementById('all_clinics_list').innerHTML = html;
    })
}
function fetchAndRenderRoles() {
  fetch('/roles', {
    ...fetchConfig,
    method: 'get'
  })
    .then(result => result.json())
    .then(roles => {
      let html = `<option value="-1" disabled selected>Select Role</option>`;
      html += roles.map(role =>
        `<option value='${role.roleId}'>${role.name}</option>`)
        .join('');

      document.getElementById('roles_list').innerHTML = html;
    })
}
function addQualification(qualification) {
  // show error if one of the fields is missing
  if (qualification.length != 3 || qualification.indexOf("-1") > -1) {
    showAlert('Missing one or more fields', 0);
    return;
  }
  // request server to add qualification to database
  fetch('/settings/add/qualification', {
    ...fetchConfig,
    body: JSON.stringify(qualification)
  })
    .then(result => result.json()) // convert the response coming from server to javascript readable object
    .then(resultJson => {
      if (resultJson.error) {
        showAlert(resultJson.error, 0);
        return;
      }
      // show the list of qualifications if no error occurred
      fetchAndRenderQualifications();
      clearQualificationFields();
    });

}
function deleteQualification(id) {
  fetch('/settings/delete/qualification', {
    ...fetchConfig,
    body: JSON.stringify({ id })
  })
    .then(result => result.json())
    .then(resultJson => {
      if (resultJson.error) {
        showAlert(resultJson.error, 0);
        return;
      }
      if (resultJson.doctorQualificationId == id) {
        fetchAndRenderQualifications();
      }
      // show the list of qualifications if no error occurred
      //    renderQualifications(resultJson.qualifications);
    });
}
function addAffiliation(clinic) {
  // clinic[0]: clinic name, 
  // clinic[1]: role; will be -1 if none selected 
  if (!clinic[0] || !clinic[1] || clinic[1] == '-1') {
    showAlert('Missing clinic name or role', 1);
    return;
  }
  // if timings were not provided 
  if (currentClinicTimings.length == 0) {
    showAlert('Provide your timings', 1);
    return;
  }
  fetch('/settings/add/affiliation', {
    ...fetchConfig,
    body: JSON.stringify({ clinic, timings: currentClinicTimings }) // convert array to string since body only accept a string to be sent
  })
    .then(result => result.json()) // convert the response coming from server to javascript readable object
    .then(resultJson => {
      if (resultJson.error) {
        showAlert(resultJson.error, 1);
        return;
      }
      fetchAndRenderAffiliations();
      // remove all the timings from currentClinicTimings
      let i = 0;
      while (currentClinicTimings.length > 0)
        removeCurrentClinicTiming(i++);

      clearClinicFields();
    }).catch(e => console.log(e));
}

function deleteClinic(doctorClinicId) {
  fetch('/settings/delete/clinic', {
    ...fetchConfig, // add all the properties from fetchConfig in this object
    body: JSON.stringify({ doctorClinicId }) // convert array to string since body only accept a string to be sent
  })
    .then(result => result.json()) // convert the response coming from server to javascript readable object
    .then(resultJson => {
      console.log(resultJson);
      if (resultJson.error) {
        showAlert(resultJson.error, 1);
        return;
      }
      // show the list of clinics if no error occurred
      fetchAndRenderAffiliations();
      clearClinicFields();
    });
}
// addClinicTiming() DOES NOT add timings to database
// addClinicTiming() adds timing (from the fields) to currentClinicTimings
function addClinicTiming() {
  const timingDay = document.getElementById('timing_day').value;
  const timingTimeFrom = document.getElementById('timing_time_from').value;
  const timingTimeTo = document.getElementById('timing_time_to').value;

  if (!timingDay || !timingTimeFrom || !timingTimeTo || timingDay == '-1') {
    showAlert('Timings: Missing one the fields', 1);
    return;
  }
  if (timingTimeFrom >= timingTimeTo) {
    showAlert('Timings: Invalid range', 1);
    return;
  }
  currentClinicTimings.push([
    currentClinicTimings.length,
    timingDay,
    timingTimeFrom,
    timingTimeTo
  ]);
  renderCurrentClinicTimings();
  clearClinicTimingFields();
}
function fetchAndRenderAffiliations() {
  fetch('/affiliations', {
    ...fetchConfig,
  })
    .then(result => result.json())
    .then(affiliations => {
      const clinicsList = document.querySelector('.clinics_list');
      let html = '';
      affiliations.forEach(aff => {
        html += `
        <div class="clinic">
          <div class="container_flex">
            <div class="flex_3">
              <div> <strong>Clinic/Hospital: </strong><span>${aff.clinic}</span></div>
              <div> <strong>Role: </strong><span>${aff.role}</span></div>
            </div>
            <div class="flex_1 text_right">
              <input class="btn btn-danger" onclick="deleteClinic(${aff.doctorClinicId})" type="button" value="Delete" />
            </div>
          </div>
          <div>
            <strong>Timings: </strong>
            <div id="timings_${aff.doctorClinicId}"></div>
          </div>
        </div>`
        
        fetch('/timings', {
          ...fetchConfig,
          body: JSON.stringify({ doctorClinicId: aff.doctorClinicId })
        })
          .then(result => result.json())
          .then(timings => {
            let timingsHtml = '';
            timings.forEach(t => {
              timingsHtml += `
              <div class="container_flex clinic_timing_item items_centered">
                <div class="flex_1">${t.day}</div>
                <div class="flex_3 text_centered">${t.from} to ${t.to}</div>
                <div class="flex_1 text_right">
                  <input type="button" disabled class="btn" onclick="removeClinicTiming(${t.doctorTimingId})" value="&times;">
                </div>
              </div>
            `;
            })
            document.getElementById(`timings_${aff.doctorClinicId}`).innerHTML = timingsHtml;
          })
      });
      clinicsList.innerHTML = html;
    })

}
function removeClinicTiming(clinicId, timingId) {
  fetch('/settings/delete/clinic_timing', {
    ...fetchConfig, // add all the properties from fetchConfig in this object
    body: JSON.stringify({ clinicId, timingId }) // convert array to string since body only accept a string to be sent
  })
    .then(result => result.json()) // convert the response coming from server to javascript readable object
    .then(resultJson => {
      if (resultJson.error) {
        showAlert(resultJson.error, 1);
        return;
      }
      // show the list of clinics if no error occurred
      renderClinics(resultJson.clinics);
    });
}
function renderCurrentClinicTimings() {
  const currentClinicTimingsList = document.querySelector('.current_clinic_timings_list');
  let html = '';
  let i = 0;
  currentClinicTimings.forEach(function (timing) {
    let timingId = timing[0];
    let timingDay = timing[1];
    let timingFrom = timing[2];
    let timingTo = timing[3];
    html += `
    <div class="container_flex clinic_timing_item items_centered">
      <div class="flex_1">${timingDay}</div>
      <div class="flex_3 text_centered">${timingFrom} to ${timingTo}</div>
      <div class="flex_1 text_right">
        <input type="button" class="btn" onclick="removeCurrentClinicTiming(${timingId})" value="&times;">
      </div>
    </div>
    `;
    i++;
  })
  currentClinicTimingsList.innerHTML = html;
}
function removeCurrentClinicTiming(i) {
  currentClinicTimings.splice(i, 1);
  renderCurrentClinicTimings();
}
function clearClinicTimingFields() {
  document.getElementById('timing_time_from').value = '';
  document.getElementById('timing_time_to').value = '';
  document.getElementById('timing_day').value = '-1';
}

function clearClinicFields() {
  formClinic.querySelector('#all_clinics_list').value = '-1';
  formClinic.querySelector('#roles_list').value = '-1';
  clearClinicTimingFields();
}