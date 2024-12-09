import { SafeAreaView } from "react-native-safe-area-context";
import {
  Appearance,
  StyleSheet,
  View,
  Text,
  Alert,
  TextInput,
  Pressable,
  ScrollView,
  Button,
  Modal,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import {
  Feather,
  FontAwesome,
  Ionicons,
  SimpleLineIcons,
  Zocial,
} from "@expo/vector-icons";
import { router, useFocusEffect, useNavigation } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import AnimatedSearchBox from "@ocean28799/react-native-animated-searchbox";
import { BlurView } from "expo-blur";

export default function home() {
  const [getUserChatArray, setUserChatArray] = useState([]);
  const [getUsersArray, setUsersArray] = useState([]);
  const [getUser, setUser] = useState([]);
  const [getItem, setItem] = useState({});

  const [message, setMessage] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [pressed, setPressed] = useState(false);
  const [requestFilter, setRequestFilter] = useState(false);
  const [opened, setOpened] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [getPassword, setPassword] = useState("");

  const [inChat, setInChat] = useState(true);
  const [inPeople, setInPeople] = useState(false);
  const [inSetting, setInSetting] = useState(false);

  const intervalIdRef = useRef(null);

  const [intervalCheck, setIntervalCheck] = useState(false);
  const [loaded, error] = useFonts({
    f1: require("../assets/fonts/f1.ttf"),
    f2: require("../assets/fonts/f2.ttf"),
    f3: require("../assets/fonts/f3.ttf"),
    f4: require("../assets/fonts/f4.ttf"),
  });

  const refSearchBox = useRef();
  const openSearchBox = () => refSearchBox.current.open();
  const closeSearchBox = () => refSearchBox.current.close();

  useEffect(() => {
    async function loadUserChats() {
      const userJson = await AsyncStorage.getItem("user");
      const user = JSON.parse(userJson);
      setUser(user);
      const response = await fetch(
        "http://172.20.10.5:8080/NativeSound/LoadHomeData2?id=" + user.id
      );
      const json = await response.json();
      const chatArray = json.jsonChatArray;
      if (pressed) {
        setUserChatArray(json.filteredArray1);
      } else if (inPeople) {
        setUserChatArray(json.jsonUsersArray);
      } else if (requestFilter) {
        let updatedArray = [];
        chatArray.forEach((element) => {
          if (
            element.chat_status == "received" &&
            element.chat_status_id == 3
          ) {
            updatedArray.push(element);
          }
        });
        setUserChatArray(updatedArray);
      } else {
        setUserChatArray(chatArray);
      }
    }
    loadUserChats();

    if (intervalCheck) {
      let id = setInterval(loadUserChats, 5000);
      intervalIdRef.current = id;
      setIntervalCheck(false);
    }
  }, [pressed, requestFilter, inPeople, intervalCheck]);

  useEffect(() => {
    if (pressed) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
      setIntervalCheck(false);
    } else if (requestFilter) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
      setIntervalCheck(false);
    } else if (opened) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
      setIntervalCheck(false);
    } else {
      setIntervalCheck(true);
    }
  }, [pressed, requestFilter, opened]);

  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <View style={styles.headerChild}>
          {!opened ? (
            <View style={styles.headerChildSub}>
              {!inPeople ? (
                <AntDesign name="twitter" size={28} color="white" />
              ) : (
                <Ionicons name="people" size={28} color="white" />
              )}
              <Text style={styles.headerChildText}>
                {!inPeople ? "Chats" : "People"}
              </Text>
            </View>
          ) : null}
          <View style={opened ? styles.headerChildView1 : null}>
            <AnimatedSearchBox
              ref={(ref) => (refSearchBox.current = ref)}
              placeholder={"Search"}
              placeholderTextColor="#848484"
              backgroundColor="#f6f6f7"
              searchIconColor={opened ? "black" : "white"}
              focusAfterOpened
              searchIconSize={24}
              borderRadius={14}
              animationSpeed={[150, 200]}
              onOpening={() => {
                setOpened(true);
              }}
              onClosed={() => {
                setOpened(false);
              }}
              onChangeText={async (text) => {
                const response = await fetch(
                  "http://172.20.10.5:8080/NativeSound/LoadHomeData2?id=" +
                    getUser.id +
                    "&searchText=" +
                    text
                );
                const json = await response.json();
                if (!inPeople) {
                  if (json.jsonChatArray.length > 0) {
                    setUserChatArray(json.jsonChatArray);
                  } else {
                    setUserChatArray(json.jsonUsersArray);
                  }
                } else {
                  setUserChatArray(json.jsonUsersArray);
                }
              }}
              onBlur={() => closeSearchBox()}
            />
          </View>
        </View>
        {!inPeople ? (
          <View style={styles.headerChild2}>
            <Pressable
              onPress={() => {
                setRequestFilter(!requestFilter);
              }}
              style={
                !requestFilter
                  ? [styles.requestView, styles.requestView2]
                  : [styles.requestView, styles.filledRequestView]
              }
            >
              <Text
                style={
                  !requestFilter
                    ? [styles.requestText, styles.requestText2]
                    : [styles.requestText, styles.filledRequestViewText]
                }
              >
                Requests
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                if (pressed) {
                  setPressed(false);
                } else {
                  setPressed(true);
                }
              }}
            >
              <Ionicons
                name={pressed ? "filter-circle" : "filter-circle-outline"}
                size={32}
                color="white"
                style={{ marginEnd: 9 }}
              />
            </Pressable>
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalMain}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Enter Password</Text>

              <TextInput
                style={styles.modalTextInput}
                secureTextEntry={true}
                onChangeText={(text) => {
                  setPassword(text);
                }}
              />

              <View style={styles.modalView2}>
                <Pressable
                  style={styles.modalBtn1}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.modalText}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={styles.modalBtn2}
                  onPress={() => {
                    if (getUser.password == getPassword) {
                      router.push({
                        pathname: "chatinbox",
                        params: {
                          item: JSON.stringify(getItem),
                          user: JSON.stringify(getUser),
                        },
                      });
                      setModalVisible(!modalVisible);
                    } else {
                      setModalVisible(!modalVisible);
                    }
                  }}
                >
                  <Text style={styles.modalText}>Go</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <FlashList
          data={getUserChatArray}
          estimatedItemSize={300}
          renderItem={({ item }) => (
            <Pressable
              style={styles.userChatView}
              onPress={() => {
                if (item.lock != 1) {
                  router.push({
                    pathname: "chatinbox",
                    params: {
                      item: JSON.stringify(item),
                      user: JSON.stringify(getUser),
                    },
                  });
                } else {
                  setItem(item);
                  setModalVisible(true);
                }
              }}
            >
              <View style={styles.userChatImageView}>
                {item.image_found ? (
                  <Image
                    source={
                      `http://172.20.10.5:8080/NativeSound/profile-images/` +
                      item.other_user_id +
                      `.png?timestamp=${new Date().getTime()}`
                    }
                    style={styles.image1}
                  />
                ) : (
                  <Text style={styles.nameLatter}>{item.name_latters}</Text>
                )}
                {item.other_user_status == 1 ? (
                  <View style={styles.onlineMark}></View>
                ) : null}
              </View>

              <View style={styles.userChatSubView}>
                {item.skill != undefined && inPeople ? (
                  <View style={styles.skillView}>
                    <Text style={styles.skillText}>{item.skill}</Text>
                  </View>
                ) : null}
                <View style={styles.nameView}>
                  <Text
                    style={
                      item.chat_status_id != 3 && item.chat_status == "sent"
                        ? styles.userChatName
                        : styles.requestUserName
                    }
                    numberOfLines={1}
                  >
                    {item.other_user_name}
                  </Text>
                  {item.chat_status_id == 3 &&
                  item.chat_status != "sent" &&
                  !inPeople ? (
                    <View style={styles.requestView}>
                      <Text style={styles.requestText}>Request</Text>
                    </View>
                  ) : null}
                </View>

                <View style={styles.userChatSubView2}>
                  <Text numberOfLines={1} style={styles.messageText}>
                    {inPeople && item.chatted
                      ? "Start conversation..👋"
                      : item.message}
                  </Text>
                  {item.chat_status == "sent" ? (
                    <Entypo
                      name={
                        item.chat_status_id == 2
                          ? "dots-three-horizontal"
                          : "dots-two-horizontal"
                      }
                      size={30}
                      color={item.chat_status_id == 2 ? "#6EC207" : "#B17457"}
                    />
                  ) : (
                    <View
                      style={
                        item.chat_status_id == 1 && !inPeople
                          ? styles.unseenView
                          : null
                      }
                    >
                      {item.unseen_chat_count > 0 ? (
                        <Text style={styles.unseenViewText}>
                          {item.unseen_chat_count}
                        </Text>
                      ) : null}
                    </View>
                  )}
                </View>

                <Text style={styles.dateTimeText}>{item.date_time}</Text>
              </View>
            </Pressable>
          )}
        />
      </View>

      {/* Bottom Tab */}

      <View style={styles.bottom}>
        <View style={styles.bottomView1}>
          <Pressable
            style={styles.bottomView2}
            onPress={() => {
              clearInterval(intervalIdRef.current);
              intervalIdRef.current = null;
              setIntervalCheck(true);
              setInChat(true);
              setInPeople(false);
              setInSetting(false);
            }}
          >
            {inChat ? (
              <Ionicons name="chatbubbles" size={26} color="#5E94FB" />
            ) : (
              <Ionicons name="chatbubbles-outline" size={26} color="#5E94FB" />
            )}
            <Text>Chats</Text>
          </Pressable>

          <Pressable
            style={styles.bottomView2}
            onPress={() => {
              clearInterval(intervalIdRef.current);
              intervalIdRef.current = null;
              setInChat(false);
              setInPeople(true);
              setInSetting(false);
            }}
          >
            {inPeople ? (
              <Ionicons name="people" size={26} color="#5E94FB" />
            ) : (
              <Ionicons name="people-outline" size={26} color="#5E94FB" />
            )}

            <Text>People</Text>
          </Pressable>

          <Pressable
            style={styles.bottomView2}
            onPress={() => {
              clearInterval(intervalIdRef.current);
              intervalIdRef.current = null;
              setInChat(false);
              setInPeople(false);
              setInSetting(true);
              router.replace({
                pathname: "/setting",
                params: {
                  user: JSON.stringify(getUser),
                },
              });
            }}
          >
            {inSetting ? (
              <Ionicons name="settings" size={26} color="#5E94FB" />
            ) : (
              <Ionicons name="settings-outline" size={26} color="#5E94FB" />
            )}
            <Text>Setting</Text>
          </Pressable>
        </View>
      </View>

      <StatusBar style="light" hidden={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#5E94FB",
    // paddingTop:25,
  },

  header: {
    paddingTop: 7,
    paddingBottom: 16,
    backgroundColor: "#5E94FB",
    paddingTop: 50,
  },

  headerChild: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 26,
  },

  headerChildSub: {
    flexDirection: "row",
    columnGap: 10,
    alignItems: "center",
  },

  headerChildText: {
    color: "white",
    fontSize: 30,
    fontFamily: "f3",
  },

  headerChildView1: {
    width: "100%",
  },

  headerChild2: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 26,
    alignItems: "center",
  },

  body: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 8,
    paddingHorizontal: 14,
    borderTopStartRadius: 26,
    borderTopEndRadius: 26,
  },

  bottom: {
    backgroundColor: "white",
    paddingBottom: 25,
    paddingTop: 12,
    paddingHorizontal: 14,
    alignItems: "center",
  },

  bottomView1: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    paddingBottom: 6,
  },

  bottomView2: {
    alignItems: "center",
    rowGap: 4,
  },

  view1: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
  },

  input1: {
    width: "60%",
    backgroundColor: "#CDDDFC",
    borderColor: "#5E94FB",
    padding: 7,
    borderRadius: 14,
    color: "black",
    fontSize: 16,
    borderWidth: 1,
  },

  inboxView: {
    backgroundColor: "royalblue",
    height: 30,
    padding: 30,
  },
  msgView: {
    backgroundColor: "lightgray",
    padding: 14,
    paddingStart: 30,
  },

  btn1: {
    paddingHorizontal: 14,
    padding: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "lightgray",
  },

  userChatView: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 7,
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
    marginTop: 14,
  },

  userChatImageView: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#CDDDFC",
    borderWidth: 1,
    borderColor: "#5E94FB",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },

  onlineMark: {
    width: 20,
    height: 20,
    backgroundColor: "#6EC207",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
    position: "absolute",
    bottom: 0,
    right: 0,
  },

  userChatSubView: {
    paddingStart: 12,
    width: "70%",
  },

  userChatSubView1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  userChatSubView2: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  messageText: {
    width: "90%",
    fontSize: 17,
  },

  image1: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignSelf: "center",
  },

  unseenView: {
    backgroundColor: "#5E94FB",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  unseenViewText: {
    color: "white",
    fontSize: 12,
  },

  userChatName: {
    fontSize: 20,
    fontFamily: "f3",
  },

  requestUserName: {
    fontSize: 20,
    fontFamily: "f3",
    width: 180,
  },

  nameView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  requestView: {
    paddingHorizontal: 7,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#5E94FB",
  },

  requestView2: {
    paddingHorizontal: 10,
    marginStart: 14,
    borderColor: "white",
  },

  filledRequestView: {
    paddingHorizontal: 10,
    marginStart: 14,
    backgroundColor: "white",
  },

  requestText: {
    color: "#5E94FB",
    fontFamily: "f4",
  },

  filledRequestViewText: {
    color: "#5E94FB",
    fontSize: 17,
  },

  requestText2: {
    color: "white",
    fontSize: 17,
  },

  skillView: {
    paddingHorizontal: 7,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#6EC207",
    alignSelf: "flex-start",
    paddingBottom: 2,
  },

  skillText: {
    color: "#6EC207",
    fontFamily: "f4",
  },

  nameLatter: {
    fontSize: 28,
    fontFamily: "f3",
    color: "#5E94FB",
  },

  dateTimeText: {
    fontSize: 14,
    color: "gray",
    alignSelf: "flex-end",
  },

  modalMain: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    rowGap: 7,
  },

  modalTextInput: {
    width: 250,
    borderRadius: 20,
    backgroundColor: "#e6e6e6",
    borderWidth: 1,
    borderColor: "gray",
    padding: 14,
    paddingVertical: 8,
    fontSize: 16,
  },

  modalText: {
    fontSize: 16,
    fontFamily: "f3",
  },

  modalView2: {
    flexDirection: "row",
    columnGap: 6,
    width: 250,
    justifyContent: "space-between",
    marginTop: 6,
  },

  modalBtn1: {
    borderRadius: 20,
    padding: 5,
    backgroundColor: "#ffd5d5",
    borderWidth: 1,
    borderColor: "#f15e5e",
    width: 110,
    alignItems: "center",
  },

  modalBtn2: {
    borderRadius: 20,
    padding: 5,
    width: 110,
    alignItems: "center",
    backgroundColor: "#d5e3ff",
    borderWidth: 1,
    borderColor: "#165df0",
  },
});
