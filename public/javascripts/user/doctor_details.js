const fetchConfig = {
  method: 'post',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
};

fetch(`/doctors/${doctorId}/clinics`, {
  ...fetchConfig,
  method: 'get'
})
  .then(result => result.json())
  .then(resultJson => {
    let clinicsHtml = '';
    let clinics = resultJson[0] || [];
    if (clinics.length > 0) {
      clinics.forEach(clinic => {
        clinicsHtml += `
        <div class='container_flex'>
          <a href='/clinics/${clinic.clinicId}' class='flex_2'>${clinic.clinicName}</a>
          <span class='flex_1'>${clinic.role}</span>
          <a href='/appointments/create/${doctorId}/${clinic.clinicId}'>Appoint</a>
        </div>
      `;
      });
    }
    else
      clinicsHtml = 'No clinics';
    document.querySelector('.clinics').innerHTML = clinicsHtml;
  })
  .catch(err => document.querySelector('.clinics').innerHTML = 'Error loading');

fetch(`/doctors/${doctorId}/qualifications`, {
  ...fetchConfig,
  method: 'get'
})
  .then(result => result.json())
  .then(resultJson => {
    let qualsHtml = '';
    let qualifications = resultJson[0] || [];
    if (qualifications.length > 0) {
      qualsHtml += `
          <div class='container_flex'>
            <span class='flex_2'><strong>College</strong></span>
            <span class='flex_1'><strong>Degree</strong></span>
            <span><strong>Year</strong></span>            
          </div>
        `;
      qualifications.forEach(qual => {
        qualsHtml += `
          <div class='container_flex'>
            <span class='flex_2'>${qual.college}</span>
            <span class='flex_1'>${qual.degree}</span>
            <span>${qual.year}</span>            
          </div>
        `;
      });
    }
    else
      qualsHtml = 'No qualifications';
    document.querySelector('.qualifications').innerHTML = qualsHtml;
  })
  .catch(err => document.querySelector('.qualifications').innerHTML = 'Error loading');

  fetch(`/doctors/${doctorId}/reviews`, {
    ...fetchConfig,
    method: 'get'
  })
    .then(result => result.json())
    .then(resultJson => {
      let reviewsHtml = '';
      let reviews = resultJson[0] || [];
      if (reviews.length > 0) {
        reviews.forEach(review => {
          reviewsHtml += `
            <div class='review_container'>
              <div class="review">${review.text}</div>            
            </div>
          `;
        });
      }
      else
        reviewsHtml = 'No reviews';
      document.querySelector('.reviews').innerHTML = reviewsHtml;
    })
    .catch(err => document.querySelector('.qualifications').innerHTML = 'Error loading');