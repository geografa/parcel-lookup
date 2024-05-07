import numeral from 'numeral'

export const pluralize = (number, word) => {
    return `${number} ${word}${number === 1 ? '' : 's'} `
}

const Card = ({ feature, onClick }) => {

    const handleClick = () => {
        onClick(feature)
    }

    const {
        imageUrl,
        sale_price,
        number_of_bedrooms,
        number_of_bathrooms,
        total_livable_area,
        location
    } = feature.properties

    return (
        <div className='cursor-pointer' onClick={handleClick}>
            <div className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="bg-cover rounded-t-lg h-40" style={{
                    backgroundImage: `url("${imageUrl}")`
                }}></div>
                <div className="p-3">
                    <h5 className="mb-1.5 text-xl font-bold tracking-tight text-gray-900 dark:text-white">${numeral(sale_price).format('0,0')}</h5>
                    <p className="mb-0 font-normal text-gray-700 dark:text-gray-400 text-sm">{pluralize(number_of_bedrooms, 'bedroom')} • {pluralize(number_of_bathrooms, 'bathroom')} • {numeral(total_livable_area).format('0,0')} ft<sup>2</sup></p>
                    <p className="mb-0 font-normal text-gray-700 dark:text-gray-400 text-sm">{location}</p>
                </div>
            </div>
        </div>

    )
}

export default Card