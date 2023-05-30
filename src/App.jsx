import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from "react-leaflet";
import border from "./data/border";
import points from "./data/point";
import places from "./data/place";
import roads from "./data/road.json";
import Input from "./input";

import { useState, useRef, useMemo } from "react";

function DraggableMarker({ positionInput, PointCount, index, setRender, setPointConnection }) {
  // const [draggable, setDraggable] = useState(false);
  const [position, setPosition] = useState(positionInput);
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
          points[index] = [marker.getLatLng().lat, marker.getLatLng().lng, PointCount];
          setRender((prev) => !prev);
        }
      },
      dblclick() {
        setPointConnection((prev) => {
          if (prev.length === 0) {
            return [PointCount];
          } else if (prev.length === 1) {
            return [...prev, PointCount];
          }
        });
        // Handle double-click event here
      },
    }),
    []
  );

  const deleteMark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    points.splice(index, 1);
    // delete road
    const roadDelete = roads.filter((road) => road[0] !== PointCount && road[1] !== PointCount);
    roads.splice(0, roads.length);
    roads.push(...roadDelete);

    setRender((prev) => !prev);
  };

  return (
    <>
      <Marker position={position} ref={markerRef} draggable={true} eventHandlers={eventHandlers}>
        <Popup>
          {PointCount}
          <button onClick={(e) => deleteMark(e)}>-</button>
        </Popup>
      </Marker>
    </>
  );
}

const App = () => {
  const [isMarker, setIsMarker] = useState(true);
  const [isRoad, setIsRoad] = useState(true);
  const [isOneWayRoad, setIsOneWayRoad] = useState(true);
  const [render, setRender] = useState(false);
  const [pointConnection, setPointConnection] = useState([]);

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

  const oneWay = roads.filter((road, i) => !roads.some((r, j) => r[0] === road[1] && r[1] === road[0] && i !== j));
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

  // save data to file points.json
  const saveJSONToFile = (data, filename) => {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  };

  const downloadFileJson = () => {
    console.log(points);
    const data = JSON.stringify(points);
    const data1 = JSON.stringify(roads);
    saveJSONToFile(data, "point.json");
    saveJSONToFile(data1, "road.json");
  };

  const HandleClickConnect = (checkMode) => {
    console.log("roads: ", roads[roads.length - 1], roads[roads.length - 2]);
    if (!pointConnection || pointConnection.length !== 2) {
      alert("Chưa chọn đủ 2 điểm");
      return;
    }
    // check if point connection exist in roads return null
    if (
      roads.some(
        (road) =>
          (road[0] === pointConnection[0] && road[1] === pointConnection[1]) ||
          (road[0] === pointConnection[1] && road[1] === pointConnection[0])
      )
    ) {
      alert("Đường đã tồn tại");
    } else {
      const pointCN = [...pointConnection];
      roads.push(pointCN);
      const pointReverse = pointConnection.reverse();
      console.log("pointConnection: ", pointConnection);
      console.log("reverse 1: ", pointReverse);
      if (checkMode) roads.push(pointReverse);
      // toats
      console.log("roads: ", roads[roads.length - 1], roads[roads.length - 2]);
    }
    setPointConnection([]);
  };

  console.log("Re-render");

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        setCoordinate([e.latlng.lat, e.latlng.lng].toString());
        const pointLast = points[points.length - 1];
        const pointAdd = [e.latlng.lat, e.latlng.lng, pointLast[2] + 1];
        points.push(pointAdd);
        setRender((prev) => !prev);
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
          <button onClick={() => setIsMarker((prev) => !prev)}>Toggle point</button>
          <button onClick={() => setIsRoad((prev) => !prev)}>Toggle road</button>
          <button onClick={() => setIsOneWayRoad((prev) => !prev)}>Toggle one-way road</button>
          <div>{`[${coordinate}]`}</div>
          <button onClick={() => navigator.clipboard.writeText(`[${coordinate}]`)}>Copy</button>
          <button onClick={downloadFileJson}>Download</button>
          <div>Start: {`${pointConnection[0] || "Double click any marker"}`}</div>
          <div>End: {`${pointConnection[1] || "Double click any marker"}`}</div>
          <button onClick={() => HandleClickConnect(false)}>Connect Point (1 chieu))</button>
          <button onClick={() => HandleClickConnect(true)}>Connect Point (2 chieu))</button>
        </div>
      </div>
      <MapContainer center={position} zoom={16} scrollWheelZoom={true} style={{ flexGrow: 1 }}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline pathOptions={redOptions} positions={border} />
        {isRoad && pol.map((p, i) => <Polyline pathOptions={limeOptions} positions={p} key={i} />)}
        {isOneWayRoad && oneWayLine.map((p, i) => <Polyline pathOptions={blueOptions} positions={p} key={i} />)}
        {isMarker &&
          points.map((point, i) => {
            const displayPoint = [point[0], point[1]];
            return (
              <DraggableMarker
                key={i}
                positionInput={displayPoint}
                PointCount={point[2]}
                index={i}
                setRender={setRender}
                render={render}
                setPointConnection={setPointConnection}
              ></DraggableMarker>
            );
          })}
        <MapEvents />
      </MapContainer>
    </div>
  );
};

export default App;
