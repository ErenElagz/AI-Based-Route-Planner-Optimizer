import { StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps' // remove PROVIDER_GOOGLE import if not using Google Maps
import { CustomMaps } from '../assets/custom-maps'
import MapViewDirections from 'react-native-maps-directions'
import {MAP_API_KEY} from '@env'

export default function Map({ route }) {
    const GOOGLE_MAPS_APIKEY = MAP_API_KEY
    const { places } = route.params

    const [optimizedRoute, setOptimizedRoute] = useState([])

    useEffect(() => {
        const fetchOptimizedRoute = async () => {
            const waypoints = places.slice(1, places.length - 1).map((place) => ({
                location: `${place.latitude},${place.longitude}`,
                stopover: true
            }))

            const origin = `${places[0].latitude},${places[0].longitude}`
            const destination = `${places[places.length - 1].latitude},${places[places.length - 1].longitude}`

            const waypointsString = waypoints.map((wp) => wp.location).join('|')
            const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=optimize:true|${waypointsString}&key=${GOOGLE_MAPS_APIKEY}`

            try {
                const response = await fetch(url)
                const data = await response.json()
                if (data.routes.length > 0) {
                    const optimizedOrder = data.routes[0].waypoint_order
                    const optimizedPlaces = [
                        places[0],
                        ...optimizedOrder.map((index) => places[index + 1]),
                        places[places.length - 1]
                    ]
                    setOptimizedRoute(optimizedPlaces)
                }
            } catch (error) {
                console.error(error)
            }
        }

        fetchOptimizedRoute()
    }, [places])

    return (
        <MapView
            style={{ width: '100%', height: '100%' }}
            customMapStyle={CustomMaps}
            provider={PROVIDER_GOOGLE}
            loadingEnabled={true}
            initialRegion={{
                latitude: 41.0082,
                longitude: 28.9784,
                latitudeDelta: 1,
                longitudeDelta: 1
            }}
        >
            {optimizedRoute.length > 0 &&
                optimizedRoute.map((place, index) => (
                    <Marker
                        key={index}
                        coordinate={{ latitude: place.latitude, longitude: place.longitude }}
                        title={place.name}
                        description={place.description}
                    />
                ))}

            {optimizedRoute.length > 0 && (
                <MapViewDirections
                    origin={optimizedRoute[0]}
                    destination={optimizedRoute[optimizedRoute.length - 1]}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={3}
                    waypoints={optimizedRoute.slice(1, -1)}
                    strokeColor='darkgreen'
                    mode='DRIVING'
                />
            )}
            {places.length > 0 && (
                <MapViewDirections
                    origin={places[0]}
                    destination={places[places.length - 1]}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={2}
                    waypoints={places.slice(1, -1)}
                    strokeColor='red'
                    mode='DRIVING'
                />
            )}
        </MapView>
    )
}

const styles = StyleSheet.create({})
