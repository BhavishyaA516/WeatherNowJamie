import { fetchData } from './src/fetchData'
import './style.css';

const searchBox = document.getElementById('search-box');
const submitButton = document.getElementById('submit-button');
const contentArea = document.querySelector('.content');

// This is our list of cities with their secret codes (coordinates)
const cityCoordinates = {
    'new york': { latitude: 40.7128, longitude: -74.0060 },
    'london': { latitude: 51.5074, longitude: -0.1278 },
    'tokyo': { latitude: 35.6895, longitude: 139.6917 },
    'sydney': { latitude: -33.8688, longitude: 151.2093 },
    'paris': { latitude: 48.8566, longitude: 2.3522 },
};

async function handleSearch() {
  const city = searchBox.value.trim().toLowerCase();
  
  if (!city) {
    alert('Please enter a city name!');
    return;
  }

  const coords = cityCoordinates[city];

  if (!coords) {
    contentArea.innerHTML = `<p>Sorry, I don't know the weather for "${city}". Try "London" or "Tokyo".</p>`;
    contentArea.style.display = 'block';
    return;
  }

  const { latitude, longitude } = coords;
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Weather data not found.');
    }
    const data = await response.json();
    displayWeather(data, city);
  } catch (error) {
    contentArea.innerHTML = `<p>Something went wrong. Please try again.</p>`;
    contentArea.style.display = 'block';
    console.error('Error fetching weather:', error);
  }
}

function displayWeather(data, city) {
  const temperature = data.current.temperature_2m;
  const windSpeed = data.current.wind_speed_10m;
  const weatherCode = data.current.weather_code;
  
  // A simple way to get a weather description from the code
  const weatherDescription = getWeatherDescription(weatherCode);

  contentArea.innerHTML = `
    <div class="location">${city.toUpperCase()}</div>
    <div class="temp-pic">
      <div class="temp">${temperature}°F</div>
      <img src="${getWeatherIcon(weatherCode)}" alt="Weather Icon" class="weather-icon">
    </div>
    <p>Conditions: ${weatherDescription}</p>
    <p>Wind Speed: ${windSpeed} mph</p>
  `;
  contentArea.style.display = 'block';
}

function getWeatherDescription(code) {
  const descriptions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    51: 'Drizzle',
    61: 'Rain',
    71: 'Snow fall',
    95: 'Thunderstorm',
    // You can add more codes from the API documentation
  };
  return descriptions[code] || 'Unknown';
}

function getWeatherIcon(code) {
  // Use your own icons or an icon library
  if (code === 0 || code === 1) return 'https://cdn-icons-png.flaticon.com/512/3222/3222806.png'; // Example sunny icon
  if (code === 2 || code === 3) return 'https://cdn-icons-png.flaticon.com/512/3222/3222802.png'; // Example cloudy icon
  if (code >= 51 && code <= 65) return 'https://cdn-icons-png.flaticon.com/512/3222/3222818.png'; // Example rainy icon
  // Add more logic for other weather codes
  return 'https://cdn-icons-png.flaticon.com/512/3222/3222808.png'; // Default icon
}

// Attach the function to the button click and key press
submitButton.addEventListener('click', handleSearch);
searchBox.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleSearch();
  }
});
fetchData()
