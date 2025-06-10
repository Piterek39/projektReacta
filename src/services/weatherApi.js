const API_KEY = '4c9cb9fce1eebe238d3c49fc82335c4e';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeatherData = async (lat, lon) => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pl`
    );
    
    if (!response.ok) {
      throw new Error('Weather API request failed');
    }
    
    const data = await response.json();
    
    return {
      id: data.id,
      name: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      coords: { lat, lon },
    };
  } catch (error) {
    console.error('Weather API Error:', error);
    throw error;
  }
};

export const searchLocation = async (query) => {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding API request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Geocoding API Error:', error);
    throw error;
  }
};