const clinAlert = document
    .querySelector('#doc_main_container')
    .querySelector('.alert');

const filteredClinic = document.getElementById('filter_appointments_form');
var alertHidden = true;
var filtered = false;

const appointments = [
    ['1', 'Civil Hospital', 'Hiba Jamal', 'Nov 8, 2018', '04:55', '05:30',
        "accepted", "01:00", 'null'],
    ['2', "Indus Hospital", "Faizan Boi", 'Apr 27, 2019', "04:55", "05:30",
        "new", "12:00", "null"],
    ['3', "AKUH", "Kainat Boi", "Apr 28, 2019", "04:55", "05:30",
        "new", "12:00", "null"],
    ['4', "Parklane", "Noosha Boi", "Apr 29, 2019", "04:55", "05:30",
        "new", "12:00", "null"],
    ['5', "Kiran Hospital", "Leena Boi", "Apr 30, 2019", "04:55", "05:30",
        "new", "12:00", "null"]
]

const fetchConfig = {
    method: 'post',
    // req.body (in express) will be empty if I don't add these headers
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
};

function showAlert(message) {
    clinAlert.querySelector('.alert_message').innerHTML = message;
    clinAlert.classList.remove('hide');
    alertHidden = false;
};


function hideAlert() {
    if (!alertHidden) {
        clinAlert.classList.add('hide');
        alertHidden = true;
    }
}

filteredClinic.addEventListener('submit', function (event) {
    event.preventDefault();
    const clinic_input = document.getElementById('clinic_input');
    const clinic_name = clinic_input.value;
    let exists = false;
    for (appointment in appointments) {
        if (appointments[appointment][1] == clinic_name)   // if clinic found in list
        {
            exists = true;
            filtered = true;
            break;
        }
    }
    if (exists) {
        hideAlert();
        const changeLater = document.querySelector('.appointments_later');
        let textLater = '';
        newLoopFiltered(clinic_name);
        todayLoopFiltered(clinic_name);
        tomorrowLoopFiltered(clinic_name);
        laterLoopFiltered(clinic_name);
    }
    else {
        showAlert('Please enter valid clinic/hospital name.');
    }
});


// change status of data entry
function statusChange(i, stat) {
    for (appointment in appointments) {
        if (appointments[appointment][0] == i)        // find id and replace status
        {
            const prevStatus = appointments[appointment][6];
            appointments[appointment][6] = stat;
            /* fetch func */
            fetch('/dashboard/filter/status', {
                ...fetchConfig,
                body: JSON.stringify({ appointment, stat })
            })
                .then(result => result.json()) // convert the response coming from server to javascript readable object
                .then(resultJson => {
                    if (resultJson.error) {
                        showAlert(resultJson.error);
                        // reverse the status in appointments array
                        appointments[appointment][6] = prevStatus;
                        return;
                    }
                });
            // once target status changed, break loop
            break;
        }
    }

    if (filtered) {
        const data = document.getElementById('clinics_list');
        const clinic_name = data.value;
        newLoopFiltered(clinic_name);
        todayLoopFiltered(clinic_name);
        tomorrowLoopFiltered(clinic_name);
        laterLoopFiltered(clinic_name);
    }
    else {
        newLoop();
        todayLoop();
        tomorrowLoop();
        laterLoop();
    }
}

// loop through entries with status as "new"
function newLoop() {
    const changeNew = document.querySelector('.appointments_new');
    let text = '';
    for (appointment in appointments) {
        if (appointments[appointment][6] == 'new') {
            text += `
            <div class="row">
                <div class="col-sm-1"> # ${appointments[appointment][0]}</div>
                <div class="col-sm-3"> ${appointments[appointment][2]}, ${appointments[appointment][1]}</div>
                <div class="col-sm-3"> ${appointments[appointment][3]}, ${appointments[appointment][4]} to ${appointments[appointment][5]}</div>
                <div class="col-sm-5">
                    <input type="button" class="btn btn-primary appointment_buttons" value="Accept" onclick="statusChange(`+ appointments[appointment][0] + `,'accepted')">
                    <input type="button" class="btn btn-danger appointment_buttons" value="Decline" onclick="statusChange(`+ appointments[appointment][0] + `,'declined')">
                    <input type="button" class="btn btn-primary appointment_buttons" value="Details">
                </div>
            </div>
            `;
        }
    }
    if (text != '') {
        changeNew.innerHTML = text;
    }
    else {
        changeNew.innerHTML = '<div class="text_centered">Nothing to show.</div>'
    }
}

