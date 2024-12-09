import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Switch, Alert, Pressable } from "react-native";
import { isEnabled } from "react-native/Libraries/Performance/Systrace";

export default function profile() {
  const params = useLocalSearchParams();
  const [getUser, setUser] = useState("");
  const [getOtherUser, setOtherUser] = useState("");

  const [isTranslate, setTranslate] = useState(false);
  const toggleSwitch = () => setTranslate((previousState) => !previousState);

  const [isLock, setLock] = useState(false);
  const toggleSwitch2 = () => setLock((previousState) => !previousState);

  const [isBlock, setBlock] = useState(false);
  const toggleSwitch3 = () => setBlock((previousState) => !previousState);

  const [loaded, error] = useFonts({
    f1: require("../assets/fonts/f1.ttf"),
    f2: require("../assets/fonts/f2.ttf"),
    f3: require("../assets/fonts/f3.ttf"),
    f4: require("../assets/fonts/f4.ttf"),
  });

  useEffect(() => {
    function loadData() {
      const user = JSON.parse(params.user);
      const other_user = JSON.parse(params.other_user);
      setUser(user);
      setOtherUser(other_user);

      if(other_user.chat_status_id==4&& other_user.chat_status == "received"){
        setBlock(true);
      }

      if(other_user.lock == 1){
        setLock(true);
      }

      if(other_user.translate == 1){
        setTranslate(true)
      }
    }
    loadData();
  }, []);
  return (
    <View style={styles.main}>
      <View style={styles.imageView}>
        {getOtherUser != null ? (
          getOtherUser.image_found ? (
            <Image
              source={
                "http://172.20.10.5:8080/NativeSound/profile-images/" +
                getOtherUser.other_user_id +
                ".png"
              }
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileLatterView}>
              <Text style={styles.text4}>{getOtherUser.name_latters}</Text>
            </View>
          )
        ) : null}
      </View>

      <View style={styles.onlineView}>
        <View
          style={
            getUser != null && getOtherUser.other_user_status == 1
              ? styles.onlineSubView
              : styles.offlineSubView
          }
        >
          {
            getOtherUser.other_user_status == 1 ? (
              <Text style={styles.text1}>Online</Text>
            ) : (
              <Text style={styles.text1}>Offline</Text>
            )
          }
        </View>
      </View>

      <View style={styles.bodyView}>
        <View style={styles.view1}>
          <Text style={styles.text1}>Name :</Text>
          <Text style={styles.text2}>
            {getOtherUser.other_user_name}
          </Text>
        </View>

        <View style={styles.view1}>
          <Text style={styles.text1}>Mobile :</Text>
          <Text style={styles.text2}>
            {getOtherUser.other_user_mobile}
          </Text>
        </View>

        <View style={styles.view1}>
          <Text style={styles.text1}>Language :</Text>
          <Text style={styles.text2}>
            {getOtherUser.other_user_language}
          </Text>
        </View>

        <View style={styles.view2}>
          <View style={styles.view2Sub}>
            <Text style={styles.text1}>Translate Messages </Text>
            <Switch
              trackColor={{ false: "#767577", true: "#1ac9bf" }}
              thumbColor={isTranslate ? "#c7fffc" : "#f4f3f4"}
              ios_backgroundColor="lightgray"
              onValueChange={toggleSwitch}
              value={isTranslate}
            />
          </View>
        </View>

        <View style={styles.view2}>
          <View style={styles.view2Sub}>
            <Text style={styles.text1}>Lock Chat </Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isLock ? "#d7e2ff" : "#f4f3f4"}
              ios_backgroundColor="lightgray"
              onValueChange={toggleSwitch2}
              value={isLock}
            />
          </View>
        </View>

        <View style={styles.view2}>
          <View style={styles.view2Sub}>
            <Text style={styles.text1}>Block </Text>
            <Switch
              trackColor={{ false: "#767577", true: "#f15e5e" }}
              thumbColor={isBlock ? "#ffd5d5" : "#f4f3f4"}
              ios_backgroundColor="lightgray"
              onValueChange={toggleSwitch3}
              value={isBlock}
            />
          </View>
        </View>

        <Pressable
          style={styles.saveBtn}
          onPress={async () => {
            const response = await fetch(
              "http://172.20.10.5:8080/NativeSound/UpdateChatType?from_user_id=" +
                getUser.id +
                "&to_user_id=" +
                getOtherUser.other_user_id +
                "&translate=" +
                isTranslate +
                "&lock=" +
                isLock +
                "&block=" +
                isBlock
            );
          }}
        >
          <Text style={styles.text3}>Save</Text>
        </Pressable>
      </View>

      <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "white",
    rowGap: 12,
    justifyContent: "center",
  },

  imageView: {
    alignItems: "center",
  },

  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: "lightgray",
  },

  profileLatterView: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: "gray",
    backgroundColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
  },

  onlineView: {
    alignItems: "center",
    marginBottom: 14,
  },

  onlineSubView: {
    borderRadius: 20,
    backgroundColor: "#cefccd",
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignItems: "center",
  },

  offlineSubView: {
    borderRadius: 20,
    backgroundColor: "#fcd9cd",
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignItems: "center",
  },

  text1: {
    fontSize: 20,
    color: "black",
    fontFamily: "f1",
  },

  text2: {
    fontSize: 20,
    color: "black",
    fontFamily: "f1",
  },

  text3: {
    fontSize: 20,
    color: "white",
    fontFamily: "f1",
  },

  text4: {
    fontSize: 38,
    color: "black",
    fontFamily: "f1",
  },

  view1: {
    flexDirection: "row",
    columnGap: 7,
    justifyContent: "center",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderColor: "lightgray",
    marginBottom: 16,
    alignItems: "center",
  },

  view2: {
    marginTop: 7,
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 7,
    alignItems: "center",
  },

  view2Sub: {
    backgroundColor: "#e4e4e4",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: "row",
    columnGap: 6,
    width: "70%",
    alignItems: "center",
    justifyContent: "space-between",
  },

  saveBtn: {
    backgroundColor: "#5E94FB",
    paddingVertical: 12,
    width: "70%",
    borderRadius: 14,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 24,
  },
});
