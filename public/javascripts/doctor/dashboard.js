const clinAlert = document
    .querySelector('#doc_main_container')
    .querySelector('.alert');

const filteredClinic = document.getElementById('filter_appointments_form');
var alertHidden = true;
const fetchConfig = {
    method: 'post',
    // req.body (in express) will be empty if I don't add these headers
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
};

const clinicInput = document.getElementById('clinic_input');

fetch('/affiliations', fetchConfig)
.then(r => r.json())
.then(clinics => {
    let html = '<option value="-1" disabled selected>Select Clinic</option>';
    clinics.forEach(clinic => {
        html += `<option value="${clinic.clinicId}">${clinic.clinic}</option>`;
    });
    clinicInput.innerHTML = html;
});