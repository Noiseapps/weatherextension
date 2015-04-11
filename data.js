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

function getCurrentWeatherXHR(city, countryCode) {
    var xhr = new XMLHttpRequest();
    //xhr.onreadystatechange = handleStateChange; // Implemented elsewhere.
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            // JSON.parse does not evaluate the attacker's scripts.
            //var resp = XML.parse(xhr.responseText);
            //console.log(resp);
            console.log(xhr.responseText);
        }
    }
    xhr.open("GET", 'http://api.openweathermap.org/data/2.5/weather?q='+ city + ',' + countryCode +'&mode=xml', true);
    xhr.send();
}

$(document).ready(function() {
    $('#btn_get_cur_weather').click(function(){
        getCurrentWeatherXHR('Lodz','pl');
    });

});

