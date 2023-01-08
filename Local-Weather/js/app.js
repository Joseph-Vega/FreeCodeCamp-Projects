function weatherRequest() {
    var ipAPI = "http://ip-api.com/json/?";

    $.getJSON(ipAPI, function(data) {
        getWeather(data);
    });
}
function getWeather(userLocation) {
    var openWeatherAPI = "http://api.openweathermap.org/data/2.5/weather?";
    var userLat = "lat=" + userLocation.lat;
    var userLon = "lon=" + userLocation.lon;
    var units = "&units=metric";
    var openWeatherID = "&APPID=0b1629a096d2bbd9a0d7a08608c31591";
    var weatherDataURL = openWeatherAPI + userLat + "&" + userLon + units + openWeatherID;

    $.getJSON(weatherDataURL, function(data) {
        displayWeather(data);
    });
}
function displayWeather(weatherData) {
    $("#location").text(weatherData.name + ', ' + weatherData.sys.country);
    $("#temperature #tempNum").text(Math.round(parseFloat(weatherData.main.temp)));
    $("#weather-description").text(weatherData.weather[0].main);
    var weatherIconURL = "http://openweathermap.org/img/w/" + weatherData.weather[0].icon + ".png";
    $("#weather-icon").html('<img src="' + weatherIconURL + '"' + 'alt="Weather Icon" height="75" width="75"/>');
}
function changeTemperature(temperatureUnit) {
    var currentTemperature = parseFloat($("#temperature #tempNum").text());

    if (temperatureUnit === "°C") {
        currentTemperature = (currentTemperature * 9) / 5 + 32;
        $("#temperature #tempUnit").text("°F");
        $("#convertTemperature").text("Change to °C");
    } else {
        currentTemperature = (currentTemperature - 32) * 5 / 9;
        $("#temperature #tempUnit").text("°C");
        $("#convertTemperature").text("Change to °F");
    }
    $("#temperature #tempNum").text(Math.round(currentTemperature));
}
$(document).ready(function() {

    weatherRequest();

    $("#convertTemperature").click(function() {
        var temperatureUnit = $("#temperature #tempUnit").text();
        changeTemperature(temperatureUnit);
    });
});
