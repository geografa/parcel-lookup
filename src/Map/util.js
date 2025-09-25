import bbox from "@turf/bbox";
import mapboxgl from "mapbox-gl";
import parcelsGeojson from "../data/san-quinten-parcels.geojson";

const color = "orange";

export const addSourcesAndLayers = (map) => {
  // add a geojson layer from ./data/san-quinten-parcels.geojson
  map.addSource("parcels", {
    type: "geojson",
    data: parcelsGeojson,
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
  // add parcel-fill layer
  map.addLayer({
    id: "parcels-fill",
    type: "fill",
    source: "parcels",
    paint: {
      "fill-color": "rgba(0, 208, 208, 1)",
      "fill-opacity": 0.6,
    },
    layout: {
      visibility: "none", // hidden by default since tileset is initial
    },
    filter: ["==", "$type", "Polygon"],
  });
  // add parcel line layer
  map.addLayer({
    id: "parcels-line",
    type: "line",
    source: "parcels",
    paint: {
      "line-color": "yellow",
      "line-width": 0.8,
    },
    layout: {
      visibility: "none", // hidden by default since tileset is initial
    },
    filter: ["==", "$type", "LineString"],
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
};

export const zoomExtent = (geojson, map) => {
  if (geojson.features.length === 0) return;

  // if the data is a single point, flyTo()
  if (
    geojson.features.filter((feature) => feature.geometry).length === 1 &&
    geojson.features[0].geometry.type === "Point"
  ) {
    map.flyTo({
      center: geojson.features[0].geometry.coordinates,
      zoom: 6,
      duration: 1000,
    });
  } else {
    const bounds = bbox(geojson);
    map.fitBounds(bounds, {
      padding: 50,
      duration: 1000,
    });
  }
};

export const getFeaturesInView = (map) => {
  if (!map) return [];

  // Query rendered features from the parcels-tileset-labels-address layer
  const features = map.queryRenderedFeatures({
    layers: ["parcels-tileset-labels-address"],
  });

  console.log("Features in view:", features.length);

  return features.slice(0, 60).map((feature, i) => {
    // Create a mock property structure similar to real estate listings
    const properties = {
      ...feature.properties,
      // Mock real estate data based on parcel info
      location: `${feature.properties.SADDNO || ""} ${
        feature.properties.SADDSTR || ""
      } ${feature.properties.SADDSTTYP || ""}`.trim(),
      imageUrl: `baja-land-developers/img/demo-real-estate-popup-${i % 3}.png`,
    };

    return {
      ...feature,
      properties,
    };
  });
};

// Store reference to current marker for cleanup
let currentSelectedMarker = null;

export const flyToFeatureAndAddMarker = (feature, map) => {
  if (!feature || !map || !feature.geometry) return;

  // Remove existing marker if it exists
  if (currentSelectedMarker) {
    currentSelectedMarker.remove();
    currentSelectedMarker = null;
  }

  // Create marker element - you can choose between CSS circle or image
  const markerElement = document.createElement("div");
  markerElement.className = "selected-feature-marker";

  // Option 1: CSS-based circle marker (current)
  markerElement.style.width = "24px";
  markerElement.style.height = "24px";
  markerElement.style.backgroundColor = "#ff4444";
  markerElement.style.border = "3px solid white";
  markerElement.style.borderRadius = "50%";
  markerElement.style.boxShadow = "0 2px 8px rgba(0,0,0,0.4)";
  markerElement.style.cursor = "pointer";
  markerElement.style.zIndex = "1000";

  // Option 2: Image-based marker (uncomment to use)
  // markerElement.style.width = "32px";
  // markerElement.style.height = "32px";
  // markerElement.style.backgroundImage = "url('/img/marker-icon.png')";
  // markerElement.style.backgroundSize = "contain";
  // markerElement.style.backgroundRepeat = "no-repeat";
  // markerElement.style.cursor = "pointer";

  // Create the marker
  currentSelectedMarker = new mapboxgl.Marker(markerElement)
    .setLngLat(feature.geometry.coordinates)
    .addTo(map);

  // Fly to the feature location
  map.flyTo({
    center: feature.geometry.coordinates,
    zoom: 18,
    duration: 1000,
  });
};

export const toggleParcelSource = (map, useTileset = false) => {
  if (useTileset) {
    // Hide GeoJSON parcel layers
    map.setLayoutProperty("parcels-fill", "visibility", "none");
    map.setLayoutProperty("parcels-line", "visibility", "none");
    // Show tileset parcel layer
    map.setLayoutProperty("parcels-tileset-fill", "visibility", "visible");
  } else {
    // Show GeoJSON parcel layers
    map.setLayoutProperty("parcels-fill", "visibility", "visible");
    map.setLayoutProperty("parcels-line", "visibility", "visible");
    // Hide tileset parcel layer
    map.setLayoutProperty("parcels-tileset-fill", "visibility", "none");
  }
};
