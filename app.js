'use strict';

// Variables
const airQualityDisplay = document.querySelector('.extra__data--aqi');
const APIKey = '135a94105a0042b5a55fb5628dcfb302';
const APIKey2 = 'a33df676f47b9be9a8072c268d067eb3';
const body = document.querySelector('body');
let circleNum = 0;
const cityDisplay = document.querySelector('.weather__info--city');
let cityName;
let curCircle;
const date = new Date();
const dateDisplay = document.querySelector('.date');
const error = document.querySelector('.error');
const errorBtn = document.querySelector('.error__btn');
const feelsLikeDisplay = document.querySelector('.extra__data--feels-like');
const hourlyForecastData = document.querySelectorAll('.hourly__forecast--data');
let individualTab;
const input = document.querySelector('.search__city');
let latitude;
let longitude;
const mainContent = document.querySelector('.main');
let maxSlide;
const search = document.querySelector('.search');
const searchBtn = document.querySelector('.search__city-btn');
const searchCityTab = document.querySelector('.search__city-tabs');
const searchNavBtn = document.querySelectorAll('.open-close__btn');
let searchTabCity;
let searchTabTemp;
let slides;
let stateName;
const tempDisplay = document.querySelector('.weather__info--temp');
const title = document.querySelector('.app__title');
const toggleBtnLeft = document.querySelector('.toggle-circles__left');
const toggleBtnRight = document.querySelector('.toggle-circles__right');
let toggleCircles;
const typeDisplay = document.querySelector('.weather__info--type');
const weatherIconDisplay = document.querySelector('.weather__info--icon');
const weatherInfoContainer = document.querySelector('.weather__info');
const windInfoDisplay = document.querySelector('.extra__data--wind-info');

// Get response for each fetch
const getJSON = (url) => {
  return fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`Something went wrong (${res.status}). Try again!`);
    }
    return res.json();
  });
};

const cityClass = () => {
  return !cityName.includes(' ') ? cityName : cityName.split(' ').join('-');
};

// Function for city tab to select a specific city
const cityTabSelect = () => {
  individualTab.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      // Translate main element
      mainContent.style.transform = `translateX(-${100 * i}%)`;
      // Set current slide equal to i so it doesn't mess up the right/left buttons
      curSlide = i;
      // Change circle to current position of selected city
      changeCircle();
      // Close nav bar
      search.classList.remove('search__toggle');
    });
  });
};

