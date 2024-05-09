'use client'

import { useState, useRef } from 'react'
import { SearchBox } from '@mapbox/search-js-react';
import mapboxgl from 'mapbox-gl';
import { accessToken } from './Map';
import MapboxTooltip from './MapboxTooltip'

import Map from './Map'
import Card from './Card'
import Modal from './Modal'
import { getFeaturesInView } from './Map/util'

export default function Home() {
  const [currentViewData, setCurrentViewData] = useState([])
  const [activeFeature, setActiveFeature] = useState()
  const [searchValue, setSearchValue] = useState('')
  const mapInstanceRef = useRef()


  const handleMapLoad = (map) => {
    mapInstanceRef.current = map
    setCurrentViewData(getFeaturesInView())
  }

  const handleFeatureClick = (feature) => {
    setActiveFeature(feature)
  }

  const handleModalClose = () => {
    setActiveFeature(undefined)
  }

  const handleSearchChange = (newValue) => {
    setSearchValue(newValue)
  }

  return (
    <>
      {activeFeature && <Modal feature={activeFeature} onClose={handleModalClose} />}
      <main className='flex flex-col h-full'>
        <div className="flex shrink-0 justify-center h-16 items-center border-b border-gray-200 ">
          <div className="bg-contain bg-center bg-no-repeat" style={{
            height: 30,
            width: 165,
            backgroundImage: 'url("img/housebox-logo.svg")',
          }}></div>
        </div>
        <div className="px-3 flex shrink-0 justify-start h-14 items-center border-b border-gray-200 ">
          <SearchBox
            className='w-32'
            options={{
              proximity: [-75.16805, 39.93298],
              types: [
                'postcode',
                'place',
                'locality',
                'neighborhood',
                'street',
                'address'
              ]
            }}
            value={searchValue}
            onChange={handleSearchChange}
            accessToken={accessToken}
            marker
            mapboxgl={mapboxgl}
            placeholder='Search for an address, city, zip, etc'
            map={mapInstanceRef.current}
          />
          <MapboxTooltip
            title='Mapbox Search JS'
            className='ml-3'
          >
            {`
[Mapbox Search JS](https://docs.mapbox.com/mapbox-search-js/guides/) is a set of client-side JavaScript libraries for building interactive search experiences using the [Mapbox Search Service](https://docs.mapbox.com/api/search/).

In addition to the [Search Box](https://docs.mapbox.com/mapbox-search-js/api/react/search/) component implemented here, the package can also add address autofill to your app's forms and retrieve suggestion coordinates programmatically. 

Implementation is available via [React components](https://docs.mapbox.com/mapbox-search-js/api/react/), [Web Components](https://docs.mapbox.com/mapbox-search-js/api/web/), or via the [Core package](https://docs.mapbox.com/mapbox-search-js/core/) which exposes lower-level functionality and allows you to craft a custom UX.          
            `}
          </MapboxTooltip>
        </div>
        <div className="flex grow shrink min-h-0">
          <div className="flex grow shrink-0 relative">
            <div className='absolute top-3 left-3 z-40'>
            <MapboxTooltip title='Mapbox GL JS' className={'mb-1'}>
{`
[Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/guides) is a client-side JavaScript library for building web maps and web applications with Mapbox's modern mapping technology. You can use Mapbox GL JS to display Mapbox maps in a web browser or client, add user interactivity, and customize the map experience in your application.

In this demo, Mapbox GL JS is used via a custom React component. Once the map is rendered, Markers are used to add styled elements to the map based on locations in a static dataset.

* [Use Mapbox GL JS in a React App](https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/)
* [Mapbox GL JS Code Examples](https://docs.mapbox.com/mapbox-gl-js/example/)
`}
            </MapboxTooltip>


            <MapboxTooltip title='Mapbox Standard Style' className={'mb-1'}>
{`
[Mapbox Standard](https://www.mapbox.com/blog/standard-core-style) is the default style used by Mapbox maps. Styles include all of the data and complex symbology for the map, including colors, labels, fonts, atmosphere, etc. Styles are highly customizable, but Mapbox Standard provides a professionally-designed general purpose map style to add your own data to. 

Mapbox Standard enables a highly performant and elegant 3D mapping experience with powerful dynamic lighting capabilities, landmark 3D buildings, and an expertly crafted symbolic aesthetic.

* [Mapbox Standard Demo](https://labs.mapbox.com/labs-standard/#16.2/48.859605/2.293506/-20/62)
* [Mapbox Standard Documentation](https://docs.mapbox.com/mapbox-gl-js/guides/styles/?size=n_10_n#mapbox-standard-1)
`}
            </MapboxTooltip>

            <MapboxTooltip title='Map Markers' className={'mb-1'}>
{`
A [Mapbox GL JS Marker](https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker) displays an html element at a specific geographic location which stays fixed to the map as the user pans and zooms.

Markers can be fully customized using html and css, and can trigger other actions on click.

* [Add a default marker to a web map](https://docs.mapbox.com/mapbox-gl-js/example/add-a-marker/)
* [Add custom icons with Markers](https://docs.mapbox.com/mapbox-gl-js/example/custom-marker-icons/)
`}
            </MapboxTooltip>

            <MapboxTooltip title='Popups' className={'mb-1'}>
{`
A [Mapbox GL JS Popup](https://docs.mapbox.com/mapbox-gl-js/api/markers/#popup) displays text or html fixed to a geographic location on the map. Popups are often combined with markers to show more information when the marker is clicked.

In this demo, a popup is rendering a custom React Card component. (The same component is used to display property listings in the sidebar)

* [Attach a popup to a marker instance](https://docs.mapbox.com/mapbox-gl-js/example/set-popup/)
* [Popup Documentation](https://docs.mapbox.com/mapbox-gl-js/api/markers/#popup)
`}
            </MapboxTooltip>
            </div>
            <Map data={currentViewData} onLoad={handleMapLoad} onFeatureClick={handleFeatureClick} />
          </div>
          {/* sidebar */}
          <div className="p-4 w-96 shadow-xl z-10 overflow-scroll">
            <div className='text-lg text-black font-semibold w-full mb-1.5'>Listings in this Area</div>
            <div className='mb-4'>
              <div className='text-sm font-medium'>
                {currentViewData.length} listings
              </div>
            </div>

            {currentViewData.map((feature, i) => {
              return (
                <div key={i} className='mb-1.5'>
                  <Card feature={feature} onClick={handleFeatureClick} />
                </div>
              )
            })}
          </div>
          {/* end sidebar */}
        </div>
      </main>
    </>
  );
}
