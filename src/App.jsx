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
import places from "./data/place";
import Input from "./input";

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
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          justifyContent: "space-around",
          width: "100vw",
          padding: 20,
        }}
      >
        <Input text={"Chọn điểm đi"} places={places} />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 25,
          }}
        >
          ➜
        </div>
        <Input text={"Chọn điểm đến"} places={places} />
      </div>
      <MapContainer
        center={position}
        zoom={16}
        scrollWheelZoom={true}
        style={{ flexGrow: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline pathOptions={redOptions} positions={border} />
        {places.map((point, i) => {
          const displayPoint = [point[1], point[2]];
          return (
            <Marker key={i} position={displayPoint}>
              <Popup>{point[0]}</Popup>
            </Marker>
          );
        })}
        <MapEvents />
      </MapContainer>
    </div>
  );
};

export default App;
