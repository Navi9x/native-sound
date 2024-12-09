import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";


export default function SplashView() {
  return (
    <View style={styles.main}>
      <LottieView
        style={styles.background}
        source={require("../assets/annimations/annimatted-splash.json")}
        autoPlay
      />
      <StatusBar style="light"/>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:"#5E94FB",
  },

  background: {
    top: 0,
    left: 0,
    width: 700,
    height: 700,
  },
});
