"use client";

import { useState, useRef, useCallback } from "react";
import classNames from "classnames";
import { SearchBox } from "@mapbox/search-js-react";
import mapboxgl from "mapbox-gl";
import { accessToken } from "./Map";
import MapboxTooltip from "./MapboxTooltip";

import Map from "./Map";
import Card from "./Card";
import Modal from "./Modal";
import {
  getFeaturesInView,
  flyToFeatureAndHighlight,
  clearAllHighlights,
} from "./Map/util";
import companyLogo from "./img/geografa_logo.svg";

import "./styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap, faList } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [currentViewData, setCurrentViewData] = useState([]);
  const [activeFeature, setActiveFeature] = useState();
  const [pinnedFeature, setPinnedFeature] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const mapInstanceRef = useRef();
  const [activeMobileView, setActiveMobileView] = useState("map");

  const handleMapLoad = (map) => {
    mapInstanceRef.current = map;
    setCurrentViewData(getFeaturesInView(map));

    // Add event listener to update features when map moves/zooms
    map.on("moveend", () => {
      setCurrentViewData(getFeaturesInView(map));
    });
  };

  const handleFeatureClick = (feature) => {
    setActiveFeature(feature);

    // Fly to the feature and highlight it using feature state
    if (mapInstanceRef.current) {
      flyToFeatureAndHighlight(feature, mapInstanceRef.current);
    }
  };

  const handleParcelClick = useCallback((feature) => {
    // Pin the clicked feature to the top of the sidebar
    setPinnedFeature(feature);
    // Also open the modal for the feature
    setActiveFeature(feature);
  }, []);

  const handleClearPin = useCallback(() => {
    // Clear the pinned feature
    setPinnedFeature(null);
    // Clear all map highlights
    if (mapInstanceRef.current) {
      clearAllHighlights(mapInstanceRef.current);
    }
  }, []);

  const handleModalClose = () => {
    setActiveFeature(undefined);
  };

  const handleSearchChange = (newValue) => {
    setSearchValue(newValue);
  };

  const handleActiveMobileClick = () => {
    if (activeMobileView === "map") {
      setActiveMobileView("cards");
    } else {
      setActiveMobileView("map");
    }
  };

  return (
    <>
      {activeFeature && (
        <Modal feature={activeFeature} onClose={handleModalClose} />
      )}
      <main className="flex flex-col h-full">
        <div className="flex shrink-0 justify-center h-16 items-center border-b border-gray-200 px-4">
          <div
            className="bg-contain bg-center bg-no-repeat"
            style={{
              height: 30,
              width: 165,
              backgroundImage: `url(${companyLogo})`,
            }}
          ></div>
        </div>
        <div className="px-3 flex shrink-0 justify-start h-14 items-center border-b border-gray-200  overflow-scroll">
          <MapboxTooltip title="Developers" className="mr-3">
            {`
[Mapbox Search JS](https://docs.mapbox.com/mapbox-search-js/guides/) is a set of client-side JavaScript libraries for building interactive search experiences using the [Mapbox Search Service](https://docs.mapbox.com/api/search/).

In addition to the [Search Box](https://docs.mapbox.com/mapbox-search-js/api/react/search/) component implemented here, the package can also add address autofill to your app's forms and retrieve suggestion coordinates programmatically. 

Implementation is available via [React components](https://docs.mapbox.com/mapbox-search-js/api/react/), [Web Components](https://docs.mapbox.com/mapbox-search-js/api/web/), or via the [Core package](https://docs.mapbox.com/mapbox-search-js/core/) which exposes lower-level functionality and allows you to craft a custom UX.          
            `}
          </MapboxTooltip>
          <MapboxTooltip title="Realtors" className={"mr-3"}>
            {`
[Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/guides) is a client-side JavaScript library for building web maps and web applications with Mapbox's modern mapping technology. You can use Mapbox GL JS to display Mapbox maps in a web browser or client, add user interactivity, and customize the map experience in your application.

In this demo, Mapbox GL JS is used via a custom React component. Once the map is rendered, Markers are used to add styled elements to the map based on locations in a static dataset.

* [Use Mapbox GL JS in a React App](https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/)
* [Mapbox GL JS Code Examples](https://docs.mapbox.com/mapbox-gl-js/example/)
`}
          </MapboxTooltip>

          <MapboxTooltip title="Buyers" className={"mr-3"}>
            {`
[Mapbox Standard](https://www.mapbox.com/blog/standard-core-style) is the default style used by Mapbox maps. Styles include all of the data and complex symbology for the map, including colors, labels, fonts, atmosphere, etc. Styles are highly customizable, but Mapbox Standard provides a professionally-designed general purpose map style to add your own data to. 

Mapbox Standard enables a highly performant and elegant 3D mapping experience with powerful dynamic lighting capabilities, landmark 3D buildings, and an expertly crafted symbolic aesthetic.

* [Mapbox Standard Demo](https://labs.mapbox.com/labs-standard/#16.2/48.859605/2.293506/-20/62)
* [Mapbox Standard Documentation](https://docs.mapbox.com/mapbox-gl-js/guides/styles/?size=n_10_n#mapbox-standard-1)
`}
          </MapboxTooltip>

          <MapboxTooltip title="Resources" className={"mr-3"}>
            {`
A [Mapbox GL JS Marker](https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker) displays an html element at a specific geographic location which stays fixed to the map as the user pans and zooms.

Markers can be fully customized using html and css, and can trigger other actions on click.

* [Add a default marker to a web map](https://docs.mapbox.com/mapbox-gl-js/example/add-a-marker/)
* [Add custom icons with Markers](https://docs.mapbox.com/mapbox-gl-js/example/custom-marker-icons/)
`}
          </MapboxTooltip>

          <MapboxTooltip title="Contact" className={"mr-3"}>
            {`
A [Mapbox GL JS Popup](https://docs.mapbox.com/mapbox-gl-js/api/markers/#popup) displays text or html fixed to a geographic location on the map. Popups are often combined with markers to show more information when the marker is clicked.

In this demo, a popup is rendering a custom React Card component. (The same component is used to display property listings in the sidebar)

* [Attach a popup to a marker instance](https://docs.mapbox.com/mapbox-gl-js/example/set-popup/)
* [Popup Documentation](https://docs.mapbox.com/mapbox-gl-js/api/markers/#popup)
`}
          </MapboxTooltip>
        </div>
        <div className="relative lg:flex grow shrink min-h-0">
          <div
            className={classNames("grow shrink-0 relative h-full lg:h-auto", {
              "z-30": activeMobileView === "map",
            })}
          >
            <div className="absolute top-3 left-3 z-10">
              <SearchBox
                className="w-32"
                options={{
                  proximity: [-75.16805, 39.93298],
                  types: [
                    "postcode",
                    "place",
                    "locality",
                    "neighborhood",
                    "street",
                    "address",
                  ],
                }}
                value={searchValue}
                onChange={handleSearchChange}
                accessToken={accessToken}
                marker
                mapboxgl={mapboxgl}
                placeholder="Search for an address, city, zip, etc"
                map={mapInstanceRef.current}
                theme={{
                  variables: {
                    fontFamily: '"Open Sans", sans-serif',
                    fontWeight: 300,
                    unit: "16px",
                    borderRadius: "8px",
                    boxShadow: "0px 2.44px 9.75px 0px rgba(95, 126, 155, 0.2)",
                  },
                }}
              />
            </div>
            <Map
              data={currentViewData}
              onLoad={handleMapLoad}
              onFeatureClick={handleFeatureClick}
              onParcelClick={handleParcelClick}
            />
          </div>
          {/* sidebar */}
          <div className="absolute lg:static top-0 p-4 w-full lg:w-96 shadow-xl z-10 overflow-scroll lg:z-30 h-full lg:h-auto bg-white">
            <div className="text-2xl text-black font-semibold w-full mb-1.5">
              Parcels in this Area
            </div>
            <div className="mb-4 flex items-center justify-between">
              <div className="font-medium text-gray-500">
                {currentViewData.length} parcels
              </div>
              {pinnedFeature && (
                <button
                  onClick={handleClearPin}
                  className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition-colors duration-200"
                  title="Clear selected parcel and remove highlights"
                >
                  Clear Pin
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {pinnedFeature && (
                <div className="mb-1.5 border-2 border-yellow-400 rounded-lg">
                  <div className="text-xs text-yellow-600 font-semibold px-2 pt-1">
                    📍 SELECTED PARCEL
                  </div>
                  <Card feature={pinnedFeature} onClick={handleFeatureClick} />
                </div>
              )}
              {currentViewData
                .filter(
                  (feature) =>
                    !pinnedFeature ||
                    (feature.properties?.OBJECTID !==
                      pinnedFeature.properties?.OBJECTID &&
                      feature.properties?.FID !== pinnedFeature.properties?.FID)
                )
                .map((feature, i) => {
                  return (
                    <div key={i} className="mb-1.5">
                      <Card feature={feature} onClick={handleFeatureClick} />
                    </div>
                  );
                })}
            </div>
          </div>
          {/* end sidebar */}
        </div>
      </main>
      <div
        className="absolute z-30 bottom-5 left-1/2 transform -translate-x-1/2 lg:hidden"
        onClick={handleActiveMobileClick}
      >
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <FontAwesomeIcon
            icon={activeMobileView === "map" ? faList : faMap}
            className="mr-2"
          />
          {activeMobileView === "map" ? "Cards" : "Map"}
        </button>
      </div>
    </>
  );
}
