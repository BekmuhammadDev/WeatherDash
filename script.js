let cityinput = document.getElementById('city_input');
let searchBtn = document.getElementById('searchBtn');
let LocationBtn = document.getElementById('locationBtn');
let api_key = '1b47fff325be3126a9a50e640702811b';
let currentWeatherCard = document.querySelectorAll('.weather-left .card')[0];
let fiveDaysForecastCard = document.querySelector('.day-forecast');
let apiCard = document.querySelectorAll('.highlights .card')[0];
let sunriseCard = document.querySelectorAll('.highlights .card')[1];
let humdityVal = document.getElementById('humidityVal'),
    pressureVal = document.getElementById('pressureVal'),
    visibilityVal = document.getElementById('visibilityVal'),
    windSpeedval = document.getElementById('windSpeedval'),
    feelsval = document.getElementById('feelsval'),
    hourlyForecastCard = document.querySelector('.hourly-forecast')
aqiList = ['Yaxshi', 'normal', 'Ortacha', 'Yomon', 'juda yomon'];

function getWeatherDetails(city, lat, lon, country,) {
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
    let WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
    let API_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`;

    let days = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Pyshanba', 'Juma', 'Shanba'];
    let months = ['Yanvar', 'Fevral', 'Mart', 'April', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];

    fetch(API_POLLUTION_API_URL)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            let { co, no, no2, o3, so2, pm2_5, pm10, nh3 } = data.list[0].components;

            apiCard.innerHTML = `
                <div class="card-head">
                    <p>Havo sifati indeksi</p>
                    <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi - 1]}</p>
                </div>
                <div class="air-indices">
                    <i class="fa-regular fa-wind fa-3x"></i>
                    <div class="item"><p>PM2.5</p><h2>${pm2_5}</h2></div>
                    <div class="item"><p>PM10</p><h2>${pm10}</h2></div>
                    <div class="item"><p>SO2</p><h2>${so2}</h2></div>
                    <div class="item"><p>CO</p><h2>${co}</h2></div>
                    <div class="item"><p>NO</p><h2>${no}</h2></div>
                    <div class="item"><p>NO2</p><h2>${no2}</h2></div>
                    <div class="item"><p>NH3</p><h2>${nh3}</h2></div>
                    <div class="item"><p>O3</p><h2>${o3}</h2></div>
                </div>`;
        })
    fetch(WEATHER_API_URL)
        .then(res => {
            if (!res.ok) {
                throw new Error('Joriy ob-havoni olib bo‘lmadi');
            }
            return res.json();
        })
        .then(data => {
            let date = new Date();
            currentWeatherCard.innerHTML = `
                <div class="current-weather">
                    <div class="details">
                        <p>Hozir</p>
                        <h2>${data.main.temp.toFixed(2)}&deg;C</h2>
                        <p>${data.weather[0].description}</p>
                    </div>
                    <div class="weather-icon">
                        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
                    </div>
                </div>
                <hr>
                <div class="card-footer">
                    <p><i class="fa-light fa-calendar"></i> ${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}</p>
                    <p><i class="fa-light fa-location-dot"></i> ${city}, ${country}</p>
                </div>
            `;
            let { sunrise, sunset } = data.sys;
            let { timezone, visibility } = data,
                { humidity, pressure, feels_like } = data.main,
                { speed } = data.wind

            let sRiseTime = moment.utc(sunrise, 'X').add(timezone, 'seconds').format('hh:mm A');
            let sSetTime = moment.utc(sunset, 'X').add(timezone, 'seconds').format('hh:mm A');

            sunriseCard.innerHTML = `
                <div class="card-head">
                    <p>Quyosh chiqishi-botishi</p>
                </div>
                <div class="sunrise-sunset">
                    <div class="item">
                        <div class="icon"><i class="fa-light fa-sunrise fa-4x"></i></div>
                        <div>
                            <p>Quyosh chiqishi</p>
                            <h2>${sRiseTime}</h2>
                        </div>
                    </div>
                    <div class="item">
                        <div class="icon"><i class="fa-light fa-sunset fa-4x"></i></div>
                        <div>
                            <p>Quyosh botishi</p>
                            <h2>${sSetTime}</h2>
                        </div>
                    </div>
                </div>`;

            humdityVal.innerHTML = `${humidity}%`;
            pressureVal.innerHTML = `${pressure}hPa`;
            visibilityVal.innerHTML = `${visibility / 1000}km`;
            windSpeedval.innerHTML = `${speed}m/s`;
            feelsval.innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;C`;

        })
        .catch(() => {
            alert('Joriy ob-havoni olib bo‘lmadi');
        });
    fetch(FORECAST_API_URL)
        .then(res => res.json())
        .then(data => {
            let hourlyforecast = data.list;
            hourlyForecastCard.innerHTML = '';
            for (i = 0; i <= 7; i++) {
                let hrForecastDate = new Date(hourlyforecast[i].dt_txt);
                let hr = hrForecastDate.getHours();
                let a = 'PM';
                if (hr < 12) a = 'AM';
                if (hr == 0) hr = 12;
                if (hr > 12) hr = hr - 12;
                hourlyForecastCard.innerHTML += `
                <div class="card">
                        <p>${hr} ${a}</p>
                        <img src="https://openweathermap.org/img/wn/${hourlyforecast[i].weather[0].icon}.png" alt="">
                        <p>${(hourlyforecast[i].main.temp - 273.15).toFixed(2)}&deg;C</p>
                    </div>`
            }

            let uniqueForecastDays = [];
            let fiveDaysForecast = data.list.filter(forecast => {
                let forecastdate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastdate)) {
                    uniqueForecastDays.push(forecastdate);
                    return true;
                }
                return false;
            });

            fiveDaysForecastCard.innerHTML = '';
            for (let i = 1; i < fiveDaysForecast.length; i++) {
                let date = new Date(fiveDaysForecast[i].dt_txt);
                fiveDaysForecastCard.innerHTML += `
                    <div class="forecast-item">
                        <div class="icon-wrapper">
                            <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}.png" alt="">
                            <span>${fiveDaysForecast[i].main.temp.toFixed(2)}&deg;C</span>
                        </div>
                        <p>${date.getDate()} ${months[date.getMonth()]}</p>
                        <p>${days[date.getDay()]}</p>
                    </div>
                `;
            }
        })
        .catch(() => {
            alert('Ob-havo maʼlumotlarini olib boʻlmadi');
        });
}

