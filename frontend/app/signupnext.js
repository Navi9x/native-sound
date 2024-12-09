import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
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
} from "react-native";

const imagePath = require("../assets/images/logo.png");

export default function SignUpNext() {
  const params = useLocalSearchParams();
  const [getUser,setUser] = useState("");
  const [getImageStatus,setImageStatus] = useState(null);
  const [loaded, error] = useFonts({
    f1: require("../assets/fonts/f1.ttf"),
    f2: require("../assets/fonts/f2.ttf"),
    f3: require("../assets/fonts/f3.ttf"),
    f4: require("../assets/fonts/f4.ttf"),
  });

  useEffect(()=>{
    async function loadUser(){
      const user = JSON.parse(params.user);
      setUser(user);
      setImageStatus(JSON.parse(params.imageStatus));
    }
    loadUser();
  },[])

    return (
    <SafeAreaView style={styles.main}>
      <View style={styles.welcomeView1}>
        <Image
          style={styles.logo}
          source={imagePath}
        />
        <Text style={styles.welcomeText}>Welcome To NativeSound</Text>

        <View style={styles.textView}>
          <Text style={styles.welcomeText2}>
            Through our chat app, you have got an opportunity to earn by
            providing a service with your skills or share your knowledge and
            solve your problems on your mother language
          </Text>
          <Text style={styles.welcomeText2}>
            Join our skill team get this chance and upgrade your skills for a
            new digital world !
          </Text>
        </View>

        <View style={styles.btnView}>
          <Pressable style={[styles.btn,styles.btn1]} onPress={()=>{
            router.push({
              pathname:"/saveskill",
              params:{
                user : JSON.stringify(getUser),
                imageStatus:JSON.stringify(getImageStatus)
              },
            });
          }}>
            <Text style={styles.btnText}>Join</Text>
          </Pressable>
          <Pressable style={styles.continueBtn1} onPress={()=>{
            router.replace("/home");
          }}>
            <Text style={styles.btnText2}>Continue As User</Text>
          </Pressable>
        </View>
      </View>
      <StatusBar style="auto"/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
  },

  welcomeView1: {
    alignItems: "center",
    rowGap: 30,
    paddingHorizontal: 27,
  },

  logo: {
    width: 140,
    height: 140,
    borderRadius: 60,
  },

  welcomeText: {
    color: "black",
    fontSize: 27,
    fontFamily: "f3",
  },

  loginText2: {
    color: "gray",
    fontFamily: "QuicksandMedium",
  },

  welcomeText2: {
    fontSize: 17,
    color: "black",
    textAlign: "center",
    fontFamily: "f1",
  },

  textView: {
    rowGap: 23,
  },

  joinBtn: {
    width: "80%",
    padding: 18,
    borderRadius: 22,
    backgroundColor: "#5E94FB",
    top: 30,
  },

  continueBtn1: {
    width: "80%",
    padding: 18,
    borderRadius: 22,
    backgroundColor: "#003459",
    top: 30,
  },

  btnView: {
    width: "100%",
    alignItems: "center",
    rowGap: 7,
  },

  btn: {
    width: "80%",
    borderRadius: 22,
    padding:18,
    fontSize: 20,
    alignItems: "center",
  },

  btn1: {
    backgroundColor: "#5E94FB",
    marginTop: 30,
  },

  btn2: {
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "black",
  },

  btnText: {
    fontSize: 18,
    color: "#00263F",
    alignSelf: "center",
    fontWeight: "bold",
    fontStyle:"f1",
  },

  btnText2: {
    fontSize: 18,
    color: "white",
    alignSelf: "center",
    fontWeight: "bold",
    fontStyle:"f1", 
  },
});
