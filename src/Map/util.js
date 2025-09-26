// import bbox from "@turf/bbox";
// import mapboxgl from "mapbox-gl";
// import React from "react";
// import { createRoot } from "react-dom/client";

export const addSourcesAndLayers = (map) => {
  // create empty GeoJSON source for selected feature marker
  map.addSource("selected-feature", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  });
  // add a vector source from mapbox tileset grafa.grnsbo-nc-parcel-poly
  map.addSource("parcels-tileset", {
    type: "vector",
    url: "mapbox://grafa.grnsbo-nc-parcel-poly",
  });
  // add a vector source from mapbox tileset grafa.grnsbo-nc-parcel-pts
  map.addSource("parcels-tileset-pts", {
    type: "vector",
    url: "mapbox://grafa.grnsbo-nc-parcel-pts",
  });

  // add parcel-tileset-fill layer
  map.addLayer({
    id: "parcels-tileset-fill",
    type: "fill",
    source: "parcels-tileset",
    "source-layer": "grnsbo-nc-parcel-poly", // adjust source-layer name as needed
    paint: {
      "fill-color": "rgba(201, 226, 16, 1)",
      "fill-opacity": 0.1,
    },
  });
  // add parcel-tileset-line layer
  map.addLayer({
    id: "parcels-tileset-line",
    type: "line",
    source: "parcels-tileset",
    "source-layer": "grnsbo-nc-parcel-poly", // adjust source-layer name as needed
    paint: {
      "line-color": "rgba(97, 81, 0, 1)",
      "line-width": 0.8,
    },
  });

  // add point layer for labels from grafa.grnsbo-nc-parcel-pts for addresses
  map.addLayer({
    id: "parcels-tileset-labels-address",
    type: "symbol",
    source: "parcels-tileset-pts",
    "source-layer": "grnsbo-nc-parcel-pts", // adjust source-layer name as needed
    minzoom: 17, // Only visible at zoom level 17 or above
    layout: {
      "text-field": [
        "concat",
        ["get", "SADDNO"],
        " ",
        ["get", "SADDSTR"],
        " ",
        ["get", "SADDSTTYP"],
      ], // adjust property names as needed
      "text-size": 10,
      "text-anchor": "bottom",
    },
    paint: {
      "text-color": "rgba(57, 47, 0, 1)",
    },
  });

  // add highlighted point layer for selected parcels
  map.addLayer({
    id: "parcels-tileset-pts-highlighted",
    type: "circle",
    source: "parcels-tileset-pts",
    "source-layer": "grnsbo-nc-parcel-pts",
    paint: {
      "circle-radius": [
        "case",
        ["boolean", ["feature-state", "selected"], false],
        12, // larger radius when selected
        0, // invisible when not selected
      ],
      "circle-color": [
        "case",
        ["boolean", ["feature-state", "selected"], false],
        "#ff4444", // red when selected
        "transparent",
      ],
      "circle-stroke-color": [
        "case",
        ["boolean", ["feature-state", "selected"], false],
        "#ffffff", // white stroke when selected
        "transparent",
      ],
      "circle-stroke-width": [
        "case",
        ["boolean", ["feature-state", "selected"], false],
        3, // thick stroke when selected
        0,
      ],
      "circle-opacity": 0.8,
    },
  });
};

export const getFeaturesInView = (map) => {
  if (!map) return [];

  // Query rendered features from the parcels-tileset-labels-address layer
  const features = map.queryRenderedFeatures({
    layers: ["parcels-tileset-labels-address"],
  });

  return features.slice(0, 60).map((feature, i) => {
    // Create a mock property structure similar to real estate listings
    const properties = {
      ...feature.properties,
      // Mock real estate data based on parcel info
      location: `${feature.properties.SADDNO || ""} ${
        feature.properties.SADDSTR || ""
      } ${feature.properties.SADDSTTYP || ""}`.trim(),
      imageUrl: `img/demo-real-estate-popup-${i % 3}.png`,
    };
    const coordinates = feature.geometry.coordinates;

    return {
      ...feature,
      properties,
      geometry: { type: "Point", coordinates: coordinates },
    };
  });
};

// Store reference to currently selected feature for cleanup
let currentSelectedFeatureId = null;

export const flyToFeatureAndHighlight = (feature, map) => {
  if (!feature || !map || !feature.geometry) return;

  // Remove previous selection
  if (currentSelectedFeatureId !== null) {
    map.setFeatureState(
      {
        source: "parcels-tileset-pts",
        sourceLayer: "grnsbo-nc-parcel-pts",
        id: currentSelectedFeatureId,
      },
      { selected: false }
    );
  }

  // Set new selection - use feature.id if available, otherwise use a property as ID
  const featureId =
    feature.id || feature.properties.OBJECTID || feature.properties.FID;

  if (featureId !== undefined) {
    map.setFeatureState(
      {
        source: "parcels-tileset-pts",
        sourceLayer: "grnsbo-nc-parcel-pts",
        id: featureId,
      },
      { selected: true }
    );

    currentSelectedFeatureId = featureId;
  }

  // Fly to the feature location
  map.flyTo({
    center: feature.geometry.coordinates,
    zoom: 18,
    duration: 1000,
  });
};
