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
        visibilityStatus = document.querySelector(".visibility-status"),
        weatherCards = document.querySelector("#weather-cards");
        

    let currentCity = "";
    let currentUnit = "c";
    let hourlyOrWeek = "Week";

    // Function to get public IP with fetch
    function getPublicIp() {
        fetch(`http://ip-api.com/json/`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("IP Data:", data);
                currentCity = data.city;
                getWeatherData(currentCity, currentUnit, hourlyOrWeek);
            })
            .catch((error) => {
                console.error("Error fetching IP data:", error);
            });
    }
    getPublicIp();

    // Function to get weather data
    function getWeatherData(city, unit, hourlyOrWeek) {
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
                
                if (hourlyOrWeek === "hourly") {
                    updateForecast(data.days[0].hours, unit, "day");
                } else {
                    updateForecast(data.days, unit, "week");
                } 
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
        } else if (visibility <= 1.6) { // Fixed the value from 0.16 to 1.6
            visibilityStatus.innerText = "Moderate Fog";
        } else if (visibility <= 3.5) { // Fixed the value from 0.35 to 3.5
            visibilityStatus.innerText = "Light Fog"; 
        } else if (visibility <= 11.3) { // Fixed the value from 1.13 to 11.3
            visibilityStatus.innerText = "Very Light Fog";
        } else if (visibility <= 21.6) { // Fixed the value from 2.16 to 21.6
            visibilityStatus.innerText = "Light Mist";
        } else if (visibility <= 54) { // Fixed the value from 5.4 to 54
            visibilityStatus.innerText = "Very Light Mist";
        } else if (visibility <= 108) { // Fixed the value from 10.8 to 108
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
        let ampm = hour >= 12 ? "PM" : "AM"; // Fixed the case for AM/PM
        hour = hour % 12 || 12; // Convert hour to 12-hour format; 0 hour becomes 12
        let strTime = hour + ":" + minute + " " + ampm;
        return strTime;
    }

    // Function to get icon URL based on weather condition
    function getIcon(condition) {
        switch (condition) {
            case "partly-cloudy-day":
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

    function getDayName(date) {
        let day = new Date(date);
        let days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];
        return days[day.getDay()];
    }

    function getHour(time) {
        let [hour, min] = time.split(":");
        let ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        return `${hour}:${min} ${ampm}`;
    }

    function updateForecast(data, unit, type) { 
        weatherCards.innerHTML = "";

        let day = 0;
        let numCards = type === "day" ? 24 : 7;

        for (let i = 0; i < numCards; i++) {
            let card = document.createElement("div");
            card.classList.add("card");

            let dayName = type === "week" ? getDayName(data[day].datetime) : getHour(data[day].datetime);
            let dayTemp = unit === "c" ? fahrenheitToCelsius(data[day].temp) : data[day].temp;
            let iconCondition = data[day].icon;
            let iconSrc = getIcon(iconCondition);
            let tempUnit = unit === "c" ? "°C" : "°F";

            card.innerHTML = `
                <div class="card">
                    <h2 class="day-name">${dayName}</h2>
                    <div class="card-icon">
                        <img src="${iconSrc}" alt="weather icon"/>
                    </div>
                    <div class="day-temp">
                        <h2 class="temp">${dayTemp}${tempUnit}</h2>
                    </div>
                </div>
            `;
            weatherCards.appendChild(card);
            day++;
        }
    }

    // document.querySelectorAll(".celcius").forEach((elem) => {
    //     elem.addEventListener("click", function () {
    //         changeUnit("c");
    //     });
    // });

    // document.querySelectorAll(".fahrenheit").forEach((elem) => {
    //     elem.addEventListener("click", function () {
    //         changeUnit("f");
    //     });
    // });

    // function changeUnit(unit) {
    //     if (currentUnit !== unit) {
    //         currentUnit = unit;
    //         getWeatherData(currentCity, currentUnit, hourlyOrWeek);
    //     }
    // }

    // document.querySelectorAll(".hourly").forEach((elem) => {
    //     elem.addEventListener("click", function () {
    //         changeTimeSpan("hourly");
    //     });
    // });

    // document.querySelectorAll(".weekly").forEach((elem) => {
    //     elem.addEventListener("click", function () {
    //         changeTimeSpan("week");
    //     });
    // });

    // function changeTimeSpan(span) {
    //     if (hourlyOrWeek !== span) {
    //         hourlyOrWeek = span;
    //         getWeatherData(currentCity, currentUnit, hourlyOrWeek);
    //     }
    // }
});
