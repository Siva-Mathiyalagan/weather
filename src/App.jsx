import { useEffect, useState } from 'react';

import './App.css';
import searchIcon from './assets/search.png';
import clearIcon from './assets/sun.png';
import fewCloudsIcon from './assets/cloud.png';
import overcastIcon from './assets/cloudy.png';
import rainIcon from './assets/rain.png';
import thunderIcon from './assets/thunder.png';
import snowIcon from './assets/snow.png';
import humidIcon from './assets/icons8-hygrometer-40.png';
import windIcon from './assets/icons8-wind-40.png';

const WeatherDetails = ({ icon, temp, city, country, lat, long, humidity, windSpeed }) => {
  return (
    <>
      <div className='images'>
        <img src={icon} alt="Weather" />
      </div>
      <div className='temp'>{temp}°C</div>
      <div className='location'>{city}</div>
      <div className='country'>{country}</div>
      <div className='cord'>
        <div>
          <span className='lat'>Latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className='long'>Longitude</span>
          <span>{long}</span>
        </div>
      </div>
      <div className='data-container'>
        <div className='element'>
          <img src={humidIcon} alt="Humidity" className='icon' />
          <div className='data'>
            <div className='hum-per'>{humidity}%</div>
            <div className='text'>Humidity</div>
          </div>
        </div>
        <div className='element'>
          <img src={windIcon} alt="Wind" className='icon' />
          <div className='data'>
            <div className='win-per'>{windSpeed} km/h</div>
            <div className='text'>Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

function App() {
  const api_key = "0c2f35b67b8b1b706e34ba45f49b8ad5";
  const [text, setText] = useState('Mannargudi');
  const [icon, setIcon] = useState(snowIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [windSpeed, setWindSpeed] = useState(0);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconsMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": fewCloudsIcon,
    "02n": fewCloudsIcon,
    "03d": fewCloudsIcon,
    "03n": fewCloudsIcon,
    "04d": overcastIcon,
    "04n": overcastIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "11d": thunderIcon,
    "11n": thunderIcon,
    "13d": snowIcon,
    "13n": snowIcon,
    "50d": snowIcon,
    "50n": snowIcon
  };

  const search = async () => {
    if (!text.trim()) {
      setError("Please enter a city name.");
      setCityNotFound(false);
      return;
    }

    setLoading(true);
    setError(null);

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=metric`;

    try {
      let response = await fetch(url);
      let data = await response.json();

      if (data.cod === "404") {
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      setHumidity(data.main.humidity);
      setWindSpeed(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLong(data.coord.lon);

      const weatherIcon = data.weather[0].icon;
      setIcon(weatherIconsMap[weatherIcon] || clearIcon);
      setCityNotFound(false);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("An unexpected error occurred.");
      setCityNotFound(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeydown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <div className='container'>
      <div className='input-container'>
        <input
          type="text"
          className='cityInput'
          onChange={handleCity}
          value={text}
          onKeyDown={handleKeydown}
          placeholder='Search for a city'
        />
        <div className='search-icon' onClick={search}>
          <img src={searchIcon} alt="Search" />
        </div>
      </div>

      {loading && <div className='loading-message'>Loading...</div>}
      {error && <div className='error-message'>{error}</div>}
      {cityNotFound && <div className='city-not-found'>City not found</div>}
      {!loading && !cityNotFound && !error && (
        <WeatherDetails
          icon={icon}
          temp={temp}
          city={city}
          country={country}
          lat={lat}
          long={long}
          humidity={humidity}
          windSpeed={windSpeed}
        />
      )}

      <p className='copy'>Designed by <a href="https://www.linkedin.com/in/sivaranjan-mathiyalagan/">Siva</a></p>
    </div>
  );
}

export default App;
