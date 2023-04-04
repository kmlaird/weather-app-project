//Last Update Date/Time
let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tueday",
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
let hour = now.getHours();
let minute = now.getMinutes();

let newDate = document.querySelector(`#date-updated`);
newDate.innerHTML = `Last Updated: ${day}, ${month} ${date} at ${hour}:${minute}`;

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
  axios.get(apiUrl).then(currentTemp);
}

function currentTemp(response) {
  let temperature = Math.round(response.data.main.temp);
  let temp = document.querySelector(`#today-temp`);
  let cityName = response.data.name;
  let heading = document.querySelector(`#city-country`);
  temp.innerHTML = `${temperature}`;
  heading.innerHTML = `${cityName}`;
}

function searchCity(city) {
  let apiKey = `de78cc20aef9bef799c814cc01fdc85f`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(currentTemp);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

let localeButton = document.querySelector(".btn-light");
localeButton.addEventListener(`click`, getCurrentLocation);
