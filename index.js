const searchInput = document.querySelector(".form__input");
const searchButton = document.querySelector(".form__button");
const form = document.querySelector("form");
const dataContainer = document.querySelector(".wetherContainer");
const API_KEY = "74c224055af6a458aeaee38b2dbb5d14";

form.addEventListener("submit", getData);
searchButton.addEventListener("click", getData);

async function getData(event) {
  event.preventDefault();
  const location = searchInput.value;
  try {
    const weatherData = await fetchData(location);
    showData(weatherData);
  } catch (error) {
    console.log("Oops something went wrong");
  }
}

async function fetchData(location) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}`,
      true
    );
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const weatherData = JSON.parse(xhr.responseText);
          resolve(weatherData);
        } else {
          reject(xhr.status);
        }
      }
    };
    xhr.send();
  });
}

function showData(data) {
  document.body.style.backdropFilter = `blur(5px)`;
  dataContainer.innerHTML = "";
  if (data) {
    data.list.forEach((element) => {
      const weather = document.createElement("div");
      weather.setAttribute("class", "weather");

      const weatherImage = document.createElement("img");
      weatherImage.src = `https://openweathermap.org/img/w/${element.weather[0].icon}.png`;
      weatherImage.setAttribute("class", "weather__icon");

      const temperature = document.createElement("h2");
      temperature.textContent = `${(element.main.temp - 273.15).toFixed(0)}°C`;

      const date = document.createElement("p");
      date.textContent = element.dt_txt;

      const windDirection = document.createElement("img");
      windDirection.setAttribute("class", "weather__wind");
      windDirection.src = "./assets/right-arrow.png";
      windDirection.style.transform = `rotate(${element.wind.deg}deg)`;

      const weatherDetails = document.createElement("div");
      weatherDetails.setAttribute("class", "weather__details");

      const minimalTemp = document.createElement("p");
      minimalTemp.textContent = `Minimal: ${convertToCelsius(
        element.main.temp_min
      )}`;

      const maximalTemp = document.createElement("p");
      maximalTemp.textContent = `Maximal: ${convertToCelsius(
        element.main.temp_max
      )}`;

      const wind = document.createElement("p");
      wind.textContent = `Wind: ${element.wind.speed} m/s`;

      weatherDetails.appendChild(minimalTemp);
      weatherDetails.appendChild(maximalTemp);
      weatherDetails.appendChild(wind);

      weather.appendChild(weatherImage);
      weather.appendChild(temperature);
      weather.appendChild(date);
      weather.appendChild(weatherDetails);
      weather.appendChild(windDirection);
      dataContainer.appendChild(weather);
    });
  }
}

function convertToCelsius(temp) {
  return `${(temp - 273.15).toFixed(2)}°C`;
}
