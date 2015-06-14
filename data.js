/**
 * Created by szymon on 11.04.15.
 */
var xsdCurrentWeather;
var xsdForecastWeather;

function validate(xmlData, schemaData) {
    var Module = {
        xml: xmlData,
        schema: schemaData,
        arguments: ["--noout", "--schema", "file.xsd", "file.xml"]
    };

    var result = validateXML(Module);
    console.log("xsd val result: " + result);
}

function updateForecastWeatherView(xhr) {
    return function() {
        if(xhr.readyState == 4) {
            //console.log("forecast: ");
            console.log("validating forecast");
            console.log(xhr.responseText);
            console.log(xsdForecastWeather);
            validate(xhr.responseText, xsdForecastWeather);
        }
    }
}

function updateCurrentWeatherView(xhr) {
    return function() {
        if (xhr.readyState == 4) {
            console.log(xhr.responseText);
            //$('#response').html(xhr.responseText);

            validate(xhr.responseText, xsdCurrentWeather);


            $xml = $(xhr.responseXML);

            var values = new Array(2);

            var icon = $xml.find("weather").attr("icon");
            $('#weather_icon').attr('src', 'http://openweathermap.org/img/w/' + icon + '.png');

            var condition = $xml.find('weather').attr('value');
            $('#condition').text(condition);

            /*$temp_cels = Math.round($xml.find("temperature").attr('value')- 273.15);
            values[0] = new Array(3);
            values[0][0] = "Temperature";
            values[0][1] = $temp_cels;
            values[0][2] = "\xB0C"

            $humidity = $xml.find("humidity");
            $humidity_val = $humidity.attr('value');
            $humidity_unit = $humidity.attr('unit');
            values[1] = new Array(3);
            values[1][0] = "Humidity";
            values[1][1] = $humidity_val;
            values[1][2] = $humidity_unit;

            $pressure = $xml.find("pressure");
            values[2] = new Array(3);
            values[2][0] = "Pressure";
            values[2][1] = $pressure.attr('value');
            values[2][2] = $pressure.attr('unit');

            $clouds = $xml.find("clouds");
            values[3] = new Array(3);
            values[3][0] = "Clouds";
            values[3][1] = $clouds.attr('value');
            values[3][2] = $clouds.attr('name');

            var response = "";

            for(var i=0; i<values.length; i++) {
                response += values[i][0] + ": " + values[i][1] + " " + values[i][2] + "<br>";
            }

            //console.log("text: " + response);
            $('#response').html(response);*/

        }
    }
}

function getCurrentWeatherXHR(city, countryCode) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = updateCurrentWeatherView(xhr);
    xhr.open("GET", 'http://api.openweathermap.org/data/2.5/weather?q='+ city + ',' + countryCode +'&mode=xml&APPID=23a8348bb03a1f28429fc59725f336cc', true);
    xhr.send();
}

function getForecastWeatherXHR(city, countryCode) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = updateForecastWeatherView(xhr);
    xhr.open("GET", 'http://api.openweathermap.org/data/2.5/forecast/daily?q='+ city + ',' + countryCode +'&mode=xml&units=metric&cnt=7&APPID=23a8348bb03a1f28429fc59725f336cc', true);
    xhr.send();
}

function init(){
    console.log("init");

    chrome.storage.sync.get(function (items) {
        console.log(items);
        var city = items.city;
        var countryCode = items.country;
        if(city === undefined || countryCode === undefined || city.length == 0 || countryCode.length == 0){
            $('#btn_settings').click();
        } else {
            $('#cityname').text(city + ", " + countryCode.toUpperCase());
            getCurrentWeatherXHR(city, countryCode);
            getForecastWeatherXHR(city, countryCode);
        }
    });
}

$(document).ready(function() {
    init();

    $('#btn_get_cur_weather').click(function(){
        var city = $('#input_city_name').val();
        var countryCode = $('#input_locale').val();
        getCurrentWeatherXHR(city, countryCode);
        getForecastWeatherXHR(city, countryCode);
    });

    $('#btn_settings').click(function(){
        $('#content').fadeOut();
        $('#settings').fadeIn();
        chrome.storage.sync.get(function (items) {
            $('#countrycode').val(items.country).focus();
            $('#city').val(items.city).focus();
        });
    });

    $('#save_settings').click(function () {
        chrome.storage.sync.set({'city' : $('#city').val(), 'country' : $("#countrycode").val()}, function () {
            $('#content').fadeIn();
            $('#settings').fadeOut();
            $('#btn_refresh').click();
        });
    });

    $('#btn_refresh').click(function(){
        chrome.storage.sync.get(function (items) {
            console.log(items);
            var city = items.city;
            var countryCode = items.country;
            if(city === undefined || countryCode === undefined || city.length == 0 || countryCode.length == 0){
                    $('#btn_settings').click();
                } else {
            		$('#cityname').text(city + ", " + countryCode.toUpperCase());
                    getCurrentWeatherXHR(city, countryCode);
                    getForecastWeatherXHR(city, countryCode);
                }
        });
    });

    // Get current weather XSD
    var xhr_current = new XMLHttpRequest();
    xhr_current.onload = function() { xsdCurrentWeather = xhr_current.response; };
    xhr_current.open("GET", '/current-weather.xsd', true);
    xhr_current.send();

    // Get forecast XSD
    var xhr_forecast = new XMLHttpRequest();
    xhr_forecast.onload = function() { xsdForecastWeather = xhr_forecast.response; };
    xhr_forecast.open("GET", '/forecast-weather.xsd', true);
    xhr_forecast.send();

});

