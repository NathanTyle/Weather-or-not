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
};