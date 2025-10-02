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
        <div className="shrink-0 justify-left h-20 items-center border-b border-gray-200 px-4 py-2 bg-yellow-600 text-white">
          <h2 className="text-3xl font-bold">Parcel Lookup Demo</h2>
          <p>City of Roswell GA</p>
        </div>
        <div className="px-3 flex shrink-0 justify-start h-14 items-center border-b border-gray-200  overflow-scroll">
          <MapboxTooltip
            title="Zoning"
            className="mr-3"
            mapInstance={mapInstanceRef.current}
          >
            {`
Land use codes show how each property can be developed or used, such as residential (RS-18), commercial (CX), or civic (CIV). These zoning codes come from the City of Roswell's Unified Development Code.
            `}
          </MapboxTooltip>
          <MapboxTooltip title="Value" className="mr-3">
            {`
Value data is sourced from the Fulton County Tax Assessor's Office and reflects the assessed values for land and improvements on each parcel. This information is updated annually and is used for property tax calculations.
`}
          </MapboxTooltip>
          <MapboxTooltip title="Credits" className="mr-3">
            {`
[City of Roswell Open Data Portal](https://data-roswellga.opendata.arcgis.com/maps/bac168ae8d694f77bae6878b8f46bedf/about)
            
Photo Credits:
* [Matt Jones](https://unsplash.com/@mattrobinjones)
* [Gustavo Zambelli](https://unsplash.com/@zamax)
* [Gus Ruballo](https://unsplash.com/@gusruballo)
* [Zac Gudakov](https://unsplash.com/@zacgudakov)
* [Brian Babb](https://unsplash.com/@brianbabb)
* [Todd Kent](https://unsplash.com/@churchoftodd)
* [Phil Hearing](https://unsplash.com/@philhearing)
* [Vu Anh](https://unsplash.com/@naomi365photography)
* [Johnson](https://unsplash.com/@liujs)
* [Peter Jan Rijpkema](https://unsplash.com/photos/white-house-pnEtsdgBeBE?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)
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
