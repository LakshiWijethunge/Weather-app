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
        weatherCards = document.querySelector("#weather-cards"),
        celciusBtn = document.querySelector(".celcius"),
        fahrenheitBtn = document.querySelector(".fahrenheit"),
        hourlyBtn = document.querySelector(".hourly"),
        weekBtn = document.querySelector(".week"),
        tempUnit = document.querySelectorAll(".temp-unit");

    let currentCity = "";
    let currentUnit = "c";
    let hourlyOrWeek = "week";

    // Function to get date and time
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
        hour = hour % 12 || 12;
        if (minute < 10) {
            minute = "0" + minute;
        }
        let dayString = days[now.getDay()];
        return `${dayString}, ${hour}:${minute}`;
    }

    // Updating date and time
    date.innerText = getDateTime();
    setInterval(() => {
        date.innerText = getDateTime();
    }, 1000);

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
                let today = data.currentConditions;
                console.log("Raw Temp Data (Fahrenheit):", today.temp); // Debugging statement

                let tempValue = unit === "c" ? fahrenheitToCelsius(today.temp).toFixed(2) : today.temp.toFixed(2);
                temp.innerText = tempValue;

                console.log("Displayed Temp:", temp.innerText); // Debugging statement

                currentLocation.innerText = data.resolvedAddress;
                condition.innerText = today.conditions;
                rain.innerText = "Perc - " + today.precip + "%";
                uvIndex.innerText = today.uvindex;
                windSpeed.innerText = today.windspeed;
                measureUvIndex(today.uvindex);
                mainIcon.src = getIcon(today.icon);
                changeBackground(today.icon);
                humidity.innerText = today.humidity + "%";
                updateHumidityStatus(today.humidity);
                visibility.innerText = today.visibility;
                updateVisibilityStatus(today.visibility);
                airQuality.innerText = today.winddir;
                updateAirQualityStatus(today.winddir);
                if (hourlyOrWeek === "hourly") {
                    updateForecast(data.days[0].hours, unit, "day");
                } else {
                    updateForecast(data.days, unit, "week");
                }
                sunRise.innerText = convertTimeTo12HourFormat(today.sunrise);
                sunSet.innerText = convertTimeTo12HourFormat(today.sunset);
            })
            .catch((err) => {
                alert("City not found in our database");
            });
    }

    // Function to update Forecast
    function updateForecast(data, unit, type) {
        weatherCards.innerHTML = "";
        let day = 0;
        let numCards = type === "day" ? 24 : 7;
        for (let i = 0; i < numCards; i++) {
            let card = document.createElement("div");
            card.classList.add("card");
            let dayName = type === "week" ? getDayName(data[day].datetime) : getHour(data[day].datetime);
            let dayTemp = unit === "f" ? data[day].temp.toFixed(2) : fahrenheitToCelsius(data[day].temp).toFixed(2);
            let iconSrc = getIcon(data[day].icon);
            let tempUnit = unit === "f" ? "°F" : "°C";
            card.innerHTML = `
                <h2 class="day-name">${dayName}</h2>
                <div class="card-icon">
                    <img src="${iconSrc}" class="day-icon" alt="" />
                </div>
                <div class="day-temp">
                    <h2 class="temp">${dayTemp}</h2>
                    <span class="temp-unit">${tempUnit}</span>
                </div>
            `;
            weatherCards.appendChild(card);
            day++;
        }
    }

    // Function to change weather icons
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

    // Function to change background depending on weather conditions
    function changeBackground(condition) {
        const body = document.querySelector("body");
        let bg = "";
        switch (condition) {
            case "partly-cloudy-day":
                bg = "https://i.ibb.co/qNv7NxZ/pc.webp";
                break;
            case "partly-cloudy-night":
                bg = "https://i.ibb.co/RDfPqXz/pcn.jpg";
                break;
            case "rain":
                bg = "https://i.ibb.co/h2p6Yhd/rain.webp";
                break;
            case "clear-day":
                bg = "https://i.ibb.co/WGry01m/cd.jpg";
                break;
            case "clear-night":
                bg = "https://i.ibb.co/kqtZ1Gx/cn.jpg";
                break;
            default:
                bg = "https://i.ibb.co/qNv7NxZ/pc.webp";
        }
        body.style.backgroundImage = `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ),url(${bg})`;
    }

    // Get hours from hh:mm:ss
    function getHour(time) {
        let [hour, min] = time.split(":");
        hour = hour % 12 || 12;  // Convert hour to 12-hour format
        return `${hour}:${min} ${parseInt(time.split(":")[0], 10) >= 12 ? 'PM' : 'AM'}`;
    }

    // Convert time to 12-hour format
    function convertTimeTo12HourFormat(time) {
        let [hour, minute] = time.split(":");
        let ampm = hour >= 12 ? "pm" : "am";
        hour = hour % 12 || 12;
        return `${hour.toString().padStart(2, '0')}:${minute.padStart(2, '0')} ${ampm}`;
    }

    // Function to get day name from date
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

    // Function to get UV index status
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
        if (humidity < 30) {
            humidityStatus.innerText = "Dry";
        } else if (humidity <= 60) {
            humidityStatus.innerText = "Comfortable";
        } else {
            humidityStatus.innerText = "Humid";
        }
    }

    // Function to update visibility status
    function updateVisibilityStatus(visibility) {
        if (visibility > 10) {
            visibilityStatus.innerText = "Clear";
        } else if (visibility > 5) {
            visibilityStatus.innerText = "Moderate";
        } else {
            visibilityStatus.innerText = "Poor";
        }
    }

    // Function to update air quality status
    function updateAirQualityStatus(airQuality) {
        if (airQuality === "N") {
            airQualityStatus.innerText = "Good";
        } else if (airQuality === "S") {
            airQualityStatus.innerText = "Moderate";
        } else if (airQuality === "H") {
            airQualityStatus.innerText = "Unhealthy";
        } else {
            airQualityStatus.innerText = "Very Unhealthy";
        }
    }

    // Fahrenheit to Celsius conversion
    function fahrenheitToCelsius(fahrenheit) {
        return ((fahrenheit - 32) * 5) / 9;
    }

    // Event listeners for temperature unit buttons
    celciusBtn.addEventListener("click", () => {
        currentUnit = "c";
        celciusBtn.classList.add("active");
        fahrenheitBtn.classList.remove("active");
        getWeatherData(currentCity, currentUnit, hourlyOrWeek);
    });

    fahrenheitBtn.addEventListener("click", () => {
        currentUnit = "f";
        fahrenheitBtn.classList.add("active");
        celciusBtn.classList.remove("active");
        getWeatherData(currentCity, currentUnit, hourlyOrWeek);
    });

    // Event listeners for hourly or weekly forecast buttons
    hourlyBtn.addEventListener("click", () => {
        hourlyOrWeek = "hourly";
        hourlyBtn.classList.add("active");
        weekBtn.classList.remove("active");
        getWeatherData(currentCity, currentUnit, hourlyOrWeek);
    });

    weekBtn.addEventListener("click", () => {
        hourlyOrWeek = "week";
        weekBtn.classList.add("active");
        hourlyBtn.classList.remove("active");
        getWeatherData(currentCity, currentUnit, hourlyOrWeek);
    });
});
