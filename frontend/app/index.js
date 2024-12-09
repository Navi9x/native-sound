import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Appearance,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import PhoneInput from "react-native-phone-number-input";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import SplashView from "./SplashView";

const imagePath = require("../assets/images/logo.png");

SplashScreen.preventAutoHideAsync();

export default function SignIn() {
  const [getMobile, setMobile] = useState("");
  const [getPassword, setPassword] = useState("");
  const [isSplashScreen, setIsSplashScreen] = useState(true);
  const [user, setUser] = useState(null);

  const [loaded, error] = useFonts({
    f1: require("../assets/fonts/f1.ttf"),
    f2: require("../assets/fonts/f2.ttf"),
  });

  useEffect(() => {
    setTimeout(() => {
      setIsSplashScreen(false);
    }, 3500);
  }, []);

  useEffect(() => {
    async function check() {
      try {
        const user = await AsyncStorage.getItem("user");
        setUser(user);
        if (user != null) {
          if (!isSplashScreen) {
            router.replace("/home");
          }
        }
      } catch (error) {}
    }
    check();
  }, [isSplashScreen]);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    <>
      {!isSplashScreen && user == null ? (
        <SafeAreaView style={styles.main}>
          <LottieView
            style={styles.background}
            source={require("../assets/annimations/bg-animation.json")}
            autoPlay
            loop
          />

          <View style={styles.view1}>
            <Image style={styles.logo} source={imagePath} />
            <Text style={[styles.text, styles.text1]}>Welcome Back!</Text>
            <Text style={[styles.text, styles.text1]}>
              Time to connect with native vibe..🍃{" "}
            </Text>
          </View>

          <View style={[styles.view2, styles.inputView]}>
            <TextInput
              style={styles.input}
              inputMode="tel"
              placeholder="Mobile Number"
              onChangeText={(text) => {
                setMobile(text);
              }}
            />
            <TextInput
              secureTextEntry={true}
              style={styles.input}
              placeholder="Password"
              onChangeText={(text) => {
                setPassword(text);
              }}
            />
          </View>

          <View style={styles.view2}>
            <Pressable
              style={[styles.btn, styles.btn1]}
              onPress={async () => {
                const response = await fetch(
                  "http://172.20.10.5:8080/NativeSound/SignIn",
                  {
                    method: "POST",
                    body: JSON.stringify({
                      mobile: getMobile,
                      password: getPassword,
                    }),
                    headers: "application/json",
                  }
                );

                if (response.ok) {
                  let json = await response.json();
                  if (json.success) {
                    try {
                      await AsyncStorage.setItem(
                        "user",
                        JSON.stringify(json.object)
                      );
                    } catch (error) {}
                    router.replace("/home");
                  } else {
                    Alert.alert("message", json.message);
                  }
                } else {
                  Alert.alert("Alert", "Connection error");
                }
              }}
            >
              <Text style={[styles.text, styles.text2]}>Login</Text>
            </Pressable>

            <Pressable
              style={[styles.btn, styles.btn2]}
              onPress={() => {
                router.replace("/signup");
              }}
            >
              <Text style={[styles.text, styles.text3]}>Create an account</Text>
            </Pressable>
          </View>

          <StatusBar style="dark" />
        </SafeAreaView>
      ) : (
        <SplashView/>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 70,
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 900,
    height: 900,
  },
  text: {
    fontFamily: "f1",
  },

  text1: {
    fontSize: 21,
  },

  logo: {
    width: 140,
    height: 140,
    marginBottom: 28,
  },

  view1: {
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "85%",
  },

  view2: {
    alignItems: "center",
    width: "85%",
    marginTop: 28,
    rowGap: 14,
  },

  input: {
    width: "100%",
    backgroundColor: "#d4e4fd",
    borderColor: "#5E94FB",
    borderRadius: 14,
    padding: 14,
    paddingVertical: 16,
    borderWidth: 1,
    fontSize: 20,
  },

  btn: {
    width: "100%",
    borderRadius: 14,
    paddingVertical: 14,
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
    backgroundColor: "#cfe5fc",
  },

  text2: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },

  text3: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
  },

  inputView: {
    marginTop: 50,
  },
});
