import Home from "./components/Home/Home"

function App() {
  return (
    <div className="app">
      <Home secrets={{
        weather: import.meta.env.VITE_WEATHER_API,
      }} />
    </div>
  )
}

export default App
