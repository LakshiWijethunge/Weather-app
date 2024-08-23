document.addEventListener("DOMContentLoaded", function () {
    const temp = document.getElementById("temp"),
        date = document.getElementById("date-time"),
        currentLocation = document.querySelector(".location"), // Changed to querySelector
        condition = document.getElementById("condition"),
        rain = document.getElementById("rain-perc"), // Ensure the ID matches
        mainIcon = document.getElementById("icon"),
        uvIndex = document.querySelector(".uv-index"),
        mainText = document.querySelector(".uv-text"),
        windSpeed = document.querySelector(".wind-speed"),
        sunRise = document.querySelector(".sunrise"),
        sunSet = document.querySelector(".sun-set"),
        humidity = document.querySelector(".humidity"),
        visibility = document.querySelector(".visibility"),
        humidityStatus = document.querySelector(".humidity-status"),
        airQuality = document.querySelector(".air-quality"),
        airQualityStatus = document.querySelector(".air-quality-status"),
        visibilityStatus = document.querySelector(".visibility-status");

    let currentCity = "";
    let currentUnit = "c";
    let hourlyorWeek = "Week";

    // Function to get public IP with fetch
    function getPublicIp() {
        fetch(`http://ip-api.com/json/`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                currentCity = data.city;
                getWeatherData(currentCity, currentUnit, hourlyorWeek);
            });
    }
    getPublicIp();

    // Function to get weather data
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
                if (unit === "f") {
                    temp.innerText = today.temp;
                } else {
                    temp.innerText = fahrenheitToCelsius(today.temp);
                }
                currentLocation.innerText = data.resolvedAddress;
                condition.innerText = today.conditions;
                rain.innerText = "Perc - " + today.precip + "%";
                uvIndex.innerText = today.uvindex;
                windSpeed.innerText = today.windspeed + " km/h";
                humidity.innerText = today.humidity + "%";
                visibility.innerText = today.visibility + " km";
                airQuality.innerText = today.winddir;
            })
            .catch((error) => {
                console.error("Error fetching weather data:", error);
            });
    }

    // Convert Fahrenheit to Celsius
    function fahrenheitToCelsius(temp) {
        return ((temp - 32) * 5 / 9).toFixed(1);
    }
});
