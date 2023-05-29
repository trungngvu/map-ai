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
import roads from "./data/road.json";
import Input from "./input";

import { useState } from "react";

const App = () => {
  const [isMarker, setIsMarker] = useState(true);
  const [isRoad, setIsRoad] = useState(true);
  const [isOneWayRoad, setIsOneWayRoad] = useState(true);

  const [coordinate, setCoordinate] = useState("");

  const position = [21.0394459, 105.8405899];
  const redOptions = { color: "red" };
  const limeOptions = { color: "lime" };
  const blueOptions = { color: "blue" };

  const polyline = [];
  roads.map((line) => {
    const a = points.find((point) => point[2] === line[0]);
    const b = points.find((point) => point[2] === line[1]);
    polyline.push([a[0], a[1]]);
    polyline.push([b[0], b[1]]);
  });
  const pol = [];
  for (let i = 0; i < polyline.length; i = i + 2) {
    pol.push([polyline[i], polyline[i + 1]]);
  }

  const oneWay = roads.filter(
    (road, i) =>
      !roads.some((r, j) => r[0] === road[1] && r[1] === road[0] && i !== j)
  );
  const ow = [];

  oneWay.map((line) => {
    const a = points.find((point) => point[2] === line[0]);
    const b = points.find((point) => point[2] === line[1]);
    ow.push([a[0], a[1]]);
    ow.push([b[0], b[1]]);
  });
  const oneWayLine = [];
  for (let i = 0; i < ow.length; i = i + 2) {
    oneWayLine.push([ow[i], ow[i + 1]]);
  }

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        setCoordinate([e.latlng.lat, e.latlng.lng].toString());
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
        <div>
          <button onClick={() => setIsMarker((prev) => !prev)}>
            Toggle point
          </button>
          <button onClick={() => setIsRoad((prev) => !prev)}>
            Toggle road
          </button>
          <button onClick={() => setIsOneWayRoad((prev) => !prev)}>
            Toggle one-way road
          </button>
          <div>{`[${coordinate}]`}</div>
          <button
            onClick={() => navigator.clipboard.writeText(`[${coordinate}]`)}
          >
            Copy
          </button>
        </div>
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
        {isRoad &&
          pol.map((p, i) => (
            <Polyline pathOptions={limeOptions} positions={p} key={i} />
          ))}
        {isOneWayRoad &&
          oneWayLine.map((p, i) => (
            <Polyline pathOptions={blueOptions} positions={p} key={i} />
          ))}
        {isMarker &&
          points.map((point, i) => {
            const displayPoint = [point[0], point[1]];
            return (
              <Marker key={i} position={displayPoint}>
                <Popup>{point[2]}</Popup>
              </Marker>
            );
          })}
        <MapEvents />
      </MapContainer>
    </div>
  );
};

export default App;
