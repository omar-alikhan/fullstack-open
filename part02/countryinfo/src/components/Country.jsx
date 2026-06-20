import weatherService from "../services/weather";
import { useEffect, useState } from "react";

const Country = ({ country }) => {
  const [weather, setWeather] = useState("");
  const [wind, setWind] = useState("");
  const [weatherCode, setWeatherCode] = useState("");
  useEffect(() => {
    weatherService.getByCity(country.name.common).then(weather => {
      setWeather(weather.main.temp);
      setWind(weather.wind.speed);
      setWeatherCode(weather.weather[0].icon);
    });
  }, []);

  useEffect(() => {
    weatherService.getIconByWeatherCode("04n").then(icon => console.log(icon));
  }, []);

  return (
    <>
      <h1>{country.name.common}</h1>
      <div>Capital {country.capital}</div>
      <div>Area {country.area}</div>
      <h2>Languages</h2>
      <ul>
        {Object.entries(country.languages).map(([code, name]) => (
          <li key={code}>{name}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} />
      <h2>Weather in {country.name.common}</h2>
      <p>Temperature {weather} Celsius</p>
      <img src={`https://openweathermap.org/img/wn/${weatherCode}@2x.png`} />
      <p>Wind {wind} m/s</p>
    </>
  );
};

export default Country;
