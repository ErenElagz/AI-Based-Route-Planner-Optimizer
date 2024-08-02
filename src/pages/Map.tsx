import { ScrollView, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps' // remove PROVIDER_GOOGLE import if not using Google Maps
import { CustomMaps } from '../assets/custom-maps'
import MapViewDirections from 'react-native-maps-directions'
import { MAP_API_KEY } from '@env'
import { View, Text } from 'react-native'

export default function Map({ route }) {
    const GOOGLE_MAPS_APIKEY = MAP_API_KEY
    const { places } = route.params

    const [optimizedRoute, setOptimizedRoute] = useState([])
    let i=0
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
        <>
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
            <ScrollView style={styles.info}>
                <Text style={{ fontSize: 24, fontWeight: '700', color: '#000' }}>Places</Text>
                {places.map((place, index) => (
                    <View key={index} style={styles.card}>
                        <Text style={{ fontSize: 14, fontWeight: '700', color: '#000' }}>{((i++) ,place.name)}</Text>
                        <Text style={{ fontSize: 12, fontWeight: '400', color: '#aaa' }}>{place.description}</Text>
                    </View>
                ))}
                <Text style={{ fontSize: 24, fontWeight: '700', color: '#000' }}>Optimized Route</Text>
                {optimizedRoute.map((place, index) => (
                    <View key={index} style={styles.card}>
                        <Text style={{ fontSize: 14, fontWeight: '700', color: '#000' }}>{place.name}</Text>
                        <Text style={{ fontSize: 12, fontWeight: '400', color: '#aaa' }}>{place.description}</Text>
                    </View>
                ))}
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    info: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        position: 'absolute',
        bottom: 16,
        width: '90%',
        height: '30%',
        alignSelf: 'center',
    },
    card: { backgroundColor: 'white', padding: 8, borderRadius: 16, marginVertical: 8 }
})
