import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native'
import InputText from '../components/InputText'
export default function ChatBot() {
  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={{ width: 140, height: 180 }} />
        <Text style={styles.text}>Tourism Assistant</Text>
        <Text style={styles.paragraph}>Your personal itinerary assistant </Text>
      </View>
      <View></View>
      <View>
        <InputText></InputText>
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  header: { padding: 16 ,alignContent: 'center', alignItems: 'center' },
  text: { color: '#323232', fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  paragraph: { color: '#aaa', fontSize: 16, fontWeight: '400', letterSpacing: -0.5 },
})
