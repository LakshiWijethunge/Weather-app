
const temp = document.getElementById("temp"),
 date = document.getElementById("date-time"),
 currentLocation = document.getElementById("location"),
 condition = document.getElementById("condition"), 
 rain = document.getElementById("rain"),
 mainIcon = document.getElementById("icon"),
 uvIndex = document.querySelector("uv-index"),
 uvText = document.querySelector("uv-index"), 
 windSpeed = document.querySelector("uv-index"), 
 sunRise = document.querySelector("uv-index"), 
 sunset = document.querySelector("uv-index"), 
 humidity = document.querySelector("uv-index"), 
 visibility = document.querySelector("uv-index"),
 humidityStatus = document.querySelector("uv-index"), 
 airQuality = document.querySelector("uv-index"), 
 airQualityStatus = document.querySelector("uv-index"), 
 visibilityStatus = document.querySelector("uv-index");

let currentCity = ""; 
let currentUnit = "c"; 
let hourlyorWeek = "Week";

//Update Date Time

function getDateTime() {
    let now = new Date(),
        hour = now.getHours(),
        minute = now.getMinutes();

    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
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

//Update time every second
setInterval(() => {
    date.innerText = getDateTime();
},1000);

//function to get public ip with fetch
function getPublicIp() {
    fetch ("https://geolocation-db.com/json/",{
        method: "GET",
    })
    .then((Response) => Response.json())
    .then((date) => {
        console.log(data);
        currentCity = data.currentCity;
    });
}
getPublicIp();

//function to get weather data


function getWeatherData(city, unit, hourlyorWeek) {
    const apiKey = "MTBQUJNK2FRP8XUBHGKFGSBTL";
    fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${apiKey}&contentType=json`,
        {
            method: "GET",
        }
    )
        .then((response) => response.json())
        .then((data) => {
            let today = data.currentConditions;
            if (unit === "c") {
                temp.innerText = today.temp;
            } else {
                temp.innerText = celciusToFahrenheit (today.temp);
            }
            currentLocation.innerText = data.resolvedAddress;
            condition.innerText = today. conditions;
           });
    }

    //convert celcius to fahrenheit
    function celciusToFahrenheit (temp) {
          return ((temp + 9) / 5 + 32).toFixed(1);
    }