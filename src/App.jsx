import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import border from "./data/border";
import points from "./data/point";

// import { useState } from "react";

const App = () => {
  const position = [21.0394459, 105.8405899];
  const redOptions = { color: "red" };

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        console.log([e.latlng.lat, e.latlng.lng]);
      },
    });
    return false;
  };

  return (
    <MapContainer
      center={position}
      zoom={16}
      scrollWheelZoom={true}
      style={{ minHeight: "100vh", minWidth: "100vw" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline pathOptions={redOptions} positions={border} />
      {points.map((point) => {
        const displayPoint = [point[0], point[1]];
        return (
          <Marker key={point[2]} position={displayPoint}>
            <Popup>{point[2]}</Popup>
          </Marker>
        );
      })}
      <MapEvents />
    </MapContainer>
  );
};

export default App;
