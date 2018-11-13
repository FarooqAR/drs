const dateAlert = document
  .querySelector('#appoint_history_container')
  .querySelector('.alert');

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

let alertHidden = true;

    function showAlert(message) {
        dateAlert.querySelector('.alert_message').innerHTML = message;
        dateAlert.classList.remove('hide');
        alertHidden = false;
      };
    
      
function hideAlert() {
        if (!alertHidden)
        {
        dateAlert.classList.add('hide');
        alertHidden = true;
        }
    };

const formSearch = document.getElementById('form_search')
const sortBy = document.getElementById('sort_by_order')
let originalHistoryIsRendered = true;
let filteredHistoryIsRendered = false;
const qualAlert = document
    .getElementById('appoint_history_container')
    .querySelector('.alert');

let filteredHistory = [];
let originalHistory = [];

fetch('/history', {
    ...fetchConfig,

})
    .then(result => result.json())
    .then(resultJson => {
        originalHistory = resultJson;
        renderAppointments(resultJson);
        //console.log(resultJson)
        //clearQualificationFields();
    });

function renderAppointments(appointments) {
    const appointList = document.querySelector('.history_list');
    let html = '';
    appointments.forEach(function (appointment) {
        const id = appointment[0];
        const name = appointment[2];
        const date = appointment[3];
        const clinic = appointment[1];
        const from = appointment[4];
        const to = appointment[5];
        const rating = appointment[8]
        html += `
        <div class="appointment">
            <div class="container_flex">
                <div class="flex_1"> <strong>${id}</strong></div>
                <div class="flex_1"> <span>${name}</span></div>
                <div class="flex_1 text_right"><strong>Date: </strong><span>${date}</span></div>
            </div>
            <div class="container_flex">
                <div class="flex_1"><strong>Clinic/Hospital: </strong><span>${clinic}</span></div>
                <div class="flex_1 text_right"><strong>From: </strong><span>${from}</span><strong>To: </strong><span>${to}</span></div>
            </div>
            <div class="container_flex">
                <div class="flex_1"><strong>Rating: </strong><span>${rating}/10</span></div>
                <div class="flex_2 text_right"><input class="btn btn-primary" type="button" onclick="showAppointmentDetails()"
                        value="Details"></div>
            </div>
        </div>
        `;
    });
    appointList.innerHTML = html; // render qualifications on screen
}

formSearch.addEventListener('submit', function (event) {
    event.preventDefault();
    const data = serialize(
        formSearch,
        { hash: true }
    );
    //console.log("asdasd");
    //console.log(data);
    hideAlert();
    var d = new Date("Dec 23, 2015")
    var x = new Date(data.date_from)
    //console.log(d.getTime())
    if (x.getTime())
    {
        //console.log("andar date hai")
    }
    else
    {
        //console.log("theres nothing here")
    }
    let filteredByClinic = false;
    let filteredByPatient = false;
    let filteredByDate = false;
    let renderTheFilteredList = false;
    if (data.clinic_name && data.clinic_name.trim() != '') {

        filteredHistory = originalHistory.filter(function (appoint) {
            return appoint[1] == data.clinic_name;
        });
        filteredByClinic = true;
        console.log("filtered by clinic");        
        renderTheFilteredList = true;
    }
    if (data.patient_name && data.patient_name.trim() != '') {

        filteredHistory = (filteredByClinic ? filteredHistory : originalHistory).filter(function (appoint) {
            return appoint[2] == data.patient_name;
        });
        filteredByPatient = true;
        
        console.log("filtered by patient");
        renderTheFilteredList = true;
    }
    var from = new Date(data.date_from)
    from.setHours(from.getHours() - 5);
    var to = new Date(data.date_to)
    if (from.getTime() && to.getTime())
    {
        console.log("salam")
        if (from.getTime() <= to.getTime())
        {
            console.log("sahi hai")
            filteredByDate = true;
            filteredHistory = (filteredByPatient ? filteredHistory : (filteredByClinic ? filteredHistory : originalHistory)).filter(function (appoint) {
                var tempDate = new Date(appoint[3])
                //console.log(from)
                //console.log()
                //console.log(tempDate)
                //console.log()
                //console.log("this is to date: " + to.getTime())
                //console.log(from.getTime() <= tempDate.getTime()) && (tempDate.getTime() <= to.getTime());
                return (from.getTime() <= tempDate.getTime()) && (tempDate.getTime() <= to.getTime());
            });
        }
        else if(from.getTime() >= to.getTime())
        {   
            showAlert("Sorry, we don't deal with time-travelling doctors. Yet.");
        }
    }
    if (filteredByDate == true)
    {
        renderTheFilteredList = true;
        console.log("filtered by date");
    }
    if ((isNaN(from.getTime()) && !isNaN(to.getTime())) || (!isNaN(from.getTime()) && isNaN(to.getTime())))
    {
        console.log("doosre mein bhi dalna hai");
        showAlert("Insufficient Information : Please enter a date in the other field too.");
    }
    
    if (renderTheFilteredList == false)
    {
        renderAppointments(originalHistory);
        console.log("original history render horahi hai");
        originalHistoryIsRendered = true;
        filteredHistoryIsRendered = false;
    }
    else
    {
        renderAppointments(filteredHistory);
        console.log("filtered history render horahi hai");
        filteredByClinic = false;
        filteredByPatient = false;
        filteredByDate = false;
        renderTheFilteredList = false;
        originalHistoryIsRendered = false;
        filteredHistoryIsRendered = true;
    }
    
    


});

sortBy.addEventListener("change", function (event) {
    const order = sortBy.value; // 1= ascending, 2 = descending
    let tempList = [];
    console.log(filteredHistory);
    let anotherTempLisToRunTheLoopOn = [];
    if (originalHistoryIsRendered)
    {
        anotherTempLisToRunTheLoopOn = originalHistory;
        console.log(anotherTempLisToRunTheLoopOn);
    }
    else
    {
        anotherTempLisToRunTheLoopOn = filteredHistory;
    }
    tempList = anotherTempLisToRunTheLoopOn.slice();
    if (order == 1) {
        tempList.sort(function (appoint1, appoint2) {
            if (appoint1[0] > appoint2[0])
                return 1;
            return -1;
        })
    }
    else {
        tempList.sort(function (appoint1, appoint2) {
            if (appoint1[0] < appoint2[0])
                return 1;
            return -1;
        })
    }
    console.log(filteredHistory);
    renderAppointments(tempList);
});
