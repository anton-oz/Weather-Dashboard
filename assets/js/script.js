const formSubmit = document.getElementById('submit');
const citySearch = document.getElementById('search');
const cityName = document.getElementById('cityName');

const todaysWeather = document.getElementById('todayWeather');

const mainContainerEl = document.getElementById('mainContainer');

const aside = document.getElementById('searchDiv')

const mainEl = document.getElementById('main');

const divRowEl = document.getElementById('cardRow');

mainContainerEl.style.justifyContent = 'center'


mainEl.style.display = 'none'

const searchHistoryEl = document.getElementById('searchHistory');

const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];




formSubmit.addEventListener('submit', e => {
    e.preventDefault()
    searchHistoryEl.textContent = ''
    let searchQuery = citySearch.value
    getCityCoordinates(searchQuery)
    citySearch.value = '';
});


// Things to add

// Local storage history with clickable items

// background image of website changes based on current weather, create an object with its keys such as rain, sunny, cloudy pointing to img urls of same weather




const apiKey = 'baee951685e061a0382c14d1c8f142d7';

if (searchHistory.length > 0) {
    getCityCoordinates(searchHistory[0])
};

function getCityCoordinates(city) {


   

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

            if (name !== searchHistory[0]) {
                searchHistory.unshift(name)
            } 
            
            for (search in searchHistory) {
                let linkWrap = document.createElement('a')
                linkWrap.setAttribute('href', '#')
                let searchItem = document.createElement('li')
                searchItem.textContent = `${searchHistory[search]}`
                linkWrap.append(searchItem)
                searchHistoryEl.append(linkWrap)
            }
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory))

            cityName.textContent = `${name}`
            getWeather(cityMatch)
            mainContainerEl.style.justifyContent = 'start'
            aside.style.fontSize = '1em'
            mainEl.style.display = 'flex'
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

        divRowEl.innerHTML = '';

        for (let day in fiveDay) {
            forecastCardBuilder(fiveDay[day], day)
        }

    })
}

function forecastCardBuilder(dayObj, i) {

    let card = document.createElement('div');
    i++;
    card.setAttribute('id', `id-${i}`);
    card.setAttribute('class', 'card');

    let weatherDate = document.createElement('h4');
    weatherDate.textContent = `${dayjs(dayObj.dt_txt).format('dddd, MMM D')}`;
    card.append(weatherDate);

    let weatherList = document.createElement('ul');

    let tempCur = document.createElement('li');
    tempCur.textContent = `Temp: ${Math.round(dayObj.main.temp)}° F`
    weatherList.append(tempCur)

    let feelsLikeTemp = document.createElement('li');
    feelsLikeTemp.textContent = `Will Feel Like: ${Math.round(dayObj.main.feels_like)}° F`
    weatherList.append(feelsLikeTemp)

    let humidity1 = document.createElement('li');
    humidity1.textContent = `Humidity: ${dayObj.main.humidity} %`;
    weatherList.append(humidity1);

    let weatherDesc = document.createElement('li');
    weatherDesc.textContent = `${dayObj.weather[0].main}, ${dayObj.weather[0].description}`;
    weatherList.append(weatherDesc);

    card.append(weatherList)

    divRowEl.append(card)
};