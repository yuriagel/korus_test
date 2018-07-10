const axios = require('axios');

let places = {};
 if (IS_OFFLINE) {
    places =require('./const').offlinePlace;
 }
 let config = {};
if (NODE_ENV==='production') { //Если это прод, то нужно ходить с куками, если нет, то нет
    config.headers = {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Accept-Encoding': 'gzip, deflate, br',
        'credentials': 'include',
        'withCredentials': true
    };
}

function getReq() {
    return axios.create(config);
}


function prepRouteParams(queryStringData) {
    return Object.keys(queryStringData)
        .map(function (key) {
            return key + '=' + encodeURIComponent(queryStringData[key]);
        }).join('&')
}

function prepUrl(type, queryStringData) {
    return _baseURL + type + '?' + prepRouteParams(queryStringData);
}

function getQueryStringData(city, lon, lat) {
    let params = {
        type: 'accurate',
        APPID: _APIKEY,
        lang: 'ru',
        cnt: 6
    };
    if (city) params.q = city;
    if (lon) params.lon = lon;
    if (lat) params.lat = lat;
    return params
}

function getForecast(city, lon, lat) {
    let queryStringData = getQueryStringData(city,lon,lat);
    let url = prepUrl('forecast/daily', queryStringData);

    return getReq().get(url)
        .then(forecastData => {
            return forecastData.data
        }).catch(e => {
            if (IS_OFFLINE) return places; //Если это офф режим, то возвращаем фейковую погоду
            return {error: e.response?e.response.data.message: e.message}
        });
}

module.exports = {
    getForecast: getForecast
};