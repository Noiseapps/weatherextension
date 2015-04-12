/**
 * Created by szymon on 11.04.15.
 */

/*function getCurrentWeatherXML(city, countryCode, callback, errorCallback) {
    var apiUrl = 'api.openweathermap.org/data/2.5/weather?q='+ city + ',' + countryCode +'&mode=xml';
    var x = new XMLHttpRequest();
    x.open('GET', apiUrl);
    // The Google image search API responds with JSON, so let Chrome parse it.
    x.responseType = 'xml';
    //x.onload = function() {
        // Parse and process the response from Google Image Search.
        //var response = x.response;
        //if (!response || !response.responseData || !response.responseData.results ||
        //    response.responseData.results.length === 0) {
        //    errorCallback('No response from Google Image search!');
        //    return;
        //}
        //var firstResult = response.responseData.results[0];
        // Take the thumbnail instead of the full image to get an approximately
        // consistent image size.
        //var imageUrl = firstResult.tbUrl;
        //var width = parseInt(firstResult.tbWidth);
        //var height = parseInt(firstResult.tbHeight);
        //console.assert(
        //    typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
        //    'Unexpected respose from the Google Image Search API!');
        //callback(imageUrl, width, height);
    //};
    //x.onerror = function() {
    //    errorCallback('Network error.');
    //};
    x.send();
};*/

function updateCurrentWeatherView(xhr) {
    return function() {
        if (xhr.readyState == 4) {
            console.log(xhr.responseText);
            //$('#response').html(xhr.responseText);

            $xml = $(xhr.responseXML);

            var values = new Array(2);

            $temp_cels = Math.round($xml.find("temperature").attr('value')- 273.15);
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

            console.log("text: " + response);
            $('#response').html(response);

        }
    }
}

function getCurrentWeatherXHR(city, countryCode) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = updateCurrentWeatherView(xhr); // Implemented elsewhere.
    xhr.open("GET", 'http://api.openweathermap.org/data/2.5/weather?q='+ city + ',' + countryCode +'&mode=xml&APPID=23a8348bb03a1f28429fc59725f336cc', true);
    xhr.send();
}

$(document).ready(function() {
    $('#btn_get_cur_weather').click(function(){
        var city = $('#input_city_name').val();
        var countryCode = $('#input_locale').val();
        getCurrentWeatherXHR(city, countryCode);
    });

});

