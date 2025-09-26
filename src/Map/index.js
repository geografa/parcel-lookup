"use client";

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl";

// import Marker from "../Marker";
// import Card from "../Card";
import { addSourcesAndLayers } from "./util";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
// import { TouchPitchHandler } from "mapbox-gl";

// Use environment variable for Mapbox token in production. CRA inlines
// REACT_APP_* variables at build time.
export const accessToken = (mapboxgl.accessToken =
  process.env.REACT_APP_MAPBOX_TOKEN ||
  "pk.eyJ1IjoiZ3JhZmEiLCJhIjoiY20wdTdlcTM3MTRsZDJxcGxmcW85MzQxMCJ9.H-wLHlLXdbtIQ9R1zsDuJg");

const Map = ({ data, onLoad, onFeatureClick }) => {
  // const { FC: featureCollection } = useData()

  const mapContainer = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  let mapRef = useRef(null);

  useEffect(() => {
    const map = (mapRef.current = new mapboxgl.Map({
      style: "mapbox://styles/mapbox/streets-v11",
      container: mapContainer.current,
      center: [-79.78991, 36.07982],
      bearing: 0,
      pitch: 0,
      maxPitch: 60,
      zoom: 18,
    }));

    map.addControl(new mapboxgl.NavigationControl());

    map.on("load", () => {
      addSourcesAndLayers(map);
      onLoad(map);
      setMapLoaded(true);
    });
  }, []);

  return (
    <>
      <div ref={mapContainer} className="h-full w-full" />
    </>
  );
};

export default Map;
