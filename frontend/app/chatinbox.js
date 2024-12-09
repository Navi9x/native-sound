import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
  useSearchParams,
} from "expo-router";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import AntDesign from "@expo/vector-icons/AntDesign";
import { StatusBar } from "expo-status-bar";
import { Entypo } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";

export default function chatinbox() {
  const params = useLocalSearchParams();
  const [getUser, setUser] = useState({});
  const [getItem, setItem] = useState({});
  const [getChatArray, setChatArray] = useState([]);
  const [getMessage, setMessage] = useState("");
  const [getSelected, setSelect] = useState(false);
  const [getUpdate, setUpdate] = useState(false);

  const flashListRef = useRef(null);
  const chatArrayLengthRef = useRef(null);

  const navigation = useNavigation();
  let chatInboxIntervalId = null;

  useEffect(() => {
    async function loadChat() {
      const user = JSON.parse(params.user);
      const item = JSON.parse(params.item);
      setUser(user);
      setItem(item);
      console.log(item);

      const response = await fetch(
        "http://172.20.10.5:8080/NativeSound/LoadChat?logged_user_id=" +
          user.id +
          "&other_user_id=" +
          item.other_user_id
      );
      if (response.ok) {
        const json = await response.json();
        if (json.success) {
          const chatArray = json.object;
          // setChatArray(chatArray);
          if (item.translate != 1) {
            setChatArray(chatArray);
          } else {
            for (let item of chatArray) {
              if (item.received) {
                item.message = await translation(
                  item.message,
                  user.languages.name,
                  item.other_user_language_code
                );
              }
            }
            setChatArray(chatArray);
          }
        }
      }
    }
    loadChat();
    chatInboxIntervalId = setInterval(loadChat, 2500);
  }, []);

  useEffect(() => {
    if (flashListRef.current && getChatArray.length > 0) {
      if (chatArrayLengthRef.current != getChatArray.length) {
        setTimeout(() => {
          flashListRef.current.scrollToEnd({ animated: true });
        }, 300);
        chatArrayLengthRef.current = getChatArray.length;
      }
    }
  }, [getChatArray]);

  useEffect(() => {
    function routing() {
      navigation.addListener("beforeRemove", (e) => {
        if (chatInboxIntervalId) {
          clearInterval(chatInboxIntervalId);
        }
      });
    }
    routing();
  }, [navigation]);


  const translation = async (translateText, lang,fromLang) => {
    const url = 'https://google-api-unlimited.p.rapidapi.com/translate';
    const data = new FormData();
    data.append('texte', translateText);
    data.append('to_lang', lang);
    
    const options = {
      method: 'POST',
      headers: {
        'x-rapidapi-key': 'c583048d1emsh8ebb62f4b8aba9ap133573jsn93ec8a9fdacd',
        'x-rapidapi-host': 'google-api-unlimited.p.rapidapi.com'
      },
      body: data
    };
    
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      return result.result.translation;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <View style={styles.headerChild}>
          <Pressable
            onPress={() => {
              router.back();
            }}
          >
            <AntDesign name="leftcircleo" size={20} color="white" />
          </Pressable>
          <Pressable
            onPress={() => {
              router.push({
                pathname: "profile",
                params: {
                  user: JSON.stringify(getUser),
                  other_user: JSON.stringify(getItem),
                },
              });
            }}
          >
            <Text style={styles.headerText} numberOfLines={1}>
              {getItem.other_user_name}
            </Text>
            {getItem.other_user_status == 1 ? (
              <Text style={styles.headerOnlineText}>Online</Text>
            ) : (
              <Text style={styles.headerOnlineText}>Offline</Text>
            )}
          </Pressable>
          {getItem.image_found ? (
            <Image
              source={
                `http://172.20.10.5:8080/NativeSound/profile-images/` +
                getItem.other_user_id +
                `.png?timestamp=${new Date().getTime()}`
              }
              style={styles.image1}
            />
          ) : (
            <View style={styles.userChatImageView}>
              <Text style={{ color: "#5E94FB" }}>{getItem.name_latters}</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.view1}>
        {getItem.chat_status_id == 3 &&
        !getUpdate &&
        getItem.chat_status != "sent" ? (
          <View style={styles.requestView}>
            <Pressable
              style={styles.blockBtn}
              onPress={async () => {
                const response = await fetch(
                  "http://172.20.10.5:8080/NativeSound/UpdateChat?logged_user_id=" +
                    getUser.id +
                    "&other_user_id=" +
                    getItem.other_user_id +
                    "&update_status=4"
                );
                if (response.ok) {
                  const json = await response.json();
                  if (json.success) {
                    setUpdate(true);
                  } else {
                    Alert.alert(
                      "Sorry can't proccess your request in this time"
                    );
                  }
                }
              }}
            >
              <Text style={styles.blockText}>Block</Text>
            </Pressable>
            <Pressable
              style={styles.acceptBtn}
              onPress={async () => {
                const response = await fetch(
                  "http://172.20.10.5:8080/NativeSound/UpdateChat?logged_user_id=" +
                    getUser.id +
                    "&other_user_id=" +
                    getItem.other_user_id +
                    "&update_status=2"
                );
                if (response.ok) {
                  const json = await response.json();
                  if (json.success) {
                    setUpdate(true);
                  } else {
                    Alert.alert(
                      "Sorry can't proccess your request in this time"
                    );
                  }
                }
              }}
            >
              <Text style={styles.acceptText}>Accept</Text>
            </Pressable>
          </View>
        ) : null}

        <FlashList
          ref={flashListRef}
          data={getChatArray}
          estimatedItemSize={300}
          renderItem={({ item }) => (
            <View style={styles.msgBoxView1}>
              {item.received ? (
                <View style={styles.msgBox2}>
                  {getItem.translate != 1 ? (
                    <Text style={styles.receivedText}>{item.message}</Text>
                  ) : (
                    //Translating message
                    <Text style={styles.receivedText}>{item.message}</Text>
                  )}
                  <Text style={styles.timeText2}>{item.date_time}</Text>
                </View>
              ) : (
                <Pressable
                  onLongPress={() => setSelect(true)}
                  style={getSelected ? null : styles.msgBox1View}
                >
                  <View style={styles.msgBox1}>
                    <Text style={styles.sendText}>{item.message}</Text>
                    <Text style={styles.timeText1}>{item.date_time}</Text>
                  </View>
                  <AntDesign
                    style={styles.icon1}
                    name="checkcircle"
                    size={16}
                    color={item.status == 2 ? "#6EC207" : "#c3c3c3"}
                  />
                </Pressable>
              )}
            </View>
          )}
        />
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100}>
          <View style={styles.view2}>
            <TextInput
              style={styles.input1}
              value={getMessage}
              onChangeText={(text) => {
                setMessage(text);
              }}
              multiline={true}
            />
            <Pressable
              onPress={async () => {
                const response = await fetch(
                  "http://172.20.10.5:8080/NativeSound/SendMessage?from_user_id=" +
                    getUser.id +
                    "&to_user_id=" +
                    getItem.other_user_id +
                    "&message=" +
                    getMessage
                );
                if (response.ok) {
                  const json = await response.json();
                  if (json.success) {
                    setMessage("");
                  } else if (json.message == "pending") {
                    Alert.alert("Alert", "Wait until user accept");
                  } else if (json.message == "blocked") {
                    Alert.alert("Alert", "Blocked can't send message");
                  }
                }
              }}
            >
              {getMessage.trim().length != 0 ? (
                <AntDesign name="upcircle" size={26} color="#5E94FB" />
              ) : null}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>

      <StatusBar style="light" hidden={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#5E94FB",
    paddingTop: 45,
  },

  header: {
    paddingHorizontal: 16,
    backgroundColor: "#5E94FB",
    justifyContent: "center",
    paddingBottom: 6,
  },

  headerChild: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerText: {
    color: "white",
    fontSize: 20,
    fontFamily: "f3",
    marginStart: 20,
    textAlign: "center",
    width: 270,
  },

  headerOnlineText: {
    color: "white",
    fontSize: 15,
    fontFamily: "f3",
    marginStart: 20,
    textAlign: "center",
  },

  userChatImageView: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#CDDDFC",
    borderWidth: 1,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },

  image1: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  view1: {
    flex: 1,
    backgroundColor: "white",
    // paddingTop: 12,
    // paddingHorizontal: 7,
    rowGap: 12,
    paddingBottom: 20,
  },

  requestView: {
    flexDirection: "row",
  },

  blockBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fccdcd",
  },

  acceptBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#cefccd",
  },

  blockText: {
    fontSize: 18,
    color: "#f50000",
  },

  acceptText: {
    fontSize: 18,
    color: "#059e02",
  },

  view2: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 7,
    paddingBottom: 2,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 6,
    backgroundColor: "white",
    paddingBottom: 15,
  },

  input1: {
    width: "90%",
    backgroundColor: "#CDDDFC",
    borderColor: "#5E94FB",
    padding: 8,
    borderRadius: 14,
    color: "black",
    fontSize: 18,
    borderWidth: 1,
  },

  icon1: {
    alignSelf: "flex-end",
    marginTop: 2,
    marginEnd: 10,
  },

  msgBox1View: {
    // backgroundColor: "lightgray",
  },

  msgBox1: {
    padding: 18,
    paddingBottom: 8,
    justifyContent: "center",
    borderRadius: 38,
    borderEndEndRadius: 0,
    backgroundColor: "#5E94FB",
    alignSelf: "flex-end",
    rowGap: 3,
    maxWidth: "70%",
    marginTop: 7,
    marginEnd: 10,
  },

  sendText: {
    color: "white",
    fontSize: 16,
  },

  msgBoxView1: {
    marginBottom: 10,
    // paddingHorizontal:10,
  },

  msgBox2: {
    padding: 18,
    paddingBottom: 8,
    justifyContent: "center",
    borderRadius: 38,
    borderBottomStartRadius: 0,
    backgroundColor: "lightgray",
    alignSelf: "flex-start",
    rowGap: 3,
    maxWidth: "70%",
    marginStart: 10,
    marginTop: 7,
    marginBottom: 8,
  },

  receivedText: {
    color: "black",
    fontSize: 16,
  },

  timeText1: {
    color: "white",
    textAlign: "right",
  },

  timeText2: {
    color: "black",
  },
});
