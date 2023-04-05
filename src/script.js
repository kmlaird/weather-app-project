//Last Update Date/Time
function formatDate(timestamp) {
  let now = new Date(timestamp);
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  let day = days[now.getDay()];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[now.getMonth()];
  let date = now.getDate();

  return `${day}, ${month} ${date} at ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [`Sun`, `Mon`, `Tues`, `Wed`, `Thurs`, `Fri`, `Sat`];
  return days[day];
}

//Search and Current Temperature
function search(event) {
  event.preventDefault();
  let cityInput = document.querySelector(`.search-input`);
  searchCity(cityInput.value);
}
let cityForm = document.querySelector(`#city-form`);
cityForm.addEventListener(`submit`, search);

function showPosition(position) {
  console.log(position.coords);
  let lon = position.coords.longitude;
  let lat = position.coords.latitude;

  let apiKey = `1ead678f41o54t591700c72f3b42035b`;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&units=metric&key=${apiKey}`;
  axios.get(apiUrl).then(currentWeather);
}

function currentWeather(response) {
  let tempElement = document.querySelector(`#today-temp`);
  let descElement = document.querySelector(`#description`);
  let cityElement = document.querySelector(`#city-country`);
  let humidityElement = document.querySelector(`#humidity`);
  let windElement = document.querySelector(`#wind`);
  let feelsElement = document.querySelector(`#feels-like`);
  let dateElement = document.querySelector(`#date-updated`);
  let iconElement = document.querySelector(`#icon`);

  celsiusTemperature = response.data.temperature.current;

  tempElement.innerHTML = Math.round(response.data.temperature.current);
  descElement.innerHTML = response.data.condition.description;
  cityElement.innerHTML = response.data.city;
  humidityElement.innerHTML = response.data.temperature.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  feelsElement.innerHTML = Math.round(response.data.temperature.feels_like);
  dateElement.innerHTML = formatDate(response.data.time * 1000);
  iconElement.setAttribute(
    `src`,
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute(`alt`, response.data.condition.icon);

  getForecast(response.data.coordinates);
}

function searchCity(city) {
  let apiKey = `1ead678f41o54t591700c72f3b42035b`;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&units=metric&key=${apiKey}`;
  axios.get(apiUrl).then(currentWeather);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

//Unit Conversion
function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let tempElement = document.querySelector(`#today-temp`);

  celsiusLink.classList.remove(`active`);
  fahrenheitLink.classList.add(`active`);
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  tempElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  let tempElement = document.querySelector(`#today-temp`);

  celsiusLink.classList.add(`active`);
  fahrenheitLink.classList.remove(`active`);
  tempElement.innerHTML = Math.round(celsiusTemperature);
}
//forecast

function displayForecast(response) {
  console.log(response.data.daily);
  let forecast = response.data.daily;
  let forecastElement = document.querySelector(`#forecast`);

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        ` <div class="col">
            <div class="forecast-preview">
              <div class="forecast-day">${formatDay(forecastDay.time)}</div>
              <img src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                forecastDay.condition.icon
              }.png" alt="" height="50"/>
              <div class="forecast-temp">
                <span class="forecast-temp-max">${Math.round(
                  forecastDay.temperature.maximum
                )}°</span> |
                <span class="forecast-temp-min">${Math.round(
                  forecastDay.temperature.minimum
                )}°</span>
              </div>
            </div>
          </div>
            `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = `1ead678f41o54t591700c72f3b42035b`;
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

//global variables
let celsiusTemperature = null;

let localeButton = document.querySelector(`.btn-light`);
localeButton.addEventListener(`click`, getCurrentLocation);

let fahrenheitLink = document.querySelector(`#fahrenheit-link`);
fahrenheitLink.addEventListener(`click`, displayFahrenheitTemperature);

let celsiusLink = document.querySelector(`#celsius-link`);
celsiusLink.addEventListener(`click`, displayCelsiusTemperature);

searchCity(`Portland`);
