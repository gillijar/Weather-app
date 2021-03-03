'use strict';

// Variables
const airQualityDisplay = document.querySelector('.extra__data--aqi');
const APIKey = '22f6a7dec6e04ee5a4ee2ce9eedcdd79';
const body = document.querySelector('body');
const cityDisplay = document.querySelector('.weather__info--city');
const date = new Date();
const dateDisplay = document.querySelector('.date');
const error = document.querySelector('.error');
const errorBtn = document.querySelector('.error__btn');
const feelsLikeDisplay = document.querySelector('.extra__data--feels-like');
const hourlyForecastData = document.querySelectorAll('.hourly__forecast--data');
const mainContent = document.querySelector('.main');
const tempDisplay = document.querySelector('.weather__info--temp');
const title = document.querySelector('.app__title');
const typeDisplay = document.querySelector('.weather__info--type');
const weatherIconDisplay = document.querySelector('.weather__info--icon');
const weatherInfoContainer = document.querySelector('.weather__info');
const windInfoDisplay = document.querySelector('.extra__data--wind-info');

// Get response for each fetch
const getJSON = function (url) {
  return fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`Something went wrong (${res.status}). Try again!`);
    }
    return res.json();
  });
};

// Render error in case of rejected promise
const renderError = function (msg) {
  const errorMsg = document.querySelector('.error__msg');
  errorMsg.textContent = msg;
  error.style.opacity = 1;
  error.style.pointerEvents = 'all';
};

// Button to reload page in case of an error
errorBtn.addEventListener('click', () => location.reload());

// Date function for header
const displayDate = (function (date) {
  const currentDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
  }).format(date);
  // Displaying date on UI
  dateDisplay.textContent = currentDate;
  // Immediately invoking the function
})(date);

// Get location and display current weather
navigator.geolocation.getCurrentPosition((position) => {
  const { latitude } = position.coords;
  const { longitude } = position.coords;

  // Get city info from geocode reverse geocode API
  getJSON(`https://geocode.xyz/${latitude},${longitude}?geoit=json`)
    .then((data) => {
      const cityName = data.city
        .toLowerCase()
        .split(' ')
        .map((name) => name[0].toUpperCase() + name.slice(1))
        .join(' ');

      const stateName = data.statename;

      //   Get weather for current geocodes
      getJSON(
        `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${APIKey}&include=minutely&units=I`
      ).then((data) => {
        const cityData = data.data[0];
        const tempHTML = `<p class="weather__info--temp">${Math.round(
          cityData.temp
        )}<span class="degrees">°F</span></p>`;
        const weatherIcon = cityData.weather.icon;

        // Display weather type icon
        weatherIconDisplay.src = `https://www.weatherbit.io/static/img/icons/${weatherIcon}.png`;
        weatherIconDisplay.addEventListener(
          'load',
          () => (weatherIconDisplay.style.opacity = 1)
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
        windInfoDisplay.textContent = `${cityData.wind_cdir} ${Math.round(
          cityData.wind_spd
        )} mph`;
      });
      // Fetching hourly data
      getJSON(
        `https://api.weatherbit.io/v2.0/forecast/hourly?lat=${latitude}&lon=${longitude}&key=${APIKey}&hours=48&units=I`
      ).then((data) => {
        // Hour for boxes
        let hour = date.getHours() + 1;

        // Function to decide whether forecast should display AM or PM
        const futureHours = function (hour) {
          if (hour > 12) return `${(hour %= 12)} PM`;
          else if (hour === 0) return `12 AM`;
          else if (hour === 12) return `${hour} PM`;
          else return `${hour} AM`;
        };

        // Iterator for each box
        let i = 0;

        // Iterating through each box and displaying data for that hour
        hourlyForecastData.forEach((box) => {
          // Resetting hour to 0 when it is greater than 23
          if (hour > 23) hour = 0;

          const hourlyData = data.data[i];
          const icon = hourlyData.weather.icon;
          const hourlyIcon = `https://www.weatherbit.io/static/img/icons/${icon}.png`;
          const hourlyString = `
            <div class="hourly__forecast--main">
              <div class="hourly__forecast--date">${futureHours(hour)}</div>
                <div class="hourly__forecast--icon-temp">
                  <img src="${hourlyIcon}" alt="Hourly icon" class="hourly__forecast--icon" />
                  <div class="hourly__forecast--temp">${Math.round(
                    hourlyData.temp
                  )}°F</div>
              </div>
            </div>
            <div class="hourly__forecast--type">${
              hourlyData.weather.description
            }</div>
            <div class="hourly__forecast--precipitation">Chance of rain: ${Math.round(
              hourlyData.precip
            )}%</div>
            `;

          // Inserting html into each box
          box.insertAdjacentHTML('afterbegin', hourlyString);

          // Adding 1 to i and hour
          i++;
          hour++;
        });
      });
    })
    .catch((err) => {
      renderError(`${err.message}`);
    })
    .finally(() => mainContent.classList.add('view-main'));
});
