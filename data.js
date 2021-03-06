/**
 * Created by szymon on 11.04.15.
 */
var xsdForecastWeather;
var xsdCurrentWeather;
var xsltCurrentWeather;
var xsltForecastWeather;

function validate(xmlData, schemaData) {
    var Module = {
        xml: xmlData,
        schema: schemaData,
        arguments: ["--noout", "--schema", "file.xsd", "file.xml"]
    };
    var result = validateXML(Module);
    console.log("xsd val result: " + result);

    return result;
}

function updateForecastWeatherView(xhr) {
    return function() {
        if(xhr.readyState == 4 ) {
            if(xhr.status != 200){
                showError();
                return;
            }

            console.log("validating forecast");
            console.log(xhr.responseText);
            var valid = validate(xhr.responseText, xsdForecastWeather);
            valid = valid.replace(/(\r\n|\n|\r)/gm,"");

            if(valid !== "file.xml validates") {
                showError();
                return;
            }
            showSuccess();

            console.log(xsltForecastWeather);
            var domParser = new DOMParser();
            var xsltProcessor = new XSLTProcessor();

            xsltProcessor.importStylesheet(domParser.parseFromString(xsltForecastWeather, "text/xml"));
            var forecastDocument = xsltProcessor.transformToFragment(domParser.parseFromString(xhr.responseText, "text/xml"), document);
            console.log(forecastDocument);
            $("#forecast").html(forecastDocument);
            var xml = $(xhr.responseXML);
            var count = xml.find('forecast').find('time').length;
            for(var i=1;i<=count;i++){
                var element = xml.find('forecast').children().eq(i-1);
                console.log(element);
                var icon = element.find('symbol').attr('var');
                var iconSrc = 'http://openweathermap.org/img/w/' + icon + '.png';
                $('#forecast'+i).attr('src', iconSrc);
            }
        }
    }
}

function showError() {
    $('#content').hide();
    $('#error').show();
}

function showSuccess() {
    $('#content').show();
    $('#error').hide();
}

function updateCurrentWeatherView(xhr) {
    return function() {
        if (xhr.readyState == 4){
            if(xhr.status != 200){
                showError();
                return;
            }

            console.log("validating current weather");
            console.log(xhr.responseText);
            var valid = validate(xhr.responseText, xsdCurrentWeather);
            valid = valid.replace(/(\r\n|\n|\r)/gm,"");

            if(valid !== "file.xml validates") {
                showError();
                return;
            }
            showSuccess();

            var xml = $(xhr.responseXML);

            var domParser = new DOMParser();
            var xsltProcessor = new XSLTProcessor();

            xsltProcessor.importStylesheet(domParser.parseFromString(xsltCurrentWeather, "text/xml"));
            var resultDocument = xsltProcessor.transformToFragment(domParser.parseFromString(xhr.responseText, "text/xml"), document);

            $('#spinner').hide();
            $("#weather").html(resultDocument);

            var icon = xml.find("weather").attr("icon");
            $('#weather_icon').attr('src', 'http://openweathermap.org/img/w/' + icon + '.png');
        }
    }
}

function getCurrentWeatherXHR(city, countryCode) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = updateCurrentWeatherView(xhr);
    var url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city /*+ ',' + countryCode*/ + '&mode=xml&APPID=23a8348bb03a1f28429fc59725f336cc';
    console.log(url);
    xhr.open("GET", url, true);
    xhr.send();
}

function getForecastWeatherXHR(city, countryCode) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = updateForecastWeatherView(xhr);
    var url = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + city +'&mode=xml&units=metric&cnt=6&APPID=23a8348bb03a1f28429fc59725f336cc';
    console.log(url);
    xhr.open("GET", url, true);
    xhr.send();
}

function init(){
    chrome.storage.sync.get(function (items) {
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

function getCurrentXsl(xhrXSLT) {
    xsltCurrentWeather = xhrXSLT.response;
}
function getForecastXsl(xhrXSLT) {
    xsltForecastWeather = xhrXSLT.response;
}

$(document).ready(function() {
    init();
    $('#btn_settings').click(function(){
        $('#error').hide();
        $('#content').fadeOut(function(){
            $('#settings').fadeIn(function(){
                chrome.storage.sync.get(function (items) {
                    $('#countrycode').val(items.country).focus();
                    $('#city').val(items.city).focus();
                });
            });
        });
    });

    $('#save_settings').click(function () {
        chrome.storage.sync.set({'city' : $('#city').val(), 'country' : $("#countrycode").val().toUpperCase()}, function () {
            $('#content').fadeIn(function() {
                $('#settings').fadeOut(function() {
                    $('#btn_refresh').click();
                });
            });
        });
    });

    $('#btn_refresh').click(function(){
        chrome.storage.sync.get(function (items) {
            //console.log(items);
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
    
    var xhr_current_xsl = new XMLHttpRequest();
    xhr_current_xsl.onload = function() {
        getCurrentXsl(xhr_current_xsl);
    };
    xhr_current_xsl.open("GET", "/current_weather.xsl", true);
    xhr_current_xsl.send();

    var xhr_forecast_xsl = new XMLHttpRequest();
    xhr_forecast_xsl.onload = function() {
        getForecastXsl(xhr_forecast_xsl);
    };
    xhr_forecast_xsl.open("GET", "/forecast.xsl", true);
    xhr_forecast_xsl.send();

});

