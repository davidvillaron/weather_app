const searchBar = document.querySelector('.search-bar');
const matchList = document.querySelector('.match-list');
const btnIcon = document.querySelector('.btn-icon')

const API_KEY = '791443a46a9e23129a1579b7df7a8dd5';
const currCity = document.getElementById('curr-city');
const currentTemp = document.getElementById('curr-temperature');
const currentDescription = document.getElementById('curr-description');
const humidityTemp = document.getElementById('humidity-temp');
const feelsTemp = document.getElementById('feel-temp');
const minimumTemp = document.querySelector('.min-temp');
const maxTemperature = document.querySelector('.max-temp');
const iconInsert = document.getElementById('icon-description');
const forecastCardsSec = document.querySelector('.sec-container')

// search API based on pressing Enter on Keyboard.
const searchbar = searchBar.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchCity(searchBar.value);
    getForecast(searchBar.value)
    searchBar.value = '';
    matchList.innerHTML = '';
  }   
});

// search by clicking search icon
const searchByIcon = btnIcon.addEventListener('click', () => {
  const btnValue = searchBar.value;
   searchCity(btnValue);
   getForecast(btnValue)
   searchBar.value = '';
   matchList.innerHTML = '';
});


// Get JSON data for API state/city ID query
const searcAPICityId = async text => {
  const data = await fetch('../json/cities.json')
  .then((data) => data.json());

  //Smooth out the search with Timeout
  setTimeout(() => {
    let matchText = data.filter( city => {
      const regFilter = new RegExp(`^${text}`, 'gi');
      //control search flow
      if (text.length >= 3) {
        return city.name.match(regFilter);
      };
    });
    if (text.length === 0) {
      matchText = [];
      matchList.innerHTML = '';
    }
    outputHtml(matchText);
  }, 500);
  
};

//Displaying our JSON list of searched query
const outputHtml = matchedText => {
  if ( matchedText.length < 12 ) {

    const content = matchedText.map( match => 
      `
      <div class="card-elem list-group-item list-group-item-action" aria-current="true">
        <div class="d-flex w-100 justify-content-between" id="city-id" >
          <h3 class="mb-1">${match.name}</h3>
          <h6>${match.country} </h6>
        </div>
        <h5 class="mb-1"> ${match.state} </h5>
        
        <div class="d-grid gap-2 col-6 mx-auto">
          <button class="btn" type="button">
          Select
          <small class="id-matches">${match.id}</small>
          </button>
        </div>
       </div>
      `).join('');
      matchList.innerHTML = content;
      if (content) {
        let clickEl = document.querySelectorAll('.btn');
        const stateIdPick = clickEl.forEach((e) => {
          //Hide StateId
          const smallTag = document.querySelectorAll('.id-matches');
          smallTag.forEach( e => {
            e.style.visibility = 'hidden';
          })

          e.addEventListener('click', () => {
            //parsing for id code
            const stateId = e.children[0].innerHTML;
            searchByCityId(stateId);
            getForecastById(stateId);
            matchList.innerHTML = '';
            searchBar.value = '';

          })
        })
      }
  }
};

//listening for input to display accordingly for JSON file
searchBar.addEventListener('input', () => searcAPICityId(searchBar.value));


//Calling API and searching based on State/city ID
const searchByCityId = async idClick => {
  const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?id=${idClick}&units=imperial&appid=${API_KEY}`)
  const data = response.data;
  const coordLat = data.coord.lat;
  const coordLng = parseFloat(data.coord.lon);
  const main = response.data.main;
  const weather = response.data.weather[0];

  getCityName(data);
  getCurrentWeather(main);
  currDescription(weather);
  initMap(coordLat, coordLng)

};



// API request by City
const searchCity = async searchBarEnter => {
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${searchBarEnter}&units=imperial&appid=${API_KEY}`);
    
    const data = response.data;
    const coordLat = data.coord.lat;
    const coordLng = parseFloat(data.coord.lon);
    const main = response.data.main;
    const weather = response.data.weather[0];
    // console.log(typeof coordLat, coordLng)
    getCityName(data);
    getCurrentWeather(main);
    currDescription(weather);
    initMap(coordLat, coordLng)
    console.log(initMap)

  } catch (e) {
    console.log('Please check your spelling', e);
    alert('Please make sure you spelled the city correctly');
  }
};

