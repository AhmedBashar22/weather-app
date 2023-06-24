import { useMemo } from 'react';
import WeatherAttribute from '../WeatherAttribute/WeatherAttribute'

const WeatherDetails = ({ className, weatherData, isImperial = false }) => {

  const attributes = useMemo(() => [
    {
      name: "humidity",
      title: "Humidity" ,
      value: weatherData?.main?.humidity,
      unit: "%",
      icon: <div className='drop-icon'></div>,
    },
    {
      name: "feels_like",
      title: "Feels like",
      value: weatherData?.main ? Math.round(weatherData.main.feels_like) : undefined,
      unit: isImperial ? "°F" : "°C",
      icon: <div className='temperature-icon'></div>,
    },
    {
      name: "wind_speed",
      title: "Wind speed",
      value: weatherData?.wind?.speed,
      unit: isImperial ? " mi/hr" : " m/sec",
      icon: <div className='wind-icon'></div>,
    },
    {
      name: "wind_direction",
      title: "Wind direction",
      value: weatherData?.wind?.deg,
      unit: "°",
      icon: <div className='flag-icon'></div>,
    },
    {
      name: "clouds",
      title: "Clouds",
      value: weatherData?.clouds?.all,
      unit: "%",
      icon: <div className='cloud-icon'></div>,
    },
  ], [weatherData])

  return (
    <div className={`weather-details ${className}`}>
      {weatherData && (parseInt(weatherData.cod) === 200) &&
        attributes.map((item, n) => {
          return item.value ? <WeatherAttribute
            attributeName={item.title}
            icon={item.icon ? item.icon : item.name}
            key={n}
            measurement={item.value}
            unit={item.unit}
          /> : <></>
        })
      }
      {weatherData && (parseInt(weatherData.cod) !== 200) && <p className="error-text"><strong>An error occured: </strong>{weatherData.message}</p>}
    </div>
  );
}
 
export default WeatherDetails;