// loop through entries with status new and clinic filter applied
function newLoopFiltered(clinicName) {
    const changeNew = document.querySelector('.appointments_new');
    let text = '';
    for (appointment in appointments) {
        if (appointments[appointment][6] == 'new' && appointments[appointment][1] == clinicName) {
            text += `
            <div class="row">
                <div class="col-sm-1"> # ${appointments[appointment][0]}</div>
                <div class="col-sm-3"> ${appointments[appointment][2]}</div>
                <div class="col-sm-3"> ${appointments[appointment][3]}, ${appointments[appointment][4]} to ${appointments[appointment][5]}</div>
                <div class="col-sm-5">
                    <input type="button" class="btn btn-primary appointment_buttons" value="Accept" onclick="statusChange(`+ appointments[appointment][0] + `,'accepted')">
                    <input type="button" class="btn btn-danger appointment_buttons" value="Decline" onclick="statusChange(`+ appointments[appointment][0] + `,'declined')">
                    <input type="button" class="btn btn-primary appointment_buttons" value="Details">
                </div>
            </div>
            `;
        }
    }
    if (text != '') {
        changeNew.innerHTML = text;
    }
    else {
        changeNew.innerHTML = '<div class="text_centered">Nothing to show.</div>';
    }
}

function todayLoop() {
    const changeToday = document.querySelector('.appointments_today');
    let text = '';
    for (appointment in appointments) {
        if (appointments[appointment][6] == 'accepted' && ifTodaysDate(appointments[appointment][3])) {
            text += `
            <div class="row">
                <div class="col-sm-1"> # ${appointments[appointment][0]}</div>
                <div class="col-sm-3"> ${appointments[appointment][2]}, ${appointments[appointment][1]}</div>
                <div class="col-sm-3"> ${appointments[appointment][3]}, ${appointments[appointment][4]} to ${appointments[appointment][5]}</div>
                <div class="col-sm-5">
                    <input type="button" class="btn btn-danger appointment_buttons" value="Done" onclick="statusChange(`+ appointments[appointment][0] + `,'done')">
                    <input type="button" class="btn btn-primary appointment_buttons" value="Details">
                </div>
            </div>
            `;
        }
    }
    if (text != '') {
        changeToday.innerHTML = text;
    }
    else {
        changeToday.innerHTML = '<div class="text_centered">Nothing to show.</div>';
    }
}

function todayLoopFiltered(clinicName) {
    const changeToday = document.querySelector('.appointments_today');
    let text = '';
    for (appointment in appointments) {
        if (appointments[appointment][6] == 'accepted' && appointments[appointment][1] == clinicName && ifTodaysDate(appointments[appointment][3])) {
            text += `
            <div class="row">
                <div class="col-sm-1"> # ${appointments[appointment][0]}</div>
                <div class="col-sm-3"> ${appointments[appointment][2]}</div>
                <div class="col-sm-3"> ${appointments[appointment][3]}, ${appointments[appointment][4]} to ${appointments[appointment][5]}</div>
                <div class="col-sm-5">
                    <input type="button" class="btn btn-danger appointment_buttons" value="Done" onclick="statusChange(`+ appointments[appointment][0] + `,'done')">
                    <input type="button" class="btn btn-primary appointment_buttons" value="Details">
                </div>
            </div>
            `;
        }
    }
    if (text != '') {
        changeToday.innerHTML = text;
    }
    else {
        changeToday.innerHTML = '<div class="text_centered">Nothing to show.</div>';
    }
}

