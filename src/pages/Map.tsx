import { StyleSheet, Text, Button } from 'react-native'
import React, { useState } from 'react'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps' // remove PROVIDER_GOOGLE import if not using Google Maps
import { CustomMaps } from '../assets/custom-maps'
import MapViewDirections from 'react-native-maps-directions'

export default function Map() {
  const origin = { latitude: 41.0082, longitude: 28.9784 }
  const destination = { latitude: 41.0082, longitude: 27.9784 }
  const GOOGLE_MAPS_APIKEY = 'AIzaSyCUc_tcOpeNItTVXxiIu8w6eQ_tmDX9KZw'
  const waypoints = [
    { latitude: 41.082, longitude: 28.784 },
    { latitude: 41.002, longitude: 28.9784 },
    { latitude: 41.06, longitude: 28.9784 }
  ]

  return (
    <>
      <MapView
        style={{ width: '100%', height: '100%' }}
        customMapStyle={CustomMaps}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 41.0082,
          longitude: 28.9784,
          latitudeDelta: 0.0422,
          longitudeDelta: 0.022
        }}
        loadingEnabled={true}
        showsTraffic={true}
      >
        {waypoints.map((waypoint, index) => (
          <Marker key={index} coordinate={{ latitude: waypoint.latitude, longitude: waypoint.longitude }} />
        ))}

        <Marker
          coordinate={{ latitude: 41.0082, longitude: 28.9784 }}
          title={'Istanbul'}
          description={'Welcome to Istanbul'}
        />
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={5}
          waypoints={waypoints}
          strokeColor='darkgreen'
          mode='DRIVING'
        />
      </MapView>
    </>
  )
}

const styles = StyleSheet.create({})
