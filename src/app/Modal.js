import numeral from 'numeral'

import { pluralize } from '../app/Card'
import { accessToken } from '../app/Map'


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


    const staticImageUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+ea580b(${lng},${lat})/${lng},${lat},15,0,0/600x320@2x?access_token=${accessToken}`


    return (
        <>
            {/* gray out background */}
            <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
                {/* modal container */}
                <div className="border-0 w-5/6 shadow-lg absolute top-0 flex flex-col h-full bg-white outline-none focus:outline-none p-6 overflow-scroll">
                    <div className="flex p-6">
                        <div>
                            <div onClick={onClose}>Back</div>
                        </div>
                    </div>
                    <div className='mb-6'>
                        <div className="bg-cover rounded-lg h-96 " style={{
                            backgroundImage: `url("${imageUrl}")`
                        }}></div>
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
                    <div className="flex mb-6 justify-between">

                        <div className="bg-cover rounded-lg h-96 " style={{
                            width: 600,
                            height: 320,
                            backgroundImage: `url("${staticImageUrl}")`
                        }}></div>


                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    )
}

export default Modal