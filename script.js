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
        weatherCards = document.querySelector("#weather-cards")

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
                console.log("IP Data:", data);
                currentCity = data.city;
                getWeatherData(currentCity, currentUnit, hourlyorWeek);
            })
            .catch((error) => {
                console.error("Error fetching IP data:", error);
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
                console.log("Weather Data:", data); // Log entire weather data
                let today = data.currentConditions;
                
                // Log current conditions
                console.log("Current Conditions:", today);

                // Update DOM elements
                if (unit === "f") {
                    temp.innerText = today.temp + " °F";
                } else {
                    temp.innerText = fahrenheitToCelsius(today.temp) + " °C";
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
                mainIcon.src = getIcon(today.icon);
                
                if (hourlyorWeek === "hourly") {
                    updateForecast(data.days[0].hours, unit, "day");
                }else{
                    updateForecast(data.days, unit, "week");
                } 
        })
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
    
    // Function to convert time to 12-hour format
    function convertTimeTo12HourFormat(time) {
        let [hour, minute] = time.split(":");
        let ampm = hour >= 12 ? "pm" : "am";
        hour = hour % 12 || 12; // Convert hour to 12-hour format; 0 hour becomes 12
        hour = hour < 10 ? "0" + hour : hour; // Add prefix zero if less than 10
        let strTime = hour + ":" + minute + " " + ampm;
        return strTime;
    }

    // Function to get icon URL based on weather condition
    function getIcon(condition) {
        switch (condition) {
            case "Partly-cloudy-day":
                return "./Images/moon-cloud.png";
            case "partly-cloudy-night":
                return "./Images/cloudy-night.png";
            case "rain":
                return "./Images/rain.png";
            case "clear-day":
                return "./Images/day.png";
            case "clear-night":
                return "./Images/moon-and-star.png";
            default:
                return "./Images/moon-cloud.png";
        }
    }
});
