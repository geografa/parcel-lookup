// import bbox from "@turf/bbox";
// import mapboxgl from "mapbox-gl";
// import React from "react";
// import { createRoot } from "react-dom/client";

import { faBorderAll } from "@fortawesome/free-solid-svg-icons";

export const addSourcesAndLayers = (map, onParcelClickRef) => {
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
      "fill-color": "#ecbe13",
      "fill-opacity": ["interpolate", ["linear"], ["zoom"], 15, 0, 18, 0.2],
    },
    slot: "middle",
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
      "line-opacity": ["interpolate", ["linear"], ["zoom"], 15, 0, 18, 0.2],
      "line-occlusion-opacity": 0.2,
    },
    slot: "middle",
  });

  // add highlighted fill layer for selected parcels
  map.addLayer({
    id: "parcels-tileset-fill-highlighted",
    type: "fill",
    source: "parcels-tileset",
    "source-layer": "grnsbo-nc-parcel-poly",
    paint: {
      "fill-color": [
        "case",
        ["boolean", ["feature-state", "selected"], false],
        "#ffcc00",
        "rgba(0,0,0,0)",
      ],
      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "selected"], false],
        0.6,
        0,
      ],
    },
    slot: "middle",
  });

  // add fallback highlight layer using selected-feature GeoJSON source
  map.addLayer({
    id: "selected-feature-highlight",
    type: "fill",
    source: "selected-feature",
    paint: {
      "fill-color": "#ffcc00",
      "fill-opacity": 0.6,
      "fill-outline-color": "#ff9900",
    },
    slot: "middle",
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

  // Change cursor to pointer when hovering parcels
  map.on("mouseenter", "parcels-tileset-fill", () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "parcels-tileset-fill", () => {
    map.getCanvas().style.cursor = "";
  });

  // Helper function to compute centroid of polygon
  const computeCentroid = (geometry) => {
    if (geometry.type === "Point") {
      return geometry.coordinates;
    } else if (geometry.type === "Polygon") {
      const coords = geometry.coordinates[0];
      let x = 0,
        y = 0;
      for (const coord of coords) {
        x += coord[0];
        y += coord[1];
      }
      return [x / coords.length, y / coords.length];
    } else if (geometry.type === "MultiPolygon") {
      const coords = geometry.coordinates[0][0];
      let x = 0,
        y = 0;
      for (const coord of coords) {
        x += coord[0];
        y += coord[1];
      }
      return [x / coords.length, y / coords.length];
    }
    return null;
  };

  // Click handler using queryRenderedFeatures around point
  map.on("click", "parcels-tileset-fill", (e) => {
    try {
      // Get the click point in pixel coordinates
      const clickPoint = e.point;

      // Create a small bounding box around the click point (5px radius)
      const bbox = [
        [clickPoint.x - 5, clickPoint.y - 5],
        [clickPoint.x + 5, clickPoint.y + 5],
      ];

      // Query rendered features in the bounding box
      const features = map.queryRenderedFeatures(bbox, {
        layers: ["parcels-tileset-fill"],
      });

      if (!features || features.length === 0) {
        return;
      }

      // Clear previous selection
      if (currentSelectedPolygonId !== null) {
        try {
          map.setFeatureState(
            {
              source: "parcels-tileset",
              sourceLayer: "grnsbo-nc-parcel-poly",
              id: currentSelectedPolygonId,
            },
            { selected: false }
          );
        } catch (err) {
          console.warn("Error clearing previous selection:", err);
        }
      }

      // Get the first feature and try to highlight it
      const feature = features[0];
      const featureId =
        feature.id || feature.properties?.OBJECTID || feature.properties?.FID;

      if (featureId !== undefined) {
        try {
          map.setFeatureState(
            {
              source: "parcels-tileset",
              sourceLayer: "grnsbo-nc-parcel-poly",
              id: featureId,
            },
            { selected: true }
          );
          currentSelectedPolygonId = featureId;
          // Clear GeoJSON fallback since feature state worked
          map.getSource("selected-feature").setData({
            type: "FeatureCollection",
            features: [],
          });
        } catch (err) {
          console.warn("Error setting feature state:", err);
          // Fall back to GeoJSON source if feature state fails
          map.getSource("selected-feature").setData({
            type: "FeatureCollection",
            features: [feature],
          });
        }
      } else {
        // No feature ID available, use GeoJSON fallback
        map.getSource("selected-feature").setData({
          type: "FeatureCollection",
          features: [feature],
        });
      }

      // Fly to the feature centroid
      const center = computeCentroid(feature.geometry);
      if (center) {
        map.flyTo({
          center: center,
          zoom: 18,
          pitch: 60,
          bearing: 0,
          duration: 1000,
        });
      }

      // Call the onParcelClick callback with a converted feature format
      if (onParcelClickRef?.current && feature.properties) {
        // Convert polygon feature to point feature format expected by sidebar
        const formatToDollar = (value) => {
          if (isNaN(value)) return "N/A";
          return `$${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        };

        const convertedFeature = {
          ...feature,
          properties: {
            ...feature.properties,
            location: `${feature.properties.SADDNO || ""} ${
              feature.properties.SADDSTR || ""
            } ${feature.properties.SADDSTTYP || ""} ${
              feature.properties.SCITY || ""
            }`.trim(),
            details: `Use: ${feature.properties.PARUSEDESC || "N/A"}
                      Improved Value: ${
                        formatToDollar(feature.properties.IMPROVVAL) || "N/A"
                      }
                      Land Value: ${
                        formatToDollar(feature.properties.LANDVAL) || "N/A"
                      }`,
            imageUrl: `img/demo-real-estate-popup-${Math.floor(
              Math.random() * 3
            )}.png`,
          },
          geometry: { type: "Point", coordinates: center },
        };
        onParcelClickRef.current(convertedFeature);
      }
    } catch (err) {
      console.warn("Click handler error:", err);
    }
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
      } ${feature.properties.SADDSTTYP || ""} ${
        feature.properties.SCITY || ""
      }`.trim(),
      details: `Use: ${feature.properties.PARUSEDESC || "N/A"}
Improvement Value: ${feature.properties.IMPROVVAL || "N/A"}
Land Value: ${feature.properties.LANDVAL || "N/A"}`,
      imageUrl: `img/demo-real-estate-popup-${i % 5}.png`,
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

// Store reference to currently selected polygon ID for external access
let currentSelectedPolygonId = null;

// Clear all highlights from the map
export const clearAllHighlights = (map) => {
  if (!map) return;

  // Clear polygon highlights
  if (currentSelectedPolygonId !== null) {
    try {
      map.setFeatureState(
        {
          source: "parcels-tileset",
          sourceLayer: "grnsbo-nc-parcel-poly",
          id: currentSelectedPolygonId,
        },
        { selected: false }
      );
      map.easeTo({
        pitch: 0,
        bearing: 0,
        zoom: 17, // Adjust to your original zoom level
      });
    } catch (err) {
      console.warn("Error clearing polygon highlight:", err);
    }
    currentSelectedPolygonId = null;
  }

  // Clear point highlights
  if (currentSelectedFeatureId !== null) {
    try {
      map.setFeatureState(
        {
          source: "parcels-tileset-pts",
          sourceLayer: "grnsbo-nc-parcel-pts",
          id: currentSelectedFeatureId,
        },
        { selected: false }
      );
    } catch (err) {
      console.warn("Error clearing point highlight:", err);
    }
    currentSelectedFeatureId = null;
  }

  // Clear GeoJSON fallback
  try {
    map.getSource("selected-feature").setData({
      type: "FeatureCollection",
      features: [],
    });
  } catch (err) {
    console.warn("Error clearing GeoJSON highlights:", err);
  }
};
