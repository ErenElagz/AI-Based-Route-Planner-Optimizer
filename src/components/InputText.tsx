import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

export default function InputText() {
  const [inputText, setInputText] = useState('')
  return (
    <View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder='Ask for travel tips and questions'
          placeholderTextColor='#969696'
          value={inputText}
          onChangeText={(text) => setInputText(text)}
          selectionColor={'#969696'}
          style={styles.InputText}
        />
        <TouchableOpacity>
          <Image source={require('../assets/rightArrow.png')} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
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