//API 5 day forecast call by State/City ID CLick
async function getForecastById(cityID) {
  try {
    const res = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?id=${cityID}&units=imperial&appid=${API_KEY}`);
    const forecastList = res.data.list;
    forecastCardsSec.innerHTML = '';

    // length 40 days at intervals of 8/
    for ( let i = 0; i < forecastList.length; i+=8) {
      // console.log(forecastList[i]);
      let temp = Math.round(forecastList[i].main.temp);
      let tempMin = forecastList[i].main.temp_min;
      let tempMax = forecastList[i].main.temp_max;
      let dates = new Date(forecastList[i].dt_txt);
      let localDate = dates.toDateString(); // Mon Jun 27 2022
      let tempIcon = forecastList[i].weather[0].icon;
      let tempDesc = forecastList[i].weather[0].description;

      let iconDaily = `http://openweathermap.org/img/wn/${tempIcon}@2x.png`;

      forecastCardsSec.insertAdjacentHTML("afterbegin",
      `
      <div class="forcast-card">
        <h6 class="cast-date">${localDate}</h6>
        <img class="daily-icon" src="${iconDaily}" alt="temp icons">
        <p class="cast-tempt">${tempMin} / ${tempMax}</p>
        <p class"cast-desc">${tempDesc}</p>
      </div>
      `);
    }

  } catch (e) {
    console.log('Oops! Something went wrong', e);
    alert('Something went wrong, please try again');
  }
};

// API 5 day forecast call by search value
const getForecast = async forecastCity => {
  try {
    const res = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${forecastCity}&units=imperial&appid=${API_KEY}`)
    let forecastList = res.data.list // || res2.data.list;
    forecastCardsSec.innerHTML = '';
    console.log(forecastList);
    
   // length 40 days at intervals of 8/
    for ( let i = 0; i < forecastList.length; i+=8) {
      // console.log(forecastList[i]);
      let temp = Math.round(forecastList[i].main.temp);
      let tempMin = forecastList[i].main.temp_min;
      let tempMax = forecastList[i].main.temp_max;
      let dates = new Date(forecastList[i].dt_txt);
      let localDate = dates.toDateString(); // Mon Jun 27 2022
      let tempIcon = forecastList[i].weather[0].icon;
      let tempDesc = forecastList[i].weather[0].description;

      let iconDaily = `http://openweathermap.org/img/wn/${tempIcon}@2x.png`;

      forecastCardsSec.insertAdjacentHTML("afterbegin",
      `
      <div class="forcast-card">
        <h6 class="cast-date">${localDate}</h6>
        <img class="daily-icon" src="${iconDaily}" alt="temp icons">
        <p class="cast-tempt">${tempMin} / ${tempMax}</p>
        <p class"cast-desc">${tempDesc}</p>
      </div>
      `);
    }
  } catch (e) {
    console.log('Error. Check again', e)
  };
};

// get current weather data info
const getCurrentWeather = async currTemp => {
  const temp = Math.round(currTemp.temp);
  const maxTemp = currTemp.temp_max;
  const minTemp = currTemp.temp_min;
  const humidity = currTemp.humidity;
  const feelsLike = Math.round(currTemp.feels_like);
  // inserting
  currentTemp.innerText = temp + '℉';
  humidityTemp.textContent = humidity;
  feelsTemp.textContent = feelsLike + '℉';
  minimumTemp.firstElementChild.innerText = minTemp;
  maxTemperature.firstElementChild.innerText = maxTemp;
};

const currDescription = desc => {
  const description = desc.description; // haze
  const icon = desc.icon; // ie: '50n'
  const id = desc.id; // ie: 721
  iconInsert.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  currentDescription.textContent = description;

};

const getCityName = cityName => {
  const name = cityName.name;
  currCity.textContent = name;
};

// google maps
let map;

async function initMap(lat, lng) {
  map = await new google.maps.Map(document.getElementById("map"), 
  {
    center: { 
      lat: lat, 
      lng: lng
    },
    zoom: 10,
  });

};
window.initMap = initMap;