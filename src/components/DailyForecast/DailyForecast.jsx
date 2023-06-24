import WeatherDisplay from '../WeatherDisplay/WeatherDisplay';

const DailyForecast = ({ className = "", weatherData, isFahrenheit = false, hour12 = false }) => {
  return (
    <div className={`daily-forecast ${className}`}>
      {weatherData && (parseInt(weatherData.cod) === 200) && weatherData.list.filter(item => new Date(item.dt * 1000).getDate() === new Date(Date.now()).getDate()).map((data, index) => (
        <WeatherDisplay
          className='daily-forecast-instance'
          key={index}
          time={new Date(data.dt * 1000)}
          icon={<img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}/>}
          temp={data.main.temp}
          isFahrenheit={isFahrenheit}
          hour12 = {hour12}
          displayTime
        />
      ))}
      {weatherData && (parseInt(weatherData.cod) !== 200) && <p className="error-text"><strong>An error occured: </strong>{weatherData.message}</p>}
    </div>
  );
}

export default DailyForecast;