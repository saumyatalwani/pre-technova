import { OlaMaps } from '../OlaMapsWebSDK/';
import './App.css';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const key = import.meta.env.VITE_OLA_MAPS_API_KEY
    const olaMaps = new OlaMaps({
      apiKey: key,
    });

    const myMap = olaMaps.init({
      style: 'https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard-mr/style.json',
      container: 'map',
      center: [72.585022,23.033863],
      zoom: 13,
    });

  }, []);

  return (
    <>
      <div id="map" className='h-[80vh] w-[80vw]'>
      </div>
    </>
  );
}

export default App;
