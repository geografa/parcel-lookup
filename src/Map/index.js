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

const Map = ({ data, onLoad, onFeatureClick, onParcelClick }) => {
  // const { FC: featureCollection } = useData()

  const mapContainer = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const onParcelClickRef = useRef(onParcelClick);

  let mapRef = useRef(null);

  // Update the ref when the callback changes
  useEffect(() => {
    onParcelClickRef.current = onParcelClick;
  }, [onParcelClick]);

  useEffect(() => {
    const map = (mapRef.current = new mapboxgl.Map({
      style: "mapbox://styles/grafa/cmg8ib503002a01qw6rl57683",
      container: mapContainer.current,
      center: [-84.391, 34.076],
      bearing: 0,
      pitch: 40,
      maxPitch: 60,
      zoom: 17,
    }));

    map.addControl(new mapboxgl.NavigationControl());

    map.on("load", () => {
      addSourcesAndLayers(map, onParcelClickRef);
      onLoad(map);
      setMapLoaded(true);
    });

    // Cleanup function to remove the map
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []); // Empty dependency array - only run once

  return (
    <>
      <div ref={mapContainer} className="h-full w-full" />
    </>
  );
};

export default Map;
