import { OlaMaps } from '../OlaMapsWebSDK/';
import './App.css';
import { useEffect, useState, useRef } from 'react';
import extractPath from './extractPaths';

import axios from 'axios';

function App() {

  const key = import.meta.env.VITE_OLA_MAPS_API_KEY;
  const [srcResults, setSrcResults] = useState([]);
  const [destResults, setDestResults] = useState([]);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedSource, setSelectedSource] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState([]);
  const [debouncedSource, setDebouncedSource] = useState('');
  const [debouncedDestination, setDebouncedDestination] = useState('');

  const olaMapRef = useRef(null); // Ref to store map object

  const fetchAutocomplete = async (input, type) => {
    try {
      const response = await axios.get(
        `https://api.olamaps.io/places/v1/autocomplete?input=${input}&api_key=${key}`
      );

      if (type === 'source') {
        setSrcResults(response.data.predictions || []);
      } else {
        setDestResults(response.data.predictions || []);
      }
    } catch (error) {
      console.error('Error fetching autocomplete results:', error);
    }
  };

  useEffect(() => {
    if (debouncedSource) {
      fetchAutocomplete(debouncedSource, 'source');
    } else {
      setSrcResults([]);
    }
  }, [debouncedSource]);

  useEffect(() => {
    if (debouncedDestination) {
      fetchAutocomplete(debouncedDestination, 'destination');
    } else {
      setDestResults([]);
    }
  }, [debouncedDestination]);

  const handleInputChange = (e, type) => {
    const value = e.target.value;
    if (type === 'source') {
      setSource(value);
      debounce(value, setDebouncedSource);
    } else {
      setDestination(value);
      debounce(value, setDebouncedDestination);
    }
  };

  let debounceTimeout;
  const debounce = (value, setDebouncedValue) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      setDebouncedValue(value);
    }, 1000); // Adjust the debounce delay as needed (300ms is standard).
  };

  const handleSelect = (item, type) => {
    if (type === 'source') {
      setSelectedSource([item.geometry.location.lng, item.geometry.location.lat]);
      setSource(item.terms[0].value);
      setSrcResults([]);
    } else {
      setSelectedDestination([item.geometry.location.lng, item.geometry.location.lat]);
      setDestination(item.terms[0].value);
      setDestResults([]);
    }
  };

  // Initialize the map and store it in a ref
  useEffect(() => {
    const olaMaps = new OlaMaps({
      apiKey: key,
    });

    olaMapRef.current = olaMaps.init({
      style: 'https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard-mr/style.json',
      container: 'map',
      center: [72.571342, 23.022604],
      zoom: 15,
    });

  }, []);

  useEffect(() => {
    const fetchRouteData = async () => {
      if (selectedSource.length > 0 && selectedDestination.length > 0) {
        try {
          const routeData = await axios.post(
            `https://api.olamaps.io/routing/v1/directions/basic?origin=${selectedSource[1]},${selectedSource[0]}&destination=${selectedDestination[1]},${selectedDestination[0]}&api_key=${key}`
          );

          console.log(routeData);
          const paths = await extractPath(routeData.data);
          console.log(paths);

          if (olaMapRef.current) {

            if (olaMapRef.current.getLayer('route')) {
                olaMapRef.current.removeLayer('route');
            }

            if (olaMapRef.current.getSource('route')) {
                olaMapRef.current.removeSource('route');
            }

            olaMapRef.current.setCenter(paths[0]);
            olaMapRef.current.setZoom(12);

            olaMapRef.current.addSource('route', {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: paths,
                },
              },
            });

            olaMapRef.current.addLayer({
              id: 'route',
              type: 'line',
              source: 'route',
              layout: {'line-cap': 'round'},
              paint: {
                'line-color': '#2653ff',
                'line-width': 3,
              },
            });
          }
        } catch (error) {
          console.error('Error fetching route data:', error);
        }
      }
    };

    fetchRouteData();
  }, [selectedSource, selectedDestination]);

  const [features, setFeatures] = useState([14, 2, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
  const [prediction, setPrediction] = useState(null);


  useEffect(() => {
    const fetchProbablity = async () => {

        const weather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${selectedDestination[1]}&lon=${selectedDestination[0]}&appid=${import.meta.env.VITE_WEATHER_KEY}`)

        const temp = weather.data.main.temp
        const visibility = weather.data.visibility
        const rain = weather.data.weather.main==="Rain"

        var weatherdt = 7
        if (weather.data.weather.main=='Cloudy') weatherdt = 0
        else if (weather.data.weather.main=='Fog') weatherdt = 1
        else if (weather.data.weather.main=='Rain') weatherdt = 4
        else if (weather.data.weather.main=='Snow') weatherdt = 6
        else if (weather.data.weather.main=='Winds') weatherdt = 8
        
        const time = new Date()

        const age_band_driver =  0 //from signup
        const gender = 1//0 for male, 1 for female ( from signup )
        const driving_exp = 0 //in years (from signup)
        const type_of_vehicle=0 //from signup
        const area = Math.random()*13
        const lanes = 2
        const junction = Math.random()*7
        const road_surface= Math.random()*4
        const road_conditions = rain ? 3 : 0;
        const light_conditions= time.getHours()<17 ? 3 : time.getHours()>=17 && time.getHours()<19 ? 1 : 0;
        const vehicle_mov= Math.random()*2;

        setFeatures([time.getHours(),time.getDay(),age_band_driver,gender,driving_exp,type_of_vehicle,area,lanes,junction,road_surface,road_conditions,light_conditions,vehicle_mov])

        const probablity = await axios.post('http://127.0.0.1:5000/predict',{
            features : features
        });

        setPrediction(probablity.data.prediction);


        /*

        olaMapRef.current.addSource('probablity', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                //add prediction output here in the below given format
                /*
             {
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [77.5946, 12.9716] },
                properties: { intensity: 8 },
              },
              {
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [77.6012, 12.9243] },
                properties: { intensity: 6 },
              },]
            }
          })
        
          // Add the heatmap layer
          olaMapRef.current.addLayer({
            id: 'prob-layer',
            type: 'heatmap',
            source: 'probablity',
            paint: {
              // Increase the heatmap weight based on the magnitude property
              'heatmap-weight': [
                'interpolate',
                ['linear'],
                ['get', 'intensity'], // Assuming 'intensity' is the property for intensity
                0,
                0,
                6,
                1,
              ],
              // Increase the heatmap intensity based on zoom level
              'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
              // Color ramp for heatmap. Domain is 0 (low) to 1 (high).
              'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0,
                'rgba(33,102,172,0)',
                0.2,
                'rgb(103,169,207)',
                0.4,
                'rgb(209,229,240)',
                0.6,
                'rgb(253,219,199)',
                0.8,
                'rgb(178,24,43)',
                1,
                'rgb(178,24,43)',
              ],
              // Adjust the heatmap radius by zoom level
              'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
              // Decrease the opacity of the heatmap layer by zoom level
              'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0],
            },
          })
      */
    }

    

    fetchProbablity()
  },[selectedSource,selectedDestination])

  return (
    <>
      <form>
        <div>
          <input
            type="search"
            name="source"
            placeholder="Enter source"
            value={source}
            onChange={(e) => handleInputChange(e, 'source')}
          />
          {srcResults.length > 0 && (
            <div className="flex justify-center content-center w-full">
              <ul>
                {srcResults.map((item) => (
                  <li
                    key={item.id}
                    className="autocomplete-dropdown-item"
                    onClick={() => handleSelect(item, 'source')}
                  >
                    {item.terms[0].value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div>
          <input
            type="search"
            name="destination"
            placeholder="Enter destination"
            value={destination}
            onChange={(e) => handleInputChange(e, 'destination')}
          />
          {destResults.length > 0 && (
            <div className="flex justify-center content-center w-full">
              <ul>
                {destResults.map((item) => (
                  <li
                    key={item.id}
                    className="autocomplete-dropdown-item"
                    onClick={() => handleSelect(item, 'destination')}
                  >
                    {item.terms[0].value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </form>

      <div className="flex justify-center content-center">
        <h3 className="mr-2">
          Selected Source: {selectedSource[0]} , {selectedSource[1]}
        </h3>
        <h3>
          Selected Destination: {selectedDestination[0]} , {selectedDestination[1]}
        </h3>
      </div>

      {
          prediction !== null ?
        (<h3>
          Accident is {prediction==1 ? "Possible" : "Not Possible" }
        </h3>) : null

        }

      <div id="map" className="h-[75vh] w-[80vw]"></div>
    </>
  );
}

export default App;