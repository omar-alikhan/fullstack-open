import axios from "axios";
const weather_api_key = import.meta.env.VITE_WEATHER_API_KEY;
const baseUrl = "https://api.openweathermap.org/data/2.5";
const options = `&appid=${weather_api_key}&units=metric`;

const getByCity = city => {
  const req = axios.get(`${baseUrl}/weather?q=${city}${options}`);
  return req.then(res => res.data);
};

export default { getByCity, getIconByWeatherCode };
