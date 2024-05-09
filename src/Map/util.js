import bbox from '@turf/bbox'
import listingsGeojson from '../data/philadelphia_homes.js'

const dummyGeojson = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [0, 0]
            }
        }
    ]
};

const color = 'orange'

export const addSourcesAndLayers = (map) => {
    map.addSource('listings', {
        type: 'geojson',
        data: listingsGeojson
    });

    map.addLayer({
        id: 'listings-circle',
        type: 'circle',
        source: 'listings'
    });
}

export const zoomExtent = (geojson, map) => {
    if (geojson.features.length === 0) return

    // if the data is a single point, flyTo()
    if (
        geojson.features.filter((feature) => feature.geometry).length === 1 &&
        geojson.features[0].geometry.type === 'Point'
    ) {
        map.flyTo({
            center: geojson.features[0].geometry.coordinates,
            zoom: 6,
            duration: 1000
        });
    } else {
        const bounds = bbox(geojson);
        map.fitBounds(bounds, {
            padding: 50,
            duration: 1000
        });
    }
};

export const getFeaturesInView = () => {
    return listingsGeojson.features.filter(d => d.properties.sale_price)
        .slice(0, 60)
        .map((d, i) => {
            d.properties.imageUrl = `img/demo-real-estate-popup-${i % 4}.png`
            return d
        })
}