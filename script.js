let weather = {
    "apiKey": "93db155a8ef4aa952a0f37bd12123832",
    fetchWeather: function (city) {
      fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" 
      + city 
      + "&units=imperial&appid=" 
      + this.apiKey
      )
      .then((response) => response.json())
      .then((data) => this.displayWeather(data));
    },
    displayWeather: function(data) {
        const { name } = data;
        const { icon,description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        console.log(name,icon,description,temp,humidity,speed)
        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src = 
        "https://openweathermap.org/img/wn/" + icon + "@2x.png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°F";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind Speed: " + speed + "mph";
        document.querySelector(".weather").classList.remove("loading");
        document.body.style.backgroundImage = "url('https://source.unsplash.com/2880x1900/?" + name + "')"
    },
    search: function () {
        this.fetchWeather(document.querySelector(".search-bar").value);
    }
};

document.querySelector(".search button")
.addEventListener("click", function () {
    weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
        weather.search();
    }
});

const timeEl = document.getElementById('time');
const dateEl =document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Satuday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY ='93db155a8ef4aa952a0f37bd12123832';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour 
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursIn12HrFormat < 10? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0' + minutes: minutes)+ '' + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month]
},1000)

function getWeatherData () {
    navigator.geolocation.getCurrentPosition((success) => {
        console.log(success);

        let(latitude, longitude ) = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=imperial&appid=${API_KEY}`).then(res => res.json()).then(data => {
            console.log(data)
            showWeatherData(data);
        })
    })
}

function showWeatherData (data){
    let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;
    
    timezone.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + 'N ' + data.lon + 'E '

    currentWeatherItemsEl.innerHTML =
            `<div class="weather-item">
              <p>Humidity</p>
              <p>${humidity}%</p>
            </div>
            <div class="weather-item">
              <p>$Pressure</p>
              <p>${pressure}</p>
            </div>
            <div class="weather-item">
              <p>Wind Speed</p>
              <p>${wind_speed}</p>
            </div>
            <div class="weather-item">
            <p>Sunrise</p>
            <p>${window.moment(sunrise * 1000).format('HH:mm a')}</p>
          </div>
          <div class="weather-item">
          <p>Sunset</p>
          <p>${window.moment(sunset * 1000).format('HH:mm a')}</p>
        </div>
            
            
            `;

            data.daily.forEach((day, idx) => {
                if(idx ==0){
                    currentTempEl.innerHTML =`
                    <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other"> 
                <div class="day">${window.moment(day.dt*1000).format('ddd')
            }</div>
                <div class="temp">Night - ${day.temp.night}&#176; F</div>
                <div class="temp">Day - ${day.temp.day}&#176; F</div>
        </div>
        
        `
                } else {
                    otherDayForecast += `<div class="weather-forecast-item">
                    <div class="day">${window.moment(day.dt*1000).format('ddd')
                }</div>
                    <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                    <div class="temp">Night - ${day.temp.night}&#176; F</div>
                    <div class="temp">Day - ${day.temp.day}&#176; F</div>
                </div>`
                }
            })


        weatherForecastEl.innerHTML = otherDayForecast;    
}
