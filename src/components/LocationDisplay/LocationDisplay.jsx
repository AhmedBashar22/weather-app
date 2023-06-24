const LocationDisplay = ({ className = "", long = 0, lat = 0, loc = "N/A", icon = "Icon" }) => {
  return (
    <div className={`location-display ${className}`}>
      <div className="icon">{icon}</div>
      <p className="location">Location: {loc}</p>
      <p className="coordinates">Lat: {lat}, Long: {long}</p>
    </div>
  );
}

export default LocationDisplay;