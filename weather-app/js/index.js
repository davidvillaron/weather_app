const searchBar = document.querySelector('.search-bar');
const btn = document.querySelector('.btn')
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
  }   
})

// search by clicking icon
const searchByIcon = btn.addEventListener('click', () => {
  const btnValue = searchBar.value;
   console.log(btnValue);
   searchCity(btnValue);
   searchBar.value = '';
});

// API request by City
const searchCity = async searchBarEnter => {
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${searchBarEnter}&units=imperial&appid=${API_KEY}`);
    const data = response.data;
    const main = response.data.main;
    const weather = response.data.weather[0];
    getCityName(data);
    getCurrentWeather(main);
    currDescription(weather);

  } catch (e) {
    console.log('Please check your spelling', e);
    alert('Please make sure you spelled the city correctly');
  }
}

// API 5 day forecast call
const getForecast = async forecastCity => {
  try {
    const res = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${forecastCity}&units=imperial&appid=${API_KEY}`)
    let forecastList = res.data.list;
    forecastCardsSec.innerHTML = '';
    
   // length 40 days at intervals of 8/
    for ( let i = 0; i < forecastList.length; i+=8) {
      console.log(forecastList[i]);
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
}

const currDescription = desc => {
  const description = desc.description; // haze
  const icon = desc.icon; // ie: '50n'
  const id = desc.id; // ie: 721
  iconInsert.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  currentDescription.textContent = description;

}

const getCityName = cityName => {
  const name = cityName.name;
  currCity.textContent = name;
}