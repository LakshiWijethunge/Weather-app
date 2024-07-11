const temp = document.getElementById("temp");
const date = document.getElementById("date-time");

let currentCity = "";
let currentUnit = "";
let hourlyorWeek = "Week";

//Update Date Time

function getDateTime() {
    let now = new Date ();
    let hour = now.getHours();
    let minute = now.getMinutes();

    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednessday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    hour = hour % 12;
    if (hour < 10){
        hour = "0" + hour;
    }
    if (minute < 10){
        minute = "0" + minite;
    }

    let dayString = days[now.getDay()]; //getDay giving an index
    return `${dayString}, ${hour}:${minute}`; //here using template literals
}

date.innerText = getDateTime();
