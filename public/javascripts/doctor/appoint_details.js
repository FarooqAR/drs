const fetchConfig = {
  method: 'post',
  // req.body (in express) will be empty if I don't add these headers
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
};

const rejectBtn = document.querySelector('.reject_btn');
const acceptBtn = document.querySelector('.accept_btn');
const doneBtn = document.querySelector('.done_btn');
const appointmentId = document.getElementById('appointmentId').value;
const statusEl = document.getElementById('status');

rejectBtn.addEventListener('click', changeStatus('rejected'));
acceptBtn.addEventListener('click', changeStatus('pending'));
doneBtn.addEventListener('click', changeStatus('done'));

function changeStatus(status) {
  return function (e) {
    fetch(`/appointments/${appointmentId}/change_status`, 
    {...fetchConfig, body:JSON.stringify({status})})
    .then(r => r.json())
    .then(result => {
      statusEl.innerText = status;
      statusEl.className = status;
    })
    .catch(e => console.log(e));
  };
}

