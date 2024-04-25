const formSubmit = document.getElementById('submit');
const citySearch = document.getElementById('search');
const cityName = document.getElementById('cityName');

const todaysWeather = document.getElementById('todayWeather');


formSubmit.addEventListener('submit', e => {
    e.preventDefault()
    let searchQuery = citySearch.value
    getCityCoordinates(searchQuery)
    citySearch.value = '';
})




const apiKey = 'baee951685e061a0382c14d1c8f142d7';

function getCityCoordinates(city) {
    let x;

    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;

    let name;
    let country;
    let lat;
    let lon;

    let cityMatch;

    fetch(url)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        console.log(data);
        if(data.length === 0) {
            alert('no city found')
        } else {
            name = data[0].name;
            country = data[0].country;
            lat = data[0].lat;
            lon = data[0].lon;
            cityMatch = {
                cityName: name,
                countryName: country,
                latititude: lat,
                longitude: lon
            };
            cityName.textContent = `${name}`
            getWeather(cityMatch)
        }
        
    });  
};


function getWeather(cityMatch) {
    console.log('city match', cityMatch.latititude)
    const url = `https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=${cityMatch.latititude}&lon=${cityMatch.longitude}&appid=${apiKey}`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log('current weather object', data)
        // clear list
        todaysWeather.innerHTML = ``
        // Actual temp
        let temp = document.createElement('li')
        temp.textContent = `Actual: ${Math.round(data.main.temp)}° F`
        todaysWeather.append(temp)
        // Feels like Temp
        let feelsLike = document.createElement('li')
        feelsLike.textContent = `Feels Like: ${Math.round(data.main.feels_like)}° F`
        todaysWeather.append(feelsLike)
        // Humidity
        let humidity = document.createElement('li')
        humidity.textContent = `Humidity: ${data.main.humidity} %`
        todaysWeather.append(humidity)
        // Weather Description
        let description = document.createElement('li')
        description.textContent = `${data.weather[0].main}, ${data.weather[0].description}`
        todaysWeather.append(description)
    })

    const URL = `https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=${cityMatch.latititude}&lon=${cityMatch.longitude}&appid=${apiKey}`

    // day 1 = index 5 day 2 = index 13  day 3 = index 21 day 4 = index 29 day 5 = index 37

    fetch(URL)
    .then(response => response.json())
    .then(data => {
        let day1 = data.list[5]
        let day2 = data.list[13]
        let day3 = data.list[21]
        let day4 = data.list[29]
        let day5 = data.list[37]

        let fiveDay = [day1, day2, day3, day4, day5];

        console.log('days', day1, day2, day3, day4, day5)
    })
}