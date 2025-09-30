export const addSourcesAndLayers = (map, onParcelClickRef) => {
  // create empty GeoJSON source for selected feature marker
  map.addSource("selected-feature", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  });
  // city boundary from public/data/roswell-city-boundary.geojson
  map.addSource("roswell-boundary", {
    type: "geojson",
    data: "data/roswell-city-boundary.geojson",
  });
  map.addLayer({
    id: "roswell-boundary-layer",
    type: "line",
    source: "roswell-boundary",
    paint: {
      "line-color": "#ec6157",
      "line-width": 6,
      "line-opacity": 0.5,
    },
  });
  // add a vector source from mapbox tileset grafa.ga-roswell-parcels
  map.addSource("ga-parcels-tileset", {
    type: "vector",
    url: "mapbox://grafa.ga-roswell-parcels",
  });
  // add a vector source from mapbox tileset grafa.ga-roswell-parcels-pts
  map.addSource("ga-roswell-parcels-pts", {
    type: "vector",
    url: "mapbox://grafa.ga-roswell-parcels-pts",
  });

  // add parcel-tileset-fill layer
  map.addLayer({
    id: "ga-parcels-tileset-fill",
    type: "fill",
    source: "ga-parcels-tileset",
    "source-layer": "ga-roswell-parcels", // adjust source-layer name as needed
    paint: {
      "fill-color": "#ecbe13",
      "fill-opacity": ["interpolate", ["linear"], ["zoom"], 15, 0, 18, 0.2],
    },
    slot: "middle",
  });
  // add parcel-tileset-line layer
  map.addLayer({
    id: "ga-parcels-tileset-line",
    type: "line",
    source: "ga-parcels-tileset",
    "source-layer": "ga-roswell-parcels", // adjust source-layer name as needed
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
    id: "ga-parcels-tileset-fill-highlighted",
    type: "fill",
    source: "ga-parcels-tileset",
    "source-layer": "ga-roswell-parcels",
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

  // add point layer for labels from grafa.ga-roswell-parcels-pts for addresses
  map.addLayer({
    id: "ga-parcels-tileset-labels-address",
    type: "symbol",
    source: "ga-roswell-parcels-pts",
    "source-layer": "ga-roswell-parcels-pts", // adjust source-layer name as needed
    minzoom: 17, // Only visible at zoom level 17 or above
    layout: {
      "text-field": ["get", "SITEADDRES"], // adjust property names as needed
      "text-size": 10,
      "text-anchor": "bottom",
    },
    paint: {
      "text-color": "rgba(57, 47, 0, 1)",
    },
  });

  // add highlighted point layer for selected parcels
  map.addLayer({
    id: "ga-roswell-parcels-pts-highlighted",
    type: "circle",
    source: "ga-roswell-parcels-pts",
    "source-layer": "ga-roswell-parcels-pts",
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
  map.on("mouseenter", "ga-parcels-tileset-fill", () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "ga-parcels-tileset-fill", () => {
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
  map.on("click", "ga-parcels-tileset-fill", (e) => {
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
        layers: ["ga-parcels-tileset-fill"],
      });

      if (!features || features.length === 0) {
        return;
      }

      // Clear previous selection
      if (currentSelectedPolygonId !== null) {
        try {
          map.setFeatureState(
            {
              source: "ga-parcels-tileset",
              sourceLayer: "ga-roswell-parcels",
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
              source: "ga-parcels-tileset",
              sourceLayer: "ga-roswell-parcels",
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
        console.log("Clicked feature:", feature);
        const convertedFeature = {
          ...feature,
          properties: {
            ...feature.properties,
            location: feature.properties.SITEADDRES || "N/A",
            details: `Use: ${feature.properties["USECDDESC_"] || "N/A"}
                Improved Value: $${feature.properties["ImprAppr_1"] || "N/A"}
                Land Value: $${feature.properties["LandAppr_1"] || "N/A"}`,
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

  // Query rendered features from the ga-parcels-tileset-labels-address layer
  const features = map.queryRenderedFeatures({
    layers: ["ga-parcels-tileset-labels-address"],
  });

  return features.slice(0, 60).map((feature, i) => {
    console.log("Feature in view:", feature);
    // Create a mock property structure similar to real estate listings
    const properties = {
      ...feature.properties,
      // Mock real estate data based on parcel info
      location: feature.properties.SITEADDRES || "N/A",
      details: `Use: ${feature.properties.USECDDESC_ || "N/A"}
  Improvement Value: ${feature.properties["ImprAppr_1"] || "N/A"}
  Land Value: ${feature.properties["LandAppr_1"] || "N/A"}`,
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
        source: "ga-roswell-parcels-pts",
        sourceLayer: "ga-roswell-parcels-pts",
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
        source: "ga-roswell-parcels-pts",
        sourceLayer: "ga-roswell-parcels-pts",
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
          source: "ga-parcels-tileset",
          sourceLayer: "ga-roswell-parcels",
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
          source: "ga-roswell-parcels-pts",
          sourceLayer: "ga-roswell-parcels-pts",
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
