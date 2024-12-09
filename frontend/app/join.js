import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import {
  SafeAreaView,
  Button,
  Text,
  View,
  StyleSheet,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  ScrollView,
  Pressable,
  Dimensions,
  Animated,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;


export default function Join() {

  const [loaded, error] = useFonts({
    f1: require("../assets/fonts/f1.ttf"),
    f2: require("../assets/fonts/f2.ttf"),
    f3: require("../assets/fonts/f3.ttf"),
    f4: require("../assets/fonts/f4.ttf"),
  });

  return (
    <SafeAreaView style={styles.main}>
      <ScrollView style={{width: screenWidth}}>
        <View style={styles.main2}>
          <Text style={styles.text}>Select your industry</Text>

          <View style={styles.imgBox}>

            <TouchableOpacity activeOpacity={0.6} style={[styles.musicBox, {borderColor: '#00F200'},styles.shadowProp]}>
              <View style={{width: '40%'}}>
                <Image
                  source={require('../assets/images/picdesigner.jpg')}
                  style={styles.itemImg}
                />
              </View>
              <View style={styles.textBox}>
                <Text style={styles.DesigningText}>Designing</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.6}  style={[styles.musicBox, {borderColor: '#5182EF'},styles.shadowProp]}>
              <View style={styles.textBox}>
                <Text style={styles.dmText}>Digital</Text>
                <Text style={styles.dmText}>Marketing</Text>
              </View>
              <View style={{width: '40%'}}>
                <Image 
                source={require('../assets/images/picdm.jpg')} 
                style={styles.itemImg} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.6}  style={[styles.musicBox,styles.shadowProp]}>
              <View style={{width: '40%'}}>
                <Image
                  source={require('../assets/images/picmusic.jpg')}
                  style={styles.itemImg}
                />
              </View>
              <View style={styles.textBox}>
                <Text style={styles.musicText}>Music</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.6}  style={[styles.musicBox, {borderColor: '#E6783E'},styles.shadowProp]}>
              <View style={styles.textBox}>
                <Text style={styles.programmingText}>programming</Text>
              </View>
              <View style={{width: '40%'}}>
                <Image
                  source={require('../assets/images/picprogramming.jpg')}
                  style={styles.itemImg}
                />
              </View>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
      <StatusBar style='auto'/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'white',
  },

  main2: {
    paddingTop: 36,
  },

  text: {
    color: 'black',
    fontFamily: 'f1',
    fontSize: 25,
    textAlign: 'center',
  },

  imgBox: {
    rowGap: 32,
    marginTop:15,
    padding: 31,
  },

  itemImg: {
    width: 120,
    height: 120,
    borderRadius: 17,
  },

  itemImg2: {
    width: 130,
    height: 130,
    borderRadius: 17,
  },

  itemImg3: {
    width: 130,
    height: 130,
    borderRadius: 17,
  },

  itemImg4: {
    width: 130,
    height: 130,
    borderRadius: 17,
  },

  musicBox: {
    backgroundColor:"black",
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 3,
    borderRadius: 17,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderColor: '#FC2FE2',
  },

  shadowProp: {
    shadowColor:"black",
    shadowOffset: {width: -5, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  textBox: {
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  musicText: {
    fontSize: 24,
    fontFamily: 'f1',
    color: '#FC2FE2',
  },

  dmText: {
    fontSize: 24,
    fontFamily: 'f1',
    color: '#5182EF',
    textAlign:'center',
  },

  programmingText: {
    fontSize: 24,
    fontFamily: 'f1',
    color: '#E6783E',
  },

  DesigningText: {
    fontSize: 24,
    fontFamily: 'f1',
    color: '#00F200',
  },
});
