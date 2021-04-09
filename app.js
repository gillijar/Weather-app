'use strict';

// Variables
const airQualityDisplay = document.querySelector('.extra__data--aqi');
const APIKey = '135a94105a0042b5a55fb5628dcfb302';
const APIKey2 = 'a33df676f47b9be9a8072c268d067eb3';
const body = document.querySelector('body');
const cityDisplay = document.querySelector('.weather__info--city');
let cityName;
const date = new Date();
const dateDisplay = document.querySelector('.date');
const error = document.querySelector('.error');
const errorBtn = document.querySelector('.error__btn');
const feelsLikeDisplay = document.querySelector('.extra__data--feels-like');
const hourlyForecastData = document.querySelectorAll('.hourly__forecast--data');
const input = document.querySelector('.search__city');
let latitude;
let longitude;
const mainContent = document.querySelector('.main');
const search = document.querySelector('.search');
const searchBtn = document.querySelector('.search__city-btn');
const searchNavBtn = document.querySelector('.header__nav');
let stateName;
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

const getWeatherData = function (url1, url2) {
  const displayData = function () {
    // Get current weather data
    getJSON(url1).then((data) => {
      const cityData = data.data[0];
      const weatherIcon = cityData.weather.icon;

      // Change background color depending on time of day
      if (cityData.pod == 'd') {
        body.classList.remove('night-background');
        body.classList.add('day-background');
      } else if (cityData.pod == 'n') {
        body.classList.remove('day-background');
        body.classList.add('night-background');
      }

      title.textContent = `InstaWeather | ${cityName}, ${stateName}`;

      function insertCurrentWeather() {
        const mainHTML = `<div class="main__city-container">
        <div class="main__current-weather">
          <div class="weather__info">
            <!-- Weather type icon -->
            <img src="${`https://www.weatherbit.io/static/img/icons/${weatherIcon}.png`}" alt="Weather icon" class="weather__info--icon" />
            <!-- City -->
            <div class="weather__info--city-and-type">
            <h2 class="weather__info--city">${cityName}</h2>
            <p class="weather__info--type">${cityData.weather.description}</p>
            </div>
            <p class="weather__info--temp">${Math.round(
              cityData.temp
            )}<span class="degrees">°F</span></p>
          </div>

          <!-- Extra data for the location -->
          <div class="extra__data">
            <div class="extra__data--info">
              <p class="extra__data--heading">Wind</p>
              <p class="extra__data--wind-info">${
                cityData.wind_cdir
              } ${Math.round(cityData.wind_spd)} mph</p>
            </div>
            <div class="extra__data--info">
              <p class="extra__data--heading">Feels like</p>
              <p class="extra__data--feels-like">${`${Math.round(
                cityData.app_temp
              )}°F`}</p>
            </div>
            <div class="extra__data--info">
              <p class="extra__data--heading">aqi</p>
              <p class="extra__data--aqi">${cityData.aqi}</p>
            </div>
          </div>
        </div>

        <!-- 5 hour forecast -->
        <div class="main__24-hour-forecast">
          <div class="hourly__forecast">
            <p class="hourly__forecast--heading">Hourly forecast</p>
            <div class="hourly__forecast--data-container"></div>
          </div>
        </div>
      </div>
      `;
        mainContent.insertAdjacentHTML('beforeend', mainHTML);
      }
      insertCurrentWeather();
    });
    getJSON(url2).then((data) => {
      console.log(data);
      const hourlyForecastDataContainer = document.querySelector(
        '.hourly__forecast--data-container'
      );

      // Hour for boxes
      let hour = date.getHours() + 1;

      // Function to decide whether forecast should display AM or PM
      const futureHours = function (hour) {
        if (hour > 12) return `${(hour %= 12)} PM`;
        else if (hour === 0) return `12 AM`;
        else if (hour === 12) return `${hour} PM`;
        else return `${hour} AM`;
      };

      // Iterating through each box and displaying data for that hour
      for (let i = 0; i < 24; i++) {
        // Resetting hour to 0 when it is greater than 23
        if (hour > 23) hour = 0;

        const hourlyData = data.hourly[i];
        const icon = hourlyData.weather[0].icon;
        const description = hourlyData.weather[0].description;
        let hourlyIcon;

        if (
          description.includes('scattered') ||
          description.includes('clear') ||
          description.includes('few') ||
          description.includes('broken') ||
          description.includes('overcast')
        ) {
          hourlyIcon = `https://www.weatherbit.io/static/img/icons/c${icon}.png`;
        } else if (description.includes('rain')) {
          hourlyIcon = `https://www.weatherbit.io/static/img/icons/r02d.png`;
        } else if (description.includes('thunderstorm')) {
          hourlyIcon = `https://www.weatherbit.io/static/img/icons/t04d.png`;
        } else {
          hourlyIcon = `http://openweathermap.org/img/wn/${icon}@2x.png`;
        }

        const hourlyString = `
        <div class="hourly__forecast--data">
        <div class="hourly__forecast--main">
          <div class="hourly__forecast--date">${futureHours(hour)}</div>
          <div class="hourly__forecast--icon-temp">
            <img
              src="${hourlyIcon}"
              alt="Hourly icon"
              class="hourly__forecast--icon"
            />
            <div class="hourly__forecast--temp">${Math.round(
              hourlyData.temp
            )}°F</div>
          </div>
        </div>
        <div class="hourly__forecast--type">${toUppercase(description)}</div>
        <div class="hourly__forecast--humidity">
          Humidity: ${Math.round(hourlyData.humidity)}%
        </div>
      </div>
      `;

        hourlyForecastDataContainer.insertAdjacentHTML(
          'beforeend',
          hourlyString
        );

        // Adding 1 to hour
        hour++;
      }
    });
  };
  displayData();
};

