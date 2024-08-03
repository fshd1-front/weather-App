import getWeatherData from "./utils/httpReq.js";
import { removeModal, showModal } from "./utils/modal.js";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const searchInput = document.querySelector("input");
const searchButtom = document.querySelector("button");
const weatherContainer = document.querySelector("#weather");
const locationIcon = document.querySelector("#location");
const forecastContainer = document.querySelector("#forecast");
const modalButton = document.querySelector("#modal-button");

const renderCurrentWeather = (data) => {
  if (!data) return;
  const weatherJSx = `
  <h1>${data.name}, ${data.sys.country}</h1>
  <div id="main">
    <img alt="weather icon" src="https://openweathermap.org/img/w/${
      data.weather[0].icon
    }.png">
    <span>${data.weather[0].main}</span>
    <p>${Math.round(data.main.temp)} °C</p>
  </div>
  <div id="info">
  <p>Humidity: <span>${data.main.humidity} %</span></p>
  <p>wind Speed: <span>${data.wind.speed} %</span></p>
  </div>
  `;

  weatherContainer.innerHTML = weatherJSx;
};

const getWeekDay = (date) => {
  return DAYS[new Date(date * 1000).getDay()];
};

const renderForecastWeather = (data) => {
  if (!data) return;
  forecastContainer.innerHTML = "";
  data = data.list.filter((obj) => obj.dt_txt.endsWith("12:00:00"));
  console.log(data);
  data.forEach((i) => {
    const forecastJSx = `
    <div>
      <img alt="weather icon" src="https://openweathermap.org/img/w/${
        i.weather[0].icon
      }.png">
      <h3>${getWeekDay(i.dt)}</h3>
      <p>${Math.round(i.main.temp)} °C</p>
      <span>${i.weather[0].main}</span>
    </div>
    `;
    forecastContainer.innerHTML += forecastJSx;
  });
};

const searchHandler = async () => {
  const cityName = searchInput.value;

  if (!cityName) {
    showModal("Pls enter city name!");
    return;
  }

  const currentData = await getWeatherData("current", cityName);
  renderCurrentWeather(currentData);
  const forecastData = await getWeatherData("forecast", cityName);
  renderForecastWeather(forecastData);
};

const positionCallback = async (position) => {
  const { latitude, longitude } = position.coords;
  const currentData = await getWeatherData("current", position.coords);
  renderCurrentWeather(currentData);
  const forecastData = await getWeatherData("forecast", position.coords);
  renderForecastWeather(forecastData);
};

const errorCallback = (error) => {
  console.log(error.message);
};

const locationHandler = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(positionCallback, errorCallback);
  } else {
    showModal("Your browser does not support geolocation!");
  }
};

const initHandler = async () => {
  const currentData = await getWeatherData("current", "sanadaj");
  renderCurrentWeather(currentData);
  const forecastData = await getWeatherData("forecast", "sanadaj");
  renderForecastWeather(forecastData);
};

searchButtom.addEventListener("click", searchHandler);
locationIcon.addEventListener("click", locationHandler);
modalButton.addEventListener("click", removeModal);
document.addEventListener("DOMContentLoaded", initHandler);
