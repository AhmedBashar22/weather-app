import { useMemo } from "react"
import WeatherDisplay from "../WeatherDisplay/WeatherDisplay"
import {days} from "../WeatherDisplay/WeatherDisplay"

const forecastDataReducer = (prev, curr) => {
  const dateObject = new Date(curr.dt * 1000)
  const day = days[dateObject.getDay()]

  if (prev[day] === undefined) {
    prev[day] = {
      min: curr.main.temp_min,
      max: curr.main.temp_max,
      time: dateObject,
      icon: curr.weather[0].icon
    }
  } else {
    if (prev[day].min > curr.main.temp_min) {
      prev[day].min = curr.main.temp_min
    }
    if (prev[day].max < curr.main.temp_max) {
      prev[day].max = curr.main.temp_max
    }
  }

  return prev
}

const WeeklyForecast = ({ className, weatherData, isFahrenheit = false }) => {
  const data = useMemo(() => weatherData?.list?.reduce(forecastDataReducer, {}), [weatherData])

  return (
    <div className={`weekly-forecast ${className}`}>
      {weatherData && (parseInt(weatherData.cod) === 200) && data && Object.keys(data).map((item, n) => {
        return <WeatherDisplay
          className="weekly-forecast-instance"
          key={n}
          min={data[item].min}
          max={data[item].max}
          time={data[item].time}
          icon={<img src={`https://openweathermap.org/img/wn/${data[item].icon.replace('n', 'd')}@2x.png`}/>}
          isFahrenheit = {isFahrenheit}
          displayDate
          seperateMinMax
        />
      })}
      {weatherData && (parseInt(weatherData.cod) !== 200) && <p className="error-text"><strong>An error occured: </strong>{weatherData.message}</p>}
    </div>
  );
}
 
export default WeeklyForecast;