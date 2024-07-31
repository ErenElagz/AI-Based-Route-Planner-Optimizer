import React, { useState } from 'react'
import { View, Text, StyleSheet, SafeAreaView, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Markdown from 'react-native-markdown-display'

export default function ChatBot() {
    const [inputText, setInputText] = useState('')
    const API_KEY = 'AIzaSyBYt6SHTh7MhEvP3LfFHr92_ULpAT0JYO0'
    const genAI = new GoogleGenerativeAI(API_KEY)

    const [generatedText, setGeneratedText] = useState('')
    const fetchData = async () => {
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
            const prompt = inputText
            const result = await model.generateContent(prompt)
            const response = await result.response
            const text = await response.text()
            setGeneratedText(text)
            setInputText('')
            console.log(text)
        } catch (error) {
            console.error('Failed to fetch data:', error)
        }
    }

    return (
        <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
            <ScrollView style={{ backgroundColor: '#fff', flex: 1 }}>
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
                        <TouchableOpacity onPress={fetchData}>
                            <Image
                                source={require('../assets/rightArrow.png')}
                                style={{ width: 24, height: 24, opacity: 0.5 }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ padding: 16 }}>
                        <Markdown>{generatedText}</Markdown>
                    </View>
                </View>
            </ScrollView>
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
