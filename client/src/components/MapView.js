import React from 'react'
import useWindowSize from '../helpers/useWindowSize'

import DraggableGrid from './DraggableGrid'
import MapFilter from './MapFilter'
import MapController from './MapController'

import View from './OpenLayers/DefaultView'
import Default from './OpenLayers/DefaultLayer'
import MNCountiesLayer from './OpenLayers/MNCountiesLayer'
import AlcoholLayerHeatmap from './OpenLayers/AlcoholLayerHeatmap'

//const filterWidth = '900'

const MapView = () => {
  const [width] = useWindowSize()
  return (
    <DraggableGrid>
      <MapFilter width={width / 2} />
      <MapController
        view={View}
        layers={[Default, MNCountiesLayer, AlcoholLayerHeatmap]}
        width={`${width / 2}`}
      />
    </DraggableGrid>
  )
}

export default MapView