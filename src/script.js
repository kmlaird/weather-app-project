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
  let days = [`Sun`, `Mon`, `Tues`, `Wed`, `Thurs`, `Friy`];
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
  let lon = position.coords.longitude;
  let lat = position.coords.latitude;

  let apiKey = `de78cc20aef9bef799c814cc01fdc85f`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(currentWeather);
}

function currentWeather(response) {
  let tempElement = document.querySelector(`#today-temp`);
  let tempMaxElement = document.querySelector(`#temp-max`);
  let tempMinElement = document.querySelector(`#temp-min`);
  let descElement = document.querySelector(`#description`);
  let cityElement = document.querySelector(`#city-country`);
  let humidityElement = document.querySelector(`#humidity`);
  let windElement = document.querySelector(`#wind`);
  let visibilityElement = document.querySelector(`#visibility`);
  let feelsElement = document.querySelector(`#feels-like`);
  let dateElement = document.querySelector(`#date-updated`);
  let iconElement = document.querySelector(`#icon`);

  celsiusTemperature = response.data.main.temp;

  tempElement.innerHTML = Math.round(response.data.main.temp);
  tempMaxElement.innerHTML = Math.round(response.data.main.temp_max);
  tempMinElement.innerHTML = Math.round(response.data.main.temp_min);
  descElement.innerHTML = response.data.weather[0].description;
  cityElement.innerHTML = response.data.name;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  visibilityElement.innerHTML = response.data.visibility;
  feelsElement.innerHTML = Math.round(response.data.main.feels_like);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    `src`,
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute(`alt`, response.data.weather[0].description);
}

function searchCity(city) {
  let apiKey = `de78cc20aef9bef799c814cc01fdc85f`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
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

function displayForecast() {
  let days = [`Mon`, `Tues`, `Wed`];
  let forecastElement = document.querySelector(`#forecast`);

  let forecastHTML = `<div class="row">`;
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      ` <div class="col">
        <div class="forecast-preview">
          <div class="forecast-day">Tues</div>
          <img src="http://openweathermap.org/img/wn/01d@2x.png" alt="" height="50"/>
          <div class="forecast-temp">
            <span class="forecast-temp-max">8°</span> |
            <span class="forecast-temp-min">0°</span>
          </div>
        </div>
      </div>
        `;
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = `de78cc20aef9bef799c814cc01fdc85f`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

//global variables
let celsiusTemperature = null;
displayForecast();

let localeButton = document.querySelector(`.btn-light`);
localeButton.addEventListener(`click`, getCurrentLocation);

let fahrenheitLink = document.querySelector(`#fahrenheit-link`);
fahrenheitLink.addEventListener(`click`, displayFahrenheitTemperature);

let celsiusLink = document.querySelector(`#celsius-link`);
celsiusLink.addEventListener(`click`, displayCelsiusTemperature);

searchCity(`Portland`);
