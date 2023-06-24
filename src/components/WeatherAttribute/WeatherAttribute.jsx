const WeatherAttribute = ({ className = "", icon = "icon", attributeName = "attributeName", measurement = "measurement", unit = " unit" }) => {
  return (
    <div className={`weather-attribute ${className}`}>
      <div className="icon">{icon}</div>
      <p className="attribute-name">{attributeName}</p>
      <p className="measurement">{measurement}{unit}</p>
    </div>
  );
}

export default WeatherAttribute;