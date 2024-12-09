import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Button,
  Text,
  View,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  ScrollView,
  Pressable,
  Dimensions,
  Animated,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import ImageOverlay from "react-native-overlay-image";
import { Dropdown } from "react-native-element-dropdown";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function SaveSkil() {
  const params = useLocalSearchParams();
  const [loaded, error] = useFonts({
    f1: require("../assets/fonts/f1.ttf"),
    f2: require("../assets/fonts/f2.ttf"),
    f3: require("../assets/fonts/f3.ttf"),
    f4: require("../assets/fonts/f4.ttf"),
  });

  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [getAboutText, setAboutText] = useState("");

  const [loading, setLoading] = useState(false);
  const [btnText, setBtnText] = useState("Submit");

  const [profilePic, setProfilePic] = useState(null);
  const [getCoverPic, setCoverPic] = useState(null);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [value2, setValue2] = useState(null);
  const [getUser, setUser] = useState(null);
  const [getImageStatus, setImageStatus] = useState(null);

  async function loadUser() {
    const user = JSON.parse(params.user);
    setUser(user);
    console.log(user);
    setImageStatus(JSON.parse(params.imageStatus));
  }

  async function loadData(id) {
    let response;
    if (id == null) {
      response = await fetch(
        "http://172.20.10.5:8080/NativeSound/loadSkillsData"
      );
    } else {
      response = await fetch(
        "http://172.20.10.5:8080/NativeSound/loadSkillsData?id=" + id
      );
    }

    if (response.ok) {
      let json = await response.json();
      if (id == null) {
        setData2(json);
      } else {
        setData(json);
      }
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    loadData(null);
  }, []);

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === value && (
          <AntDesignIcon
            style={styles.icon}
            color="black"
            name="Safety"
            size={22}
          />
        )}
      </View>
    );
  };

  const renderItem2 = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === value2 && (
          <AntDesignIcon
            style={styles.icon}
            color="black"
            name="Safety"
            size={22}
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.main}>
      <ScrollView
        automaticallyAdjustKeyboardInsets={true}
        style={{ width: screenWidth }}
      >
        <Pressable
          style={styles.header}
          activeOpacity={0.8}
          onPress={async () => {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled) {
              setCoverPic(result.assets[0].uri);
            }
          }}
        >
          {getCoverPic !== null ? (
            <Image source={getCoverPic} style={styles.coverPic} />
          ) : (
            <Text style={styles.text1}>Add cover Photo</Text>
          )}
        </Pressable>

        {getImageStatus == "Image found" ? (
          <Image
            style={styles.profilePicView}
            source={
              "http://172.20.10.5:8080/NativeSound/profile-images/" +
              getUser.id +
              ".png"
            }
          />
        ) : (
          <View style={styles.profilePicView}>
            <Text style={styles.profileText}>
              {getUser != null
                ? getUser.firstName.charAt(0) + "" + getUser.lastName.charAt(0)
                : null}
            </Text>
          </View>
        )}

        <View style={styles.body}>
          <View style={styles.inputView1}>
            <View style={styles.textView}>
              <Text style={styles.text2}>Industry</Text>
            </View>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={data2}
              search
              maxHeight={260}
              labelField="label"
              valueField="value"
              placeholder="Select"
              searchPlaceholder="Search..."
              value={value2}
              containerStyle={styles.con}
              activeColor={"#2f374d"}
              onChange={(item) => {
                setValue2(item.value);
                loadData(item.value);
                setValue(null);
              }}
              renderLeftIcon={() => (
                <AntDesignIcon
                  style={styles.icon}
                  color="#c8d6fa"
                  name="Safety"
                  size={22}
                />
              )}
              renderItem={renderItem2}
            />
          </View>

          <View style={styles.inputView1}>
            <View style={styles.textView}>
              <Text style={styles.text2}>Skil</Text>
            </View>

            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={data}
              search
              maxHeight={260}
              labelField="label"
              valueField="value"
              placeholder={"Skills"}
              searchPlaceholder={
                value2 == null ? "Choose industry first !" : "Search skills"
              }
              value={value}
              containerStyle={styles.con}
              activeColor={"#2f374d"}
              onChange={(item) => {
                setValue(item.value);
              }}
              renderLeftIcon={() => (
                <FontAwesome style={styles.icon} name="fire" size={20} />
              )}
              renderItem={renderItem}
            />
          </View>

          <View style={styles.inputView1}>
            <View style={styles.textView}>
              <Text style={styles.text2}>About</Text>
            </View>
            <TextInput
              style={styles.Input2}
              placeholderTextColor={"#c8d6fa"}
              multiline={true}
              cursorColor={"#5182EF"}
              numberOfLines={6}
              onChangeText={setAboutText}
            />
          </View>
        </View>

        <View style={styles.btnView}>
          <Pressable
            style={styles.submitBtn}
            activeOpacity={0.7}
            onPress={async () => {
              const formData = new FormData();
              formData.append("user_id", getUser.id);
              if (getCoverPic != null) {
                formData.append("image", {
                  name: "",
                  uri: getCoverPic,
                  type: "image/png",
                });
              }
              formData.append("skillId", value);
              formData.append("about", getAboutText);
              const response = await fetch(
                "http://172.20.10.5:8080/NativeSound/SaveSkill",
                {
                  method: "POST",
                  body: formData,
                }
              );

              if (response.ok) {
                const json = await response.json();
                if (json.success) {
                  router.replace("/home");
                } else {
                  Alert.alert("Alert", json.message);
                }
              }
            }}
          >
            <Text style={styles.submitText}>Join</Text>
          </Pressable>
        </View>
      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#0a1724",
  },

  header: {
    width: "100%",
    backgroundColor: "#202738",
    height: 155,
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
  },

  text1: {
    color: "#c8d6fa",
    fontSize: 21,
    fontFamily: "f1",
    marginEnd: 28,
  },

  profilePicView: {
    width: 116,
    height: 116,
    borderRadius: 63,
    backgroundColor: "#c8d6fa",
    marginStart: 70,
    marginTop: 98,
    justifyContent: "center",
    alignItems: "center",
  },

  profilePic: {
    width: "100%",
    height: "100%",
    borderRadius: 63,
  },

  profileText: {
    fontSize: 30,
    color: "#5182EF",
  },

  zoomedImg: {
    borderRadius: 7,
  },

  coverPic: {
    borderRadius: 0,
    width: "100%",
    height: 155,
  },

  zoomedCoverPic: {
    width: screenWidth,
    borderRadius: 0,
  },

  body: {
    paddingVertical: 20,
    width: "92%",
    backgroundColor: "#0a1724",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#5182EF",
    rowGap: 20,
    alignSelf: "center",
    borderRadius: 14,
  },

  inputView1: {
    rowGap: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  textView: {
    width: "80%",
    paddingStart: 5,
  },

  text2: {
    fontSize: 20,
    color: "#5182EF",
    fontFamily: "f1",
  },

  Input1: {
    width: "80%",
    height: 56,
    borderRadius: 11,
    padding: 7,
    backgroundColor: "#2f374d",
    color: "white",
    fontSize: 19,
    paddingStart: 15,
  },

  dropdown: {
    width: "85%",
    height: 58,
    backgroundColor: "#2f374d",
    borderRadius: 11,
    padding: 12,
  },
  icon: {
    marginRight: 5,
    color: "white",
  },

  con: {
    borderRadius: 11,
    paddingHorizontal: 7,
    backgroundColor: "#2f374d",
    borderWidth: 0,
  },

  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "black",
    marginVertical: 5,
    borderRadius: 11,
  },
  textItem: {
    flex: 1,
    fontSize: 18,
    color: "#c8d6fa",
    fontFamily: "f1",
  },
  placeholderStyle: {
    fontSize: 18,
    color: "#c8d6fa",
    fontFamily: "f1",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#c8d6fa",
    fontFamily: "f1",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 45,
    fontSize: 16,
    backgroundColor: "#0D1117",
    borderRadius: 11,
    borderWidth: 0,
    color: "#c8d6fa",
  },

  Input2: {
    width: "85%",
    height: 128,
    borderRadius: 11,
    padding: 7,
    backgroundColor: "#2f374d",
    color: "white",
    fontSize: 19,
    paddingStart: 15,
    justifyContent: "center",
    textAlignVertical: "top",
  },

  btnView: {
    paddingVertical: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  submitBtn: {
    backgroundColor: "#5182EF",
    paddingVertical: 12,
    width: "85%",
    borderRadius: 11,
    alignItems: "center",
  },

  submitText: {
    fontSize: 22,
    color: "black",
    fontFamily: "f1",
  },
});
