// React component that displays weather information.
//
// Usage:
// Import the component:
// import WeatherDisplay from './WeatherDisplay';
//
// In your React component, use the WeatherDisplay component with props:
// <WeatherDisplay time={new Date()} icon={iconElement} temp={23} desc="Sunny" />
//
// Props:
// - time: Date object representing the time for the weather information (required)
// - icon: React element or string representing the weather icon
// - temp: Number representing temperature
// - desc: String describing the weather condition

export const days = [
  "Sun",
  "Mon",
  "Tues",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
]

const WeatherDisplay = ({ className = "", time, icon, temp, desc, min, max, hour12 = false, seperateMinMax = false, isFahrenheit = false, displayDate = false, displayTime = false }) => {
  return (
    <div className={`weather-display ${className}`}>
      {displayDate && time && <p className="date">{days[time.getDay()]}</p>}
      {
        (displayDate || displayTime) && time && <p className="time">{new Intl.DateTimeFormat(undefined, {
          hour: displayTime ? "2-digit" : undefined,
          minute: displayTime ? "2-digit" : undefined,
          hour12: hour12,
          day: displayDate ? "2-digit" : undefined,
          month: displayDate ? "2-digit" : undefined,
        }).format(time)}</p>
      }
      { icon && <div className="icon">{icon}</div> }
      { temp && <p className="temp">{Math.round(temp)}{!isFahrenheit ? "°C" : "°F"}</p> }
      { desc && <p className="desc">{desc}</p> }
      { !(seperateMinMax) && min && max && <p className="min-max"><strong>{Math.round(max)}</strong> / {Math.round(min)}{!isFahrenheit ? "°C" : "°F"}</p> }
      {
        seperateMinMax && min && max &&
        <>
        <p className="max">{Math.round(max)}{!isFahrenheit ? "°C" : "°F"}</p>
        <p className="min">{Math.round(min)}{!isFahrenheit ? "°C" : "°F"}</p>
        </>
      }
    </div>
  );
}
 
export default WeatherDisplay;