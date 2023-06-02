import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import border from "./data/border";
import points from "./data/point";
import places from "./data/place";
import Input from "./input";
import Button from "@mui/material/Button";

import startIcon from "./assets/start.svg";
import endIcon from "./assets/end.svg";

import { useState, useMemo, useRef, useEffect } from "react";

const App = () => {
  const [isFinding, setIsFinding] = useState(0);
  const [path, setPath] = useState(null);
  const [isChoosingStart, setIsChoosingStart] = useState(false);
  const [isChoosingEnd, setIsChoosingEnd] = useState(false);
  const [startCoordinate, setStartCoordinate] = useState();
  const [endCoordinate, setEndCoordinate] = useState();

  useEffect(() => {
    startCoordinate &&
      endCoordinate &&
      fetch(
        `http://localhost:3000/?number1=${startCoordinate[0]}&number2=${startCoordinate[1]}&number3=${endCoordinate[0]}&number4=${endCoordinate[1]}`
      )
        .then((res) => res.json())
        .then((res) => {
          if (res === "No road\r\n") {
            setPath(-1);
          } else {
            const data = res.split(",");
            data.pop();
            const result = [];
            result.push([
              startCoordinate,
              points.find((point) => data[0] == point[2]),
            ]);
            for (let i = 0; i < data.length - 1; i++) {
              const a = points.find((point) => data[i] == point[2]);
              const b = points.find((point) => data[i + 1] == point[2]);
              result.push([a, b]);
            }
            result.push([
              points.find((point) => data[data.length - 1] == point[2]),
              endCoordinate,
            ]);
            console.log(result);
            setPath(result);
          }
        });
  }, [isFinding]);

  const position = [21.0394459, 105.8405899];
  const redOptions = { color: "red" };
  const limeOptions = { color: "lime" };

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        if (isChoosingStart) {
          setStartCoordinate([e.latlng.lat, e.latlng.lng]);
          setPath(null);
          setIsChoosingStart(false);
        }
        if (isChoosingEnd) {
          setEndCoordinate([e.latlng.lat, e.latlng.lng]);
          setPath(null);
          setIsChoosingEnd(false);
        }
      },
    });
    return false;
  };

  const startIc = new L.Icon({
    iconUrl: startIcon,
    popupAnchor: [-0, -0],
    iconSize: new L.Point(30, 45),
  });
  const endIc = new L.Icon({
    iconUrl: endIcon,
    popupAnchor: [-0, -0],
    iconRetinaUrl: endIcon,
    iconSize: new L.Point(30, 45),
  });

  function DraggableMarker({ pos, setPos, icon }) {
    const markerRef = useRef(null);
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current;
          if (marker != null) {
            setPos([marker.getLatLng().lat, marker.getLatLng().lng]);
            setPath(null);
          }
        },
      }),
      []
    );

    return (
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={pos}
        ref={markerRef}
        icon={icon}
      >
        <Popup>
          <button onClick={() => setPos(null)}>Xóa</button>
        </Popup>
      </Marker>
    );
  }

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
        <div style={{ display: "flex" }}>
          <Input
            text={"Chọn điểm đi"}
            places={places}
            onChange={(event, newValue) => {
              setStartCoordinate(newValue?.coordinate);
              setPath(null);
            }}
          />
          <div
            style={{
              border: "1px solid gray",
              borderRadius: 3,
              height: "56px",
              width: "56px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 5,
              cursor: "pointer",
              opacity: isChoosingStart ? 0.5 : 1,
            }}
            className="hover"
            onClick={() => setIsChoosingStart(true)}
          >
            <img src={startIcon} width={35} height={35} />
          </div>
        </div>

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
        <div style={{ display: "flex" }}>
          <Input
            text={"Chọn điểm đến"}
            places={places}
            onChange={(event, newValue) => {
              setEndCoordinate(newValue?.coordinate);
              setPath(null);
            }}
          />
          <div
            style={{
              border: "1px solid gray",
              borderRadius: 3,
              height: "56px",
              width: "56px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 5,
              cursor: "pointer",
              opacity: isChoosingEnd ? 0.5 : 1,
            }}
            className="hover"
            onClick={() => setIsChoosingEnd(true)}
          >
            <img src={endIcon} width={35} height={35} />
          </div>
        </div>
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            onClick={() => {
              if (!startCoordinate) {
                setPath(-2);
                return;
              }
              if (!endCoordinate) {
                setPath(-3);
                return;
              }
              setIsFinding((prev) => ++prev);
            }}
          >
            Tìm đường
          </Button>

          <div
            style={{
              color: "red",
              position: "absolute",
              bottom: 0,
              width: "200%",
              transform: "translateX(15%) translateY(60%)",
            }}
          >
            {path === -1 && "Không tìm thấy đường đi"}
            {path === -2 && "Vui lòng chọn điểm đầu"}
            {path === -3 && "Vui lòng chọn điểm cuối"}
          </div>
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

        {startCoordinate && (
          <DraggableMarker
            pos={startCoordinate}
            setPos={setStartCoordinate}
            icon={startIc}
          />
        )}
        {endCoordinate && (
          <DraggableMarker
            pos={endCoordinate}
            setPos={setEndCoordinate}
            icon={endIc}
          />
        )}
        {path &&
          path !== -1 &&
          path !== -2 &&
          path !== -3 &&
          path.map((way, i) => (
            <Polyline key={i} pathOptions={limeOptions} positions={way} />
          ))}

        <MapEvents />
      </MapContainer>
    </div>
  );
};

export default App;
