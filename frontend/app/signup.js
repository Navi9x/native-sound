import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import CountryCodeDropdownPicker from "react-native-dropdown-country-picker";
import { Picker } from "@react-native-picker/picker";
import { SelectList } from "react-native-dropdown-select-list";
import { Dropdown } from "react-native-element-dropdown";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const imagePath = require("../assets/images/gif(1).gif");

export default function SignUp() {
  const [getImage, setImage] = useState(null);

  const [loaded, error] = useFonts({
    f1: require("../assets/fonts/f1.ttf"),
    f2: require("../assets/fonts/f2.ttf"),
    f3: require("../assets/fonts/f3.ttf"),
    f4: require("../assets/fonts/f4.ttf"),
  });

  const [data, setData] = useState([
    { label: "Afrikaans", value: "af" },
    { label: "Albanian", value: "sq" },
    { label: "Arabic", value: "ar" },
    { label: "Armenian", value: "hy" },
    { label: "Azerbaijani", value: "az" },
    { label: "Basque", value: "eu" },
    { label: "Belarusian", value: "be" },
    { label: "Bengali", value: "bn" },
    { label: "Bosnian", value: "bs" },
    { label: "Bulgarian", value: "bg" },
    { label: "Catalan", value: "ca" },
    { label: "Chinese", value: "zh" },
    { label: "Croatian", value: "hr" },
    { label: "Czech", value: "cs" },
    { label: "Danish", value: "da" },
    { label: "Dutch", value: "nl" },
    { label: "English", value: "en" },
    { label: "Estonian", value: "et" },
    { label: "Finnish", value: "fi" },
    { label: "French", value: "fr" },
    { label: "Galician", value: "gl" },
    { label: "Georgian", value: "ka" },
    { label: "German", value: "de" },
    { label: "Greek", value: "el" },
    { label: "Gujarati", value: "gu" },
    { label: "Haitian Creole", value: "ht" },
    { label: "Hebrew", value: "he" },
    { label: "Hindi", value: "hi" },
    { label: "Hungarian", value: "hu" },
    { label: "Icelandic", value: "is" },
    { label: "Indonesian", value: "id" },
    { label: "Irish", value: "ga" },
    { label: "Italian", value: "it" },
    { label: "Japanese", value: "ja" },
    { label: "Kazakh", value: "kk" },
    { label: "Korean", value: "ko" },
    { label: "Kyrgyz", value: "ky" },
    { label: "Latvian", value: "lv" },
    { label: "Lithuanian", value: "lt" },
    { label: "Macedonian", value: "mk" },
    { label: "Malay", value: "ms" },
    { label: "Maltese", value: "mt" },
    { label: "Norwegian", value: "no" },
    { label: "Persian", value: "fa" },
    { label: "Polish", value: "pl" },
    { label: "Portuguese", value: "pt" },
    { label: "Romanian", value: "ro" },
    { label: "Russian", value: "ru" },
    { label: "Serbian", value: "sr" },
    { label: "Slovak", value: "sk" },
    { label: "Slovenian", value: "sl" },
    { label: "Spanish", value: "es" },
    { label: "Swahili", value: "sw" },
    { label: "Swedish", value: "sv" },
    { label: "Tamil", value: "ta" },
    { label: "Telugu", value: "te" },
    { label: "Thai", value: "th" },
    { label: "Turkish", value: "tr" },
    { label: "Ukrainian", value: "uk" },
    { label: "Urdu", value: "ur" },
    { label: "Uzbek", value: "uz" },
    { label: "Vietnamese", value: "vi" },
    { label: "Welsh", value: "cy" },
    { label: "Xhosa", value: "xh" },
    { label: "Yiddish", value: "yi" },
    { label: "Zulu", value: "zu" },
    { label: "Sinhala", value: "si" },
  ]);
  const [value, setValue] = useState([]);

  const [selected, setSelected] = useState("+94");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");

  const [getFirstName, setFirstName] = useState("");
  const [getLastName, setLastName] = useState("");
  const [getPassword, setPassword] = useState("");

  const [getError, setError] = useState(null);

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };

  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "Hello",
      text2: "This is some something 👋",
    });
  };

  return (
    <SafeAreaView style={styles.main}>
      {/* <LinearGradient
        colors={["#6a30df", "#df30b2"]}
        style={styles.background}
      /> */}

      <ScrollView
        alwaysBounceVertical={false}
        automaticallyAdjustKeyboardInsets={true}
        indicatorStyle="white"
        style={styles.scrollView1}
      >
        <View style={styles.subView1}>
          <View>
            <Text style={styles.text1}>Create an</Text>
            <View style={styles.view1}>
              <Text style={styles.text1}>Account</Text>
              <FontAwesome style={styles.icon1} name="rocket" size={26} />
            </View>
            <Text style={styles.text3}></Text>
          </View>

          <View>
            <Image style={styles.logo} source={imagePath} />
          </View>
        </View>

        <View style={styles.subView2}>
          <View style={styles.view3}>
            <Pressable
              style={getImage == null ? styles.imageSelector : null}
              onPress={async () => {
                const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();

                if (!granted) {
                  Alert.alert(
                    "Permission Denied",
                    "Sorry, we need permission to access your photos to signup !"
                  );
                  return;
                }

                let result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  quality: 1,
                });

                if (!result.canceled) {
                  setImage(result.assets[0].uri);
                }
              }}
            >
              <Image
                style={getImage != null ? styles.imageSelector : null}
                source={getImage}
              />
              {getImage == null ? (
                <FontAwesome name="camera" size={25} color={"#5E94FB"} />
              ) : null}
            </Pressable>
          </View>

          <View style={styles.view3}>
            <View style={styles.inputTextView}>
              <Text style={styles.text2}>*Mobile number</Text>
              {getError == "mobile" ? (
                <Text style={styles.errorText}>Invalid mobile number</Text>
              ) : null}
            </View>

            <CountryCodeDropdownPicker
              selected={selected}
              setSelected={setSelected}
              setCountryDetails={setCountry}
              phone={phone}
              setPhone={setPhone}
              countryCodeTextStyles={{ fontSize: 13 }}
              phoneStyles={
                getError != "mobile" ? styles.input1 : styles.errorInput
              }
              countryCodeContainerStyles={styles.input3}
              searchStyles={styles.input1}
            />
          </View>

          <View style={styles.view3}>
            <View style={styles.inputTextView}>
              <Text style={styles.text2}>*First Name</Text>
              {getError == "fname" ? (
                <Text style={styles.errorText}>Required field</Text>
              ) : null}
            </View>
            <TextInput
              style={getError != "fname" ? styles.input1 : styles.errorInput}
              maxLength={45}
              onChangeText={(text) => {
                setFirstName(text);
              }}
            />
          </View>

          <View style={styles.view3}>
            <View style={styles.inputTextView}>
              <Text style={styles.text2}>*Last Name</Text>
              {getError == "lname" ? (
                <Text style={styles.errorText}>Required field</Text>
              ) : null}
            </View>
            <TextInput
              style={getError != "lname" ? styles.input1 : styles.errorInput}
              maxLength={45}
              onChangeText={(text) => {
                setLastName(text);
              }}
            />
          </View>

          <View style={styles.view3}>
            <View style={styles.inputTextView}>
              <Text style={styles.text2}>*Language</Text>
              {getError == "lang" ? (
                <Text style={styles.errorText}>Required field</Text>
              ) : null}
            </View>
            <Dropdown
              style={getError != "lang" ? styles.input1 : styles.errorInput}
              inputSearchStyle={styles.inputSearchStyle}
              data={data}
              search
              maxHeight={260}
              labelField="label"
              valueField="value"
              value={value}
              placeholder="Select your language"
              containerStyle={styles.con}
              activeColor={"#5E94FB"}
              onChange={(item) => {
                setValue(item.value);
              }}
              renderItem={renderItem}
            />
          </View>

          <View style={styles.view3}>
            <View style={styles.inputTextView}>
              <Text style={styles.text2}>*Password</Text>
              {getError == "pw" ? (
                <Text style={styles.errorText}>Required field</Text>
              ) : getError == "weak pw" ? (
                <Text style={styles.errorText}>Password should be strong</Text>
              ) : null}
            </View>
            <TextInput
              style={
                getError !== "pw" && getError !== "weak pw"
                  ? styles.input1
                  : styles.errorInput
              }
              secureTextEntry={true}
              maxLength={20}
              onChangeText={(text) => {
                setPassword(text);
              }}
            />
          </View>

          <View style={styles.view3}>
            <Pressable
              style={styles.btn1}
              onPress={async () => {
                let form = new FormData();
                form.append("mobile", selected + phone);
                form.append("firstName", getFirstName);
                form.append("lastName", getLastName);
                form.append("password", getPassword);
                form.append("language", value);
                if (getImage != null) {
                  form.append("image", {
                    name: "",
                    uri: getImage,
                    type: "image/png",
                  });
                }

                let response = await fetch(
                  "http://172.20.10.5:8080/NativeSound/SignUp",
                  {
                    method: "POST",
                    body: form,
                  }
                );

                if (response.ok) {
                  let json = await response.json();
                  if (json.success) {
                    const user_json = JSON.stringify(json.object);
                    await AsyncStorage.setItem("user", user_json);
                    router.replace({
                      pathname: "/signupnext",
                      params: {
                        user: user_json,
                        imageStatus: JSON.stringify(json.message),
                      },
                    });
                  } else {
                    if (json.message == "Invalid mobile") {
                      setError("mobile");
                    } else if (json.message == "Invalid fname") {
                      setError("fname");
                    } else if (json.message == "Invalid lname") {
                      setError("lname");
                    } else if (json.message == "Invalid password") {
                      setError("pw");
                    } else if (json.message == "Weak password") {
                      setError("weak pw");
                    } else if (json.message == "Invalid language") {
                      setError("lang");
                    } else if (json.message == "Mobile repeat") {
                      Alert.alert(
                        "Alert",
                        "Mobile number already registered choose different !"
                      );
                    } else {
                      Alert.alert(
                        "Alert",
                        "Sorry can't proccess your request in this time"
                      );
                    }
                  }
                }
              }}
            >
              <Text style={styles.btnText1}>Next</Text>
            </Pressable>

            <Pressable
              style={styles.btn2}
              onPress={() => {
                router.replace("/");
              }}
            >
              <Text style={styles.btnText2}>Go to sign in</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#5E94FB",
  },

  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
    opacity: 0.1,
  },

  scrollView1: {
    flexGrow: 1,
  },

  subView1: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#5E94FB",
    paddingHorizontal: 26,
  },

  subView2: {
    paddingTop: 26,
    paddingHorizontal: 26,
    backgroundColor: "white",
    borderRadius: 30,
  },

  logo: {
    flex: 1,
    width: 140,
    height: 140,
    marginBottom: 16,
  },

  text1: {
    fontFamily: "f3",
    fontSize: 34,
    color: "white",
  },

  text2: {
    fontFamily: "f3",
    fontSize: 18,
    color: "#5E94FB",
  },

  text3: {
    fontFamily: "f1",
    fontSize: 18,
    color: "#df30b2",
  },

  view1: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 14,
  },

  view2: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 28,
  },

  view3: {
    rowGap: 7,
    marginBottom: 26,
  },

  view4: {
    marginBottom: 26,
    flexDirection: "row",
    paddingBottom: 16,
    justifyContent: "space-between",
  },

  view5: {
    width: "100%",
    backgroundColor: "#5E94FB",
    height: 40,
  },

  icon1: {
    color: "white",
  },

  input1: {
    width: "100%",
    backgroundColor: "#d4e4fd",
    borderColor: "#5E94FB",
    padding: 14,
    paddingVertical: 14,
    borderRadius: 14,
    color: "black",
    fontSize: 18,
    borderWidth: 1,
  },

  errorInput: {
    width: "100%",
    backgroundColor: "#e0e5ec",
    borderColor: "red",
    borderWidth: 2,
    padding: 14,
    paddingVertical: 14,
    borderRadius: 14,
    color: "black",
    fontSize: 18,
    borderWidth: 1,
  },

  inputTextView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  errorText: {
    fontFamily: "f4",
    fontSize: 15,
    color: "red",
    alignSelf: "center",
  },

  input2: {
    backgroundColor: "#dae7ee",
    borderColor: "#5E94FB",
    padding: 14,
    paddingVertical: 14,
    borderRadius: 14,
    color: "black",
    fontSize: 18,
    borderWidth: 1,
  },

  input3: {
    backgroundColor: "#CDDDFC",
    borderColor: "#5E94FB",
    padding: 14,
    paddingVertical: 14,
    borderRadius: 14,
    color: "black",
    fontSize: 18,
    borderWidth: 1,
    height: 51,
  },

  input4: {
    width: "48%",
  },

  btn1: {
    width: "100%",
    backgroundColor: "#5E94FB",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
  },

  btn2: {
    width: "100%",
    padding: 14,
    alignItems: "center",
  },

  btn3: {
    backgroundColor: "#5E94FB",
    borderRadius: 14,
    width: "48%",
    padding: 14,
    alignItems: "center",
  },

  btnText1: {
    color: "white",
    fontFamily: "f3",
    fontSize: 20,
  },

  btnText2: {
    color: "black",
    fontFamily: "f1",
    fontSize: 20,
    textDecorationLine: "underline",
    textDecorationColor: "#5E94FB",
  },

  imageSelector: {
    borderRadius: 100,
    width: 120,
    height: 120,
    borderWidth: 1,
    backgroundColor: "#d4e4fd",
    borderColor: "#5E94FB",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  inputSearchStyle: {
    height: 45,
    fontSize: 16,
    backgroundColor: "#CDDDFC",
    borderRadius: 11,
  },

  con: {
    borderRadius: 11,
    paddingHorizontal: 7,
    backgroundColor: "#5E94FB",
    borderWidth: 1,
    borderColor: "#CDDDFC",
  },

  item: {
    padding: 7,
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
    borderRadius: 11,
    marginBottom: 7,
    borderBottomWidth: 1,
    borderColor: "white",
    borderBottomEndRadius: 80,
    borderBottomStartRadius: 80,
  },

  textItem: {
    flex: 1,
    fontSize: 18,
    color: "white",
    fontFamily: "f1",
  },
});
