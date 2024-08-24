document.addEventListener("DOMContentLoaded", function () {
    const temp = document.getElementById("temp"),
        date = document.getElementById("date-time"),
        currentLocation = document.querySelector(".location"), 
        condition = document.getElementById("condition"),
        rain = document.getElementById("rain-perc"), 
        mainIcon = document.getElementById("icon"),
        uvIndex = document.querySelector(".uv-index"),
        uvText = document.querySelector(".uv-text"),
        windSpeed = document.querySelector(".wind-speed"),
        sunRise = document.querySelector(".sun-rise"),
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
                rain.innerText = "Precipitation: " + today.precip + "%";
                uvIndex.innerText = today.uvindex;
                windSpeed.innerText = today.windspeed + " km/h";
                humidity.innerText = today.humidity + "%";
                visibility.innerText = today.visibility + " km";
                airQuality.innerText = today.winddir;
                measureUvIndex(today.uvindex);
                updateHumidityStatus(today.humidity);
                updateVisibilityStatus(today.visibility); 
                updateAirQualityStatus(today.winddir);
                sunRise.innerText = convertTimeTo12HourFormat(today.sunrise);
                sunSet.innerText = convertTimeTo12HourFormat(today.sunset);
            })
            .catch((error) => {
                console.error("Error fetching weather data:", error);
            });
    }

    // Convert Fahrenheit to Celsius
    function fahrenheitToCelsius(temp) {
        return ((temp - 32) * 5 / 9).toFixed(1);
    }

    // Function to measure UV index status
    function measureUvIndex(uvIndex) { 
        if (uvIndex <= 2) {
            uvText.innerText = "Low"; 
        } else if (uvIndex <= 5) {
            uvText.innerText = "Moderate";
        } else if (uvIndex <= 7) {
            uvText.innerText = "High";
        } else if (uvIndex <= 10) {
            uvText.innerText = "Very High";
        } else {
            uvText.innerText = "Extreme";
        }
    }

    // Function to update humidity status
    function updateHumidityStatus(humidity) {
        if (humidity <= 30) {
            humidityStatus.innerText = "Low";
        } else if (humidity <= 60) {
            humidityStatus.innerText = "Moderate";
        } else {
            humidityStatus.innerText = "High";
        }
    }

    // Function to update visibility status
    function updateVisibilityStatus(visibility) {
        if (visibility <= 0.3) {
            visibilityStatus.innerText = "Dense Fog";
        } else if (visibility <= 0.16) {
            visibilityStatus.innerText = "Moderate Fog";
        } else if (visibility <= 0.35) {
            visibilityStatus.innerText = "Light Fog"; 
        } else if (visibility <= 1.13) { 
            visibilityStatus.innerText = "Very Light Fog";
        } else if (visibility <= 2.16) { 
            visibilityStatus.innerText = "Light Mist";
        } else if (visibility <= 5.4) {
            visibilityStatus.innerText = "Very Light Mist";
        } else if (visibility <= 10.8) {
            visibilityStatus.innerText = "Clear Air";
        } else {
            visibilityStatus.innerText = "Very Clear Air";
        }
    }
    
    // Function to update air quality status
    function updateAirQualityStatus(airQuality) {
        if (airQuality <= 50) {
            airQualityStatus.innerText = "Good";
        } else if (airQuality <= 100) {
            airQualityStatus.innerText = "Moderate";
        } else if (airQuality <= 150) {
            airQualityStatus.innerText = "Unhealthy for Sensitive Groups";
        } else if (airQuality <= 200) {
            airQualityStatus.innerText = "Unhealthy";
        } else if (airQuality <= 250) {
            airQualityStatus.innerText = "Very Unhealthy";
        } else {
            airQualityStatus.innerText = "Hazardous";
        }
    }
    
    
    function convertTimeTo12HourFormat(time) {
        let [hour, minute] = time.split(":");
        let ampm = hour >= 12 ? "pm" : "am";
        hour = hour % 12 || 12; // Convert hour to 12-hour format; 0 hour becomes 12
        hour = hour < 10 ? "0" + hour : hour; // Add prefix zero if less than 10
        let strTime = hour + ":" + minute + " " + ampm;
        return strTime;
    }
    
});
