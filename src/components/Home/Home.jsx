import SearchBar from "../Searchbar/Searchbar"
import WeatherDisplay from "../WeatherDisplay/WeatherDisplay"
import DailyForecast from "../DailyForecast/DailyForecast"
import WeeklyForecast from "../WeeklyForecast/WeeklyForecast"
import WeatherDetails from "../WeatherDetails/WeatherDetails"
import LocationDisplay from "../LocationDisplay/LocationDisplay"
import ToggleButton from "../ToggleButton/ToggleButton"
import SearchResults from "../SearchResults/SearchResults"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

const CITY_API_URL = "https://nominatim.openstreetmap.org/"
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/"

const autocompleteFunction = async (searchValue, abortSignal) => {
  if (searchValue === "") return []
  let cities = []
  if (!abortSignal.aborted) {
    cities = await fetch(
      CITY_API_URL + `search?q=${searchValue}&format=json&polygon_geojson=1&featuretype=city&limit=50`,
      {signal: abortSignal}
    )
    .then(async response => {
      const json = await response.json()
      return json.map(item => item.display_name)
    })
    .catch(error => [])
  }
  return cities
}

const Home = ({ className = "", secrets }) => {

  const [currentWeatherData, setCurrentWeatherData] = useState(null)
  const [forecastWeatherData, setForecastWeatherData] = useState(null)
  const [searchResults, setSearchResults] = useState(null)
  const [location, setLocation] = useState(null)
  const [isImperial, setImperial] = useState(false)
  const [isLocating, setLocating] = useState(false)
  const cache = useRef({})

  const minmax = useMemo(() => {
    return forecastWeatherData?.list.reduce((p, c) => {
      if (new Date(c.dt * 1000).getDate() !== new Date(Date.now()).getDate()) return p
      if (!p.min || !p.max) {
        p.min = c.main.temp_min
        p.max = c.main.temp_max
      } else {
        if (p.min > c.main.temp_min) p.min = c.main.temp_min
        if (p.max < c.main.temp_max) p.max = c.main.temp_max
      }

      return p
    }, {})
  }, [forecastWeatherData])

  const searchSubmitFunction = useCallback((searchValue) => {
    fetch(CITY_API_URL + `search?q=${searchValue}&format=json&polygon_geojson=1&featuretype=city&limit=50`)
    .then(async response => {
      const json = await response.json()
      setSearchResults(json.map(item => {
        return {
          name: item.display_name,
          long: parseFloat(item.lon),
          lat: parseFloat(item.lat)
        }
      }))
    })
  }, [])

  const getCity = useCallback(() => {
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      position => {
        fetch(CITY_API_URL + `reverse?lon=${position.coords.longitude}&lat=${position.coords.latitude}&limit=1&format=json&osm_type=R`)
        .then(async response => {
          const json = await response.json()
          setLocation({
            name: `${json.address.city}, ${json.address.country}`,
            long: parseFloat(json.lon),
            lat: parseFloat(json.lat)
          })
          setLocating(false)
        })
        .catch(error => console.log(error))
      },
      error => {
        setLocation({
          name: "Egypt, Cairo",
          long: 31.24967,
          lat: 30.06263
        })
        setLocating(false)
      }
    )
  }, [])

  useEffect(() => {
    getCity()
  }, [])

  useEffect(() => {
    if (location) {
      if (cache.current[location.name] && cache.current[location.name][isImperial ? "imperial" : "metric"]) {
        const weatherObject = cache.current[location.name][isImperial ? "imperial" : "metric"]
        setCurrentWeatherData(weatherObject.current)
        setForecastWeatherData(weatherObject.forecast)
      } else {
        fetch(WEATHER_API_URL + `weather?lat=${location.lat}&lon=${location.long}&appid=${secrets.weather}&units=${isImperial ? "imperial" : "metric"}`)
        .then(response => {
          response.json().then(json => {
            setCurrentWeatherData(json)
            let newCache = {...cache.current}
            if (!newCache[location.name]) newCache[location.name] = {}
            if (!newCache[location.name][isImperial ? "imperial" : "metric"]) newCache[location.name][isImperial ? "imperial" : "metric"] = {}
            newCache[location.name][isImperial ? "imperial" : "metric"].current = json
            cache.current = newCache
          })
        })
        fetch(WEATHER_API_URL + `forecast?lat=${location.lat}&lon=${location.long}&appid=${secrets.weather}&units=${isImperial ? "imperial" : "metric"}`)
        .then(response => {
          response.json().then(json => {
            setForecastWeatherData(json)
            let newCache = {...cache.current}
            if (!newCache[location.name]) newCache[location.name] = {}
            if (!newCache[location.name][isImperial ? "imperial" : "metric"]) newCache[location.name][isImperial ? "imperial" : "metric"] = {}
            newCache[location.name][isImperial ? "imperial" : "metric"].forecast = json
            cache.current = newCache
          })
        })
      }
    }
  }, [location, isImperial])

  return (
    <div className={`home ${className}`}>

      {/* Header */}
      <header className="home-header">
        <SearchBar
          debounceTime={1000}
          placeholder="Search for a city"
          autocompleteFunction={autocompleteFunction}
          submitFunction={searchSubmitFunction}
        />
        <ToggleButton
          className="unit-toggle-button"
          state={[isImperial, setImperial]}
          offJSX={
            <>
            <div className="red-dot"></div>
            <p>Metric</p>
            </>
          }
          onJSX={
            <>
            <div className="green-dot"></div>
            <p>Imperial</p>
            </>
          }
        />
      </header>

      {/* Body */}
      <main className="home-body">
        <WeatherDisplay
          className="main-weather-display"
          desc={currentWeatherData?.weather[0].description.toUpperCase()}
          max={minmax?.max}
          min={minmax?.min}
          temp={currentWeatherData?.main.temp}
          icon={currentWeatherData ? <img src={`https://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}@4x.png`}/> : ""}
          isFahrenheit={isImperial}
        />
        <DailyForecast
          weatherData={forecastWeatherData}
          isFahrenheit={isImperial}
        />
        <WeatherDetails
          weatherData={currentWeatherData}
          isImperial={isImperial}
        />
        <WeeklyForecast
          weatherData={forecastWeatherData}
          isFahrenheit={isImperial}
        />
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <button onClick={getCity} disabled={isLocating}>
          <div className="locate-me-icon"></div>
          <p className="locate-me-label">Locate me</p>
        </button>
        <LocationDisplay
          icon={<div className="location-display-icon"></div>}
          long={Math.trunc(location?.long)}
          lat={Math.trunc(location?.lat)}
          loc={location?.name}
        />
      </footer>

      {
        searchResults &&
        <>
        <div className="search-results-bg"></div>
        <SearchResults
          exitButton={<div className="exit-button-wrapper"><p>Search Results</p><button className="exit-button" onClick={() => {setSearchResults(null)}}></button></div>}
          displayFunction={(item) => {
            return item.name
          }}
          searchResults={searchResults}
          selectionFunction={(item) => {
            setLocation(item)
            setSearchResults(null)
          }}
        />
        </>
      }

    </div>
  );
}
 
export default Home;