const getWeatherData = (url1, url2) => {
  const displayData = () => {
    // Get current weather data
    getJSON(url1).then((data) => {
      const cityData = data.data[0];
      const stateCode = cityData.state_code;
      const weatherIcon = cityData.weather.icon;

      // Change background color depending on time of day
      if (cityData.pod == 'd') {
        body.classList.remove('night-background');
        body.classList.add('day-background');
      } else if (cityData.pod == 'n') {
        body.classList.remove('day-background');
        body.classList.add('night-background');
      }

      title.textContent = `InstaWeather | ${cityName}, ${stateCode}`;

      const insertCurrentWeather = () => {
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

        <!-- 24 hour forecast -->
        <div class="main__24-hour-forecast">
          <div class="hourly__forecast">
            <p class="hourly__forecast--heading">Hourly forecast</p>
            <div class="hourly__forecast--data-container" id=${cityClass()}></div>
          </div>
        </div>
      </div>
      `;
        mainContent.insertAdjacentHTML('beforeend', mainHTML);
      };
      insertCurrentWeather();

      const searchTabHTML = `
      <div class="search__city-tab">
        <div class="search__city-tab--city search__city-tab--${cityClass()}"></div>
        <div class="search__city-tab--temp search__city-tab--${cityClass()}1"></div>
      </div>`;

      searchCityTab.insertAdjacentHTML('beforeend', searchTabHTML);

      // Current location tab
      searchTabCity = document.querySelector(
        `.search__city-tab--${cityClass()}`
      );
      searchTabTemp = document.querySelector(
        `.search__city-tab--${cityClass()}1`
      );

      searchTabCity.textContent = `${cityName}, ${stateCode}`;
      searchTabTemp.textContent = `${Math.round(cityData.temp)}°F`;

      individualTab = document.querySelectorAll('.search__city-tab');
      cityTabSelect();
    });
    getJSON(url2).then((data) => {
      const hourlyForecastDataContainer = document.querySelector(
        `#${cityClass()}`
      );

      // Hour for boxes
      let hour = date.getHours() + 1;

      // Function to decide whether forecast should display AM or PM
      const futureHours = (hour) => {
        if (hour > 12) return `${(hour %= 12)} PM`;
        else if (hour === 0) return `12 AM`;
        else if (hour === 12) return `${hour} PM`;
        else return `${hour} AM`;
      };

      // Iterating through each box and displaying data for that hour
      for (let i = 0; i < 23; i++) {
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

      // Setting slides for toggle feature
      slides = document.querySelectorAll('.main__city-container');
      maxSlide = slides.length - 1;

      // Selecting toggle circle each time a new city is added
      toggleCircles = document.querySelectorAll('.toggle-circles__circle');
    });
  };
  displayData();
};

// Render error in case of rejected promise
const renderError = (msg) => {
  const errorMsg = document.querySelector('.error__msg');
  errorMsg.textContent = msg;
  error.style.opacity = 1;
  error.style.pointerEvents = 'all';
};

// Takes a word or words and makes the first letter of each uppercase
const toUppercase = (word) => {
  return word
    .toLowerCase()
    .split(' ')
    .map((name) => name[0].toUpperCase() + name.slice(1))
    .join(' ');
};

// Function to change the circle when user changes slide
const changeCircle = () => {
  toggleCircles.forEach((circle) => {
    circle.classList.remove('circle-selected');
  });

  curCircle = document.querySelector(`.toggle-circles__circle-${curSlide}`);
  curCircle.classList.add('circle-selected');
};

// Button to reload page in case of an error
errorBtn.addEventListener('click', () => location.reload());

// Date function for header
const displayDate = ((date) => {
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
searchBtn.addEventListener('click', () => {
  const cityInput = input.value.toLowerCase().split(',')[0];
  cityName = input.value.split(',')[0];
  stateName = input.value.toLowerCase().split(',')[1];

  // Forward geocoding search input
  getJSON(`https://geocode.xyz/${cityInput},${stateName},us?json=1`)
    .then((data) => {
      latitude = data.latt;
      longitude = data.longt;

      //   Get weather for current geocodes
      getWeatherData(
        `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${APIKey}&include=minutely&units=I`,
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${APIKey2}&units=imperial`
      );
    })
    .catch((err) => {
      renderError(`${err.message}`);
    })
    .finally(() => {
      // Insert toggle circle
      const circle = `
      <div class="toggle-circles__circle toggle-circles__circle-${
        1 + circleNum
      }">
        <i class="fas fa-circle"></i>
      </div>`;
      const toggleCirclesContainer = document.querySelector('.toggle-circles');
      toggleCirclesContainer.insertAdjacentHTML('beforeend', circle);
      circleNum += 1;
    });

  // Clear input value
  input.value = '';
});

// Search navigation toggle
searchNavBtn.forEach((btn) => {
  btn.addEventListener('click', () => {
    search.classList.toggle('search__toggle');
  });
});

// Switch slides feature
let curSlide = 0;

// Next Slide
const nextSlide = function () {
  if (curSlide === maxSlide) {
    curSlide = 0;
    mainContent.style.transform = `translateX(0%)`;
  } else {
    curSlide++;
    mainContent.style.transform = `translateX(-${100 * curSlide}%)`;
  }

  // Change circle to current slide
  changeCircle();
};

// Previous Slide
const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide;
    mainContent.style.transform = `translateX(-${100 * maxSlide}%)`;
  } else {
    curSlide--;
    mainContent.style.transform = `translateX(-${100 * curSlide}%)`;
  }

  // Change circle to current slide
  changeCircle();
};

toggleBtnRight.addEventListener('click', nextSlide);
toggleBtnLeft.addEventListener('click', prevSlide);

// WHAT DO I DO WITH THIS
