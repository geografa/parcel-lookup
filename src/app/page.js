'use client'

import { useState } from 'react'
import Map from './Map'
import Card from './Card'
import Modal from './Modal'
import { getFeaturesInView } from './Map/util'

export default function Home() {
  const [currentViewData, setCurrentViewData] = useState([])
  const [activeFeature, setActiveFeature] = useState()

  const handleMapLoad = () => {
    setCurrentViewData(getFeaturesInView())
  }

  const handleFeatureClick = (feature) => {
    setActiveFeature(feature)
  }

  const handleModalClose = () => {
    setActiveFeature(undefined)
  }

  return (
    <>
      {activeFeature && <Modal feature={activeFeature} onClose={handleModalClose} />}
      <main className='flex flex-col h-full'>
        <div className="">Header</div>
        <div className="flex grow shrink min-h-0">
          <div className="flex grow shrink-0">
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