function tomorrowLoop() {
    const changeTomorrow = document.querySelector('.appointments_tomorrow');
    let text = '';
    for (appointment in appointments) {
        if (appointments[appointment][6] == 'accepted' && ifTomorrowsDate(appointments[appointment][6])) {
            text += `
            <div class="row">
                <div class="col-sm-1"> # ${appointments[appointment][0]}</div>
                <div class="col-sm-3"> ${appointments[appointment][2]}, ${appointments[appointment][1]}</div>
                <div class="col-sm-3"> ${appointments[appointment][3]}, ${appointments[appointment][4]} to ${appointments[appointment][5]}</div>
                <div class="col-sm-5">
                    <input type="button" class="btn btn-primary appointment_buttons" value="Details">
                </div>
            </div>
            `;
        }
    }
    if (text != '') {
        changeTomorrow.innerHTML = text;
    }
    else {
        changeTomorrow.innerHTML = '<div class="text_centered">Nothing to show.</div>'
    }
}

function tomorrowLoopFiltered(clinicName) {
    const changeTomorrow = document.querySelector('.appointments_tomorrow');
    let text = '';
    for (appointment in appointments) {
        if (appointments[appointment][6] == 'accepted' && appointments[appointment][1] == clinicName && ifTomorrowsDate(appointments[appointment][6])) {
            text += `
            <div class="row">
                <div class="col-sm-1"> # ${appointments[appointment][0]}</div>
                <div class="col-sm-3"> ${appointments[appointment][2]}</div>
                <div class="col-sm-3"> ${appointments[appointment][3]}, ${appointments[appointment][4]} to ${appointments[appointment][5]}</div>
                <div class="col-sm-5">
                    <input type="button" class="btn btn-primary appointment_buttons" value="Details">
                </div>
            </div>
            `;
        }
    }
    if (text != '') {
        changeTomorrow.innerHTML = text;
    }
    else {
        changeTomorrow.innerHTML = '<div class="text_centered">Nothing to show.</div>'
    }
}

function laterLoop() {
    const changeLater = document.querySelector('.appointments_later');
    let text = '';
    for (appointment in appointments) {
        if (appointments[appointment][6] == 'accepted' && ifLatersDate(appointments[appointment][3])) {
            text += `
            <div class="row">
                <div class="col-sm-1"> # ${appointments[appointment][0]}</div>
                <div class="col-sm-3"> ${appointments[appointment][2]}, ${appointments[appointment][1]}</div>
                <div class="col-sm-3"> ${appointments[appointment][3]}, ${appointments[appointment][4]} to ${appointments[appointment][5]}</div>
                <div class="col-sm-5">
                    <input type="button" class="btn btn-primary appointment_buttons" value="Details">
                </div>
            </div>
            `;
        }
    }
    if (text != '') {
        changeLater.innerHTML = text;
    }
    else {
        changeLater.innerHTML = '<div class="text_centered">Nothing to show.</div>'
    }
}

function laterLoopFiltered(clinicName) {
    const changeLater = document.querySelector('.appointments_later');
    let text = '';
    for (appointment in appointments) {
        if (appointments[appointment][6] == 'accepted' && appointments[appointment][1] == clinicName && ifLatersDate(appointments[appointment][3])) {
            text += `
            <div class="row">
                <div class="col-sm-1"> # ${appointments[appointment][0]}</div>
                <div class="col-sm-3"> ${appointments[appointment][2]}</div>
                <div class="col-sm-3"> ${appointments[appointment][3]}, ${appointments[appointment][4]} to ${appointments[appointment][5]}</div>
                <div class="col-sm-5">
                    <input type="button" class="btn btn-primary appointment_buttons" value="Details">
                </div>
            </div>
            `;
        }
    }
    if (text != '') {
        changeLater.innerHTML = text;
    }
    else {
        changeLater.innerHTML = '<div class="text_centered">Nothing to show.</div>'
    }
}

function ifTodaysDate(date) {
    var datee = new Date(date);
    var today = new Date();
    today.setDate(today.getDate());
    if (datee.getDate() == today.getDate() && datee.getMonth() == today.getMonth() && datee.getFullYear() == today.getFullYear()) {
        return true;
    }
    else {
        return false;
    }
}

function ifTomorrowsDate(date) {
    var datee = new Date(date);
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (datee.getDate() == tomorrow.getDate() && datee.getMonth() == tomorrow.getMonth() && datee.getFullYear() == tomorrow.getFullYear()) {
        return true;
    }
    else {
        return false;
    }
}

function ifLatersDate(date) {
    var datee = new Date(date);
    var later = new Date();
    later.setDate(later.getDate() + 1);
    if (datee > later) {
        return true;
    }
    else {
        return false;
    }
}