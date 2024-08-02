import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator
} from 'react-native'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { GEMINI_API_KEY } from '@env'

export default function ChatBot({ navigation }) {
    const [isLoading, setIsLoading] = useState(false)
    //AI model
    const API_KEY = GEMINI_API_KEY
    const genAI = new GoogleGenerativeAI(API_KEY)
    //Variables
    const [inputText, setInputText] = useState('')

    const [generatedText, setGeneratedText] = useState('')
    const [places, setPlaces] = useState(null)

    // Fetch data from AI model
    const fetchData = async () => {
        setIsLoading(true)
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
            const promptText =
                'Places must be in Turkey no extra information and it must be in json format but dont add first variable places bestplaces like this DONT ADD json must contain name, latitude, longitude and description no more. example structure : [{"description": "", "latitude": number, "longitude": number, "name": ""},{"description": "", "latitude": number, "longitude": number, "name": ""},{"description": "", "latitude": number, "longitude": number, "name": ""},{"description": "", "latitude": number, "longitude": number, "name": ""},{"description": "", "latitude": number, "longitude": number, "name": ""},{"description": "", "latitude": number, "longitude": number, "name": ""}]'
            const prompt = inputText + promptText
            const result = await model.generateContent(prompt)
            let response = result.response.text()

            // Remove the ```json and ``` parts
            if (response.startsWith('```json')) {
                response = response.substring(8) // Remove '```json\n'
            }
            if (response.endsWith('```')) {
                response = response.substring(0, response.length - 4) // Remove '\n```'
            }
            response = response.replace(/`/g, '') // Remove backticks
            response = response.trim()
            response = JSON.parse(response)
            console.log(response)

            setPlaces(response)
            setGeneratedText(response)
            setInputText('')
            setIsLoading(false)
        } catch (error) {
            console.error('Failed to fetch data:', error)
        }
    }

    return (
        <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
            <ScrollView keyboardShouldPersistTaps='handled'>
                <View style={styles.header}>
                    <Image source={require('../assets/logo.png')} style={{ width: 120, height: 120 }} />
                    <Text style={styles.text}>Tourism Assistant</Text>
                    <Text style={styles.paragraph}>Your personal itinerary assistant</Text>
                </View>
                <View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder='Ask for travel tips and questions'
                            placeholderTextColor='#969696'
                            value={inputText}
                            onChangeText={setInputText}
                            selectionColor={'#969696'}
                            style={styles.InputText}
                        />
                        {isLoading ? (
                            <ActivityIndicator size='small' color='#000' />
                        ) : (
                            <TouchableOpacity onPress={fetchData}>
                                <Image
                                    source={require('../assets/rightArrow.png')}
                                    style={{ width: 24, height: 24 }}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={{ padding: 20, paddingBottom: 80 }}>
                        {places &&
                            places.map((place, index) => (
                                <View
                                    key={index}
                                    style={{
                                        padding: 16,
                                        backgroundColor: '#f9f9f9',
                                        borderRadius: 12,
                                        marginVertical: 8
                                    }}
                                >
                                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#000' }}>{place.name}</Text>
                                    <Text style={{ fontSize: 16, fontWeight: '400', color: '#aaa' }}>
                                        {place.description}
                                    </Text>
                                    <Text style={{ fontSize: 16, color: '#000', marginVertical: 4 }}>
                                        {place.latitude}
                                    </Text>
                                    <Text style={{ fontSize: 16, color: '#000', marginVertical: 4 }}>
                                        {place.longitude}
                                    </Text>
                                </View>
                            ))}
                    </View>
                </View>
            </ScrollView>
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    bottom: 0,
                    padding: 16,
                    width: '100%'
                }}
            >
                <TouchableOpacity
                    onPress={() => navigation.navigate('Map', { places })}
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#000',
                        padding: 16,
                        width: '100%',
                        borderRadius: 16
                    }}
                >
                    <Text style={{ color: '#fff', fontSize: 16 }}>Go to Map</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    header: { padding: 16, alignItems: 'center' },
    text: { color: '#323232', fontSize: 24, fontWeight: '900', letterSpacing: -1 },
    paragraph: { color: '#aaa', fontSize: 16, fontWeight: '400', letterSpacing: -0.5 },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        marginHorizontal: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e1e1e1'
    },
    InputText: { width: '90%', fontSize: 16, color: '#000' }
})
