import React, {useState} from 'react'
import axios from 'axios'
import { CiSun } from "react-icons/ci";
import { WiDayCloudy } from "react-icons/wi";
import { IoRainyOutline } from "react-icons/io5";

function App() {

  const [data, setData] = useState({})
  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [location, setLocation] = useState('')
  const [error, setError] = useState('')
  const [date, setDate] = useState('')
  const [dateWeek, setDateWeek] = useState('')

  const weekday = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday", "Sunday"];
  const today = new Date();

  const url2 = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid={api_key}`


  const searchLocation = async (event) => {
    if(event.key === 'Enter') {
        try {
            const locationResponse = await axios.get(url2);

            if (locationResponse.data.length === 0){
              setError('Location not found :(');
              setData({});
              setName('');
              setCountry('');
            } else {
              setName(location)
              setCountry(locationResponse.data[0].country)
              const lat = locationResponse.data[0].lat.toString();
              const lon = locationResponse.data[0].lon.toString();
              //console.log(locationResponse.data[0]);

              const month = today.getMonth()+1;
              const year = today.getFullYear();
              const day = today.getDate(); 
              const currentDate = day + "." + month + "." + year;
              setDate(currentDate);
              setDateWeek(today.getDay());
              //setData(weatherResponse.data);
              //console.log(weatherResponse.data);

              const weather = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=7&units=metric&appid={api_key}`);
              setData(weather.data);
              setError('');
              console.log(weather.data)
            }

        } catch (error) {
            console.error("Error fetching the data:", error);
            setError('Data not found');
        }
    setLocation('') 
    }
};
 
 
  return (
    <div className="app">
      <div className = "search">
        <input
        aria-label={searchLocation}
        aria-required="true"
        value={location}
        onChange={event => setLocation(event.target.value)}
        placeholder='Enter location'
        onKeyPress={searchLocation}
        type = "text"></input>
      </div>
      <div className = "container">
        {error && <p className="error-msg">{error}</p>}
        <div className = "top">
        <div className = "left">
          <div className = "location">
            {country !== '' ? <h2>{name}, {country}</h2> : null}
            {country !== '' ? <h2 className = "date">{weekday[dateWeek - 1]}, {date}</h2> : null}
          </div>
          <div className = "temp">
            {data.list ? <h1>{data.list[0].main.temp.toFixed()}°C 
              {data.list[0].weather[0].main === "Clear" ? (
                  <CiSun className="icon-big" alt="sun"/>
                ) : data.list[0].weather[0].main === "Rain" ? (
                  <IoRainyOutline  className="icon-big" alt="rain" />
                ) : data.list[0].weather[0].main === "Clouds" ? (
                  <WiDayCloudy className="icon-big" alt="cloudy"/>
                ) : null}</h1> : null}
          </div>
          <div className = "description">
            {data.list ? <p>{data.list[0].weather[0].main}</p> : null}
          </div>
        </div>
      {data.list !== undefined &&
        <div className = "right">
          <div className = "feels">
            {data.list ? <p className="bold">Feels Like: {data.list[0].main.feels_like.toFixed()}°C</p> : null}
          </div>
          <div className = "humidity">
            {data.list ? <p className="bold">Humidity: {data.list[0].main.humidity}%</p> : null}
          </div>
          <div className = "wind">
            {data.list ? <p className="bold">Wind Speed: {data.list[0].wind.speed.toFixed()} MPH</p> : null}
          </div>
        </div>
        }
      </div>
      {data.list !== undefined && (
        <div className="bottom">
          <ul className="days">
            {data.list.slice(1, 7).map((item, index) => (
              <div className="day" key={index}>
                {date !== '' ? <h2 className = "date">{weekday[(dateWeek + index)%7]}</h2> : null}
                {item.weather[0].main === "Clear" ? (
                  <CiSun className="icon" alt="sun"/>
                ) : item.weather[0].main === "Rain" ? (
                  <IoRainyOutline  className="icon" alt="rain"/>
                ) : item.weather[0].main === "Clouds" ? (
                  <WiDayCloudy className="icon" alt="clouds"/>
                ) : null}
                <div className="temp">
                  <h3>{item.main.temp.toFixed()}°C</h3>
                </div>
                <div className="description">
                  <p className="desc">{item.weather[0].main}</p>
                </div>
                <div className="temps">
                  <p className="desc">
                    {item.main.temp_max.toFixed()}°C | {item.main.temp_min.toFixed()}°C
                  </p>
                </div>
              </div>
            ))}
          </ul>
        </div>
      )}

      </div>
    </div>
  );
}

export default App;
