import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import numeral from 'numeral'
import mapboxgl from 'mapbox-gl';

const Marker = ({ feature, map, children }) => {
    const markerRef = useRef();
    const markerEl = useRef();
    const popupEl = useRef();

    const [active, setActive] = useState(false)

    const handlePopupOpen = () => {
        setActive(true)
    }

    const handlePopupClose = () => {
        setActive(false)
    }

    useEffect(() => {
        const marker = new mapboxgl.Marker({
            element: markerEl.current
        })
            .setLngLat(feature.geometry.coordinates)
            .addTo(map)

        marker.addTo(map);

        markerRef.current = marker;
    }, [feature]);

    useEffect(() => {
        const marker = markerRef.current;
        if (!marker) return;

        let popup;

        if (children) {
            popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: true,
                closeOnMove: true,
                maxWidth: '300px',
                offset: 14
            })
                .setDOMContent(popupEl.current)
                .on('open', handlePopupOpen)
                .on('close', handlePopupClose)
        }

        // if popup is undefined, this will remove the popup from the marker
        marker.setPopup(popup);
    }, [children]);


    if (!feature) return null
    const { sale_price: salePrice } = feature.properties

    return (
        <div>
            <div ref={markerEl} className={classNames('marker h-3 px-2 py-1 bg-orange-600 text-white rounded-md box-content shadow hover:bg-orange-800 mapboxgl-marker mapboxgl-marker-anchor-center', {
                'active': active
            })}>
                <div style={{
                    fontSize: 11,
                    lineHeight: '12px'
                }}>${numeral(salePrice).format('0a').toUpperCase()}</div>
            </div>
            <div ref={popupEl}>{children}</div>
        </div>
    )
}

export default Marker