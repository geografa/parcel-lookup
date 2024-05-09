import { useEffect, useState, useRef } from 'react';

import { accessToken } from '../app/Map'

const StaticMapImage = ({ lng, lat }) => {
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)

    const ref = useRef(null)

    useEffect(() => {
        setWidth(ref.current.clientWidth)
        setHeight(ref.current.clientHeight)
    }, [])

    const staticImageUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+ea580b(${lng},${lat})/${lng},${lat},15,0,0/${width}x${height}@2x?access_token=${accessToken}`

    return (
        <div ref={ref} className="bg-cover rounded-lg h-96" style={{
            backgroundImage: width && `url("${staticImageUrl}")`
        }}></div>
    )
}

export default StaticMapImage