// Render error in case of rejected promise
const renderError = function (msg) {
  const errorMsg = document.querySelector('.error__msg');
  errorMsg.textContent = msg;
  error.style.opacity = 1;
  error.style.pointerEvents = 'all';
};

// Takes a word or words and makes the first letter of each uppercase
const toUppercase = function (word) {
  return word
    .toLowerCase()
    .split(' ')
    .map((name) => name[0].toUpperCase() + name.slice(1))
    .join(' ');
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

// Autocomplete input function
function activatePlacesSearch() {
  const autocomplete = new google.maps.places.Autocomplete(input);
}

// Get location and display current weather
navigator.geolocation.getCurrentPosition((position) => {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;

  // Get city info from geocode reverse geocode API
  getJSON(`https://geocode.xyz/${latitude},${longitude}?geoit=json`)
    .then((data) => {
      cityName = toUppercase(data.city);
      stateName = data.statename;

      getWeatherData(
        `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${APIKey}&include=minutely&units=I`,
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${APIKey2}&units=imperial`
      );
    })
    .catch((err) => {
      renderError(`${err.message}`);
    })
    .finally(() => {
      mainContent.classList.add('view-main');
    });
});

// Get searched input location
searchBtn.addEventListener('click', function () {
  console.log(input.value.split(',')[0]);

  cityName = input.value.split(',')[0];
  stateName = input.value.split(',')[1];

  // Forward geocoding search input
  getJSON(`https://geocode.xyz/${cityName},${stateName},USA?json=1`)
    .then((data) => {
      latitude = data.latt;
      longitude = data.longt;

      // call function here

      //   Get weather for current geocodes
      getWeatherData(
        `https://api.weatherbit.io/v2.0/current?&city=${cityName},${stateName}&key=${APIKey}&include=minutely&units=I`,
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${APIKey2}&units=imperial`
      );
    })
    .catch((err) => {
      renderError(`${err.message}`);
    })
    .finally(() => mainContent.classList.add('view-main'));
});

// Search navigation toggle
searchNavBtn.addEventListener('click', () => {
  search.classList.toggle('search__toggle');
});

// WHAT DO I DO WITH THIS