function getCityCoordinates() {
    let cityname = cityinput.value.trim();
    cityinput.value = '';
    if (!cityname) return;

    let GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=1&appid=${api_key}`;

    fetch(GEOCODING_API_URL)
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                throw new Error('City not found');
            }
            let { name, lat, lon, country, state } = data[0];
            getWeatherDetails(name, lat, lon, country, state);
        })
        .catch(() => {
            alert('Shaxar Topilmadi !');
        });
}

function getUserCoordinates(){
    navigator.geolocation.getCurrentPosition(position =>{
        let { latitude, longitude } = position.coords;
        let REVERSE_GEOCODING_URL =`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit&appid=${api_key}`

        fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data =>{
           let {name, country, state} = data[0];
           getWeatherDetails(name, latitude, longitude, country, state);
        }).catch(()=>{
            alert('Joylashuv aniqlanmadi');
        })
    }), error => {
        if(error.code === error.PERMISSION_DENIED){
            alert(`Foydalanuvchi Geolocation so'rovini rad etdi.`);
        }
    }
}
searchBtn.addEventListener('click', getCityCoordinates);
LocationBtn.addEventListener('click', getUserCoordinates);
cityinput.addEventListener('ketup', e => e.key === 'Enter' && getCityCoordinates())
window.addEventListener('load', getUserCoordinates);
