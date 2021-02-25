'use strict';

// Variables
const airQualityDisplay = document.querySelector('.extra__data--aqi');
const APIKey = '22f6a7dec6e04ee5a4ee2ce9eedcdd79';
const body = document.querySelector('body');
const cityDisplay = document.querySelector('.weather__info--city');
const dateDisplay = document.querySelector('.date');
const feelsLikeDisplay = document.querySelector('.extra__data--feels-like');
const mainContent = document.querySelector('.main');
const tempDisplay = document.querySelector('.weather__info--temp');
const title = document.querySelector('.app__title');
const typeDisplay = document.querySelector('.weather__info--type');
const weatherIconDisplay = document.querySelector('.weather__info--icon');
const weatherInfoContainer = document.querySelector('.weather__info');
const windInfoDisplay = document.querySelector('.extra__data--wind-info');

// Creating date string
const date = new Date();
// Date function
const displayDate = (function (date) {
  const currentDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    // year: 'numeric',
  }).format(date);
  // Displaying date on UI
  dateDisplay.textContent = currentDate;
  // Immediately invoking the function
})(date);

// Get location and display current weather
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    // Get city info from geocode reverse geocode API
    fetch(`https://geocode.xyz/${latitude},${longitude}?geoit=json`)
      .then((res) => {
        console.log(res);
        if (!res.ok) {
          throw new Error(`Something went wrong (${res.status}). Try again!`);
        }
        return res.json();
      })
      .then((data) => {
        const cityName =
          data.city[0].toUpperCase() + data.city.slice(1).toLowerCase();
        const stateName = data.statename;

        //   Get weather for current geocodes
        return fetch(
          `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${APIKey}&include=minutely&units=I`
        )
          .then((res) => {
            if (!res.ok) {
              throw new Error(
                `Something went wrong (${res.status}). Try again!`
              );
            }
            return res.json();
          })
          .then((data) => {
            const cityData = data.data[0];
            const tempHTML = `<p class="weather__info--temp">${cityData.temp}<span class="degrees">°F</span></p>`;
            const weatherIcon = cityData.weather.icon;
            console.log(cityData);

            // Display weather type icon
            weatherIconDisplay.src = `https://www.weatherbit.io/static/img/icons/${weatherIcon}.png`;
            weatherIconDisplay.addEventListener('load', () =>
              weatherIconDisplay.classList.add('view')
            );

            // Inserts tempHTML to the end of the weather info container
            weatherInfoContainer.insertAdjacentHTML('beforeend', tempHTML);

            // Change background color depending on time of day
            if (cityData.pod == 'd') {
              body.classList.remove('night-background');
              body.classList.add('day-background');
            } else if (cityData.pod == 'n') {
              body.classList.remove('day-background');
              body.classList.add('night-background');
            }

            // Display data to elements
            airQualityDisplay.textContent = cityData.aqi;
            cityDisplay.textContent = cityName;
            feelsLikeDisplay.textContent = `${Math.round(cityData.app_temp)}°F`;
            title.textContent = `InstaWeather | ${cityName}, ${stateName}`;
            typeDisplay.textContent = cityData.weather.description;
            windInfoDisplay.textContent = `${cityData.wind_cdir} ${cityData.wind_spd} mph`;
          })
          .catch((err) => console.error(`${err.message}`))
          .finally(() => mainContent.classList.add('view-main'));
      });
  });
}
