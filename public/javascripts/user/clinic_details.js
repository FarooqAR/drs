const fetchConfig = {
  method: 'post',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
};

fetch(`/clinics/${clinicId}/doctors`, {
  ...fetchConfig,
  method: 'get'
})
  .then(result => result.json())
  .then(resultJson => {
    let doctorsHtml = '';
    let doctors = resultJson[0] || [];
    if (doctors.length > 0) {
      doctors.forEach(doctor => {
        doctorsHtml += `
        <div class='container_flex'>
          <a href='/doctors/${doctor.doctorId}' class='flex_2'>Dr. ${doctor.fName} ${doctor.lName}</a>
          <span class='flex_1'>${doctor.role}</span>
          <a href='/appointments/create/${doctor.doctorId}/${clinicId}'>Appoint</a>
        </div>
      `;
      });
    }
    else
      doctorsHtml = 'No doctors';
    document.querySelector('.doctors').innerHTML = doctorsHtml;
  })
  .catch(err => document.querySelector('.doctors').innerHTML = 'Error loading');

