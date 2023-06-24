# Weather App

This is a simple weather app built using React (+ Vite) and Tailwind CSS, and fetches data using OpenWeatherMap API. It allows users to search for the weather information of any location in the world.

## Installation

To install and run the app locally, follow these steps:

  1. Clone this repository.
  2. In the project directory, run npm install to install the required dependencies.
  3. Run npm run dev to start the development server.
  4. Open http://localhost:5173 to view the app in the browser.

## Usage

To use the app, enter the name of a city in the search bar and press the "Search" button or hit enter. The app will display the current weather information for the location, including the temperature, humidity, wind speed, and a brief description of the weather conditions.

## API Key

This app uses the OpenWeatherMap API to retrieve weather information. To use the app, you will need to obtain an API key from the OpenWeatherMap website and add it to a `.env` file in the root directory of the project. The `.env` file should contain the following line:

```VITE_WEATHER_API=your_api_key_here```

## Contributing

If you would like to contribute to this project, feel free to submit a pull request. Please make sure to follow the existing code style and include a detailed description of your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.