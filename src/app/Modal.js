import numeral from 'numeral'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronLeft
} from "@fortawesome/free-solid-svg-icons";

import { pluralize } from '../app/Card'
import StaticMapImage from './StaticMap';
import MapboxTooltip from './MapboxTooltip';

const Modal = ({ feature, onClose }) => {
    const [lng, lat] = feature.geometry.coordinates
    const {
        imageUrl,
        sale_price,
        number_of_bedrooms,
        number_of_bathrooms,
        total_livable_area,
        location
    } = feature.properties

    return (
        <>
            {/* gray out background */}
            <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
                {/* modal container */}
                <div className="border-0 w-5/6 shadow-lg absolute top-0 flex flex-col h-full bg-white outline-none focus:outline-none px-6 overflow-scroll">
                    <div className="flex py-6 sticky top-0 z-50 bg-white">
                        <div className='w-1/3'>
                            <button className='flex items-center hover:underline' onClick={onClose}>
                                <FontAwesomeIcon icon={faChevronLeft} className='mr-3' />
                                <div>Back</div>
                            </button>
                        </div>
                        <div className='w-1/3 flex justify-center'>

                            <div className="bg-contain bg-center bg-no-repeat" style={{
                                height: 30,
                                width: 165,
                                backgroundImage: 'url("img/housebox-logo.svg")',

                            }}></div>
                        </div>
                        <div className='w-1/3'></div>
                    </div>
                    <div className='mb-6 grid grid-cols-2 gap-4'>
                        <div className="bg-cover rounded-lg h-96 " style={{
                            backgroundImage: `url("${imageUrl}")`
                        }}></div>
                        <div className='relative'>
                            <MapboxTooltip
                                title='Static Images API'
                                className='absolute top-3 left-3'
                            >
                                {`
The [Mapbox Static Images API](https://docs.mapbox.com/api/maps/static-images/) serves standalone, static map images generated from Mapbox Studio styles. These images can be displayed on web and mobile devices without the aid of a mapping library or API. They look like an embedded map, but do not have interactivity or controls.

This demo uses a custom React component which calculates the dimensions of the containing div, then sets its background image to a map image from the Static Images API with the same dimensions.

* [Static Images API Playground](https://docs.mapbox.com/playground/static/)
* [Static Images API Documentation](https://docs.mapbox.com/api/maps/static-images/)
                                `}
                            </MapboxTooltip>
                            <StaticMapImage lng={lng} lat={lat} />
                        </div>
                    </div>
                    <div className="flex mb-6 justify-between">
                        <div>
                            <h5 className="mb-1.5 text-3xl font-bold tracking-tight text-gray-900">
                                ${numeral(sale_price).format('0,0')}
                            </h5>
                            <p className="mb-0 font-normal text-gray-800 text-lg">
                                {location}
                            </p>
                        </div>
                        <div>
                            <h5 className="mb-1.5 text-3xl font-bold tracking-tight text-gray-900">
                                {pluralize(number_of_bedrooms, 'bedroom')}
                            </h5>
                        </div>

                        <div>
                            <h5 className="mb-1.5 text-3xl font-bold tracking-tight text-gray-900">
                                {pluralize(number_of_bathrooms, 'bathroom')}
                            </h5>
                        </div>
                        <div>
                            <h5 className="mb-1.5 text-3xl font-bold tracking-tight text-gray-900">
                                {numeral(total_livable_area).format('0,0')} ft<sup>2</sup>
                            </h5>
                        </div>

                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    )
}

export default Modal