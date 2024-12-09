import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import ImageOverlay from "react-native-overlay-image";

export default function setting() {
  const params = useLocalSearchParams();
  const [inChat, setInChat] = useState(false);
  const [inPeople, setInPeople] = useState(false);
  const [inSetting, setInSetting] = useState(true);
  const [getUser, setUser] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [checkingPW, setCheckingPW] = useState("");
  const [checked, setChecked] = useState(false);

  const [getMobile, setMobile] = useState("");
  const [getFirstName, setFirstName] = useState("");
  const [getLastName, setLastName] = useState("");
  const [getPassword, setPassword] = useState("");
  const [imageFound, setImageFound] = useState(false);
  const [getImage, setImage] = useState(null);
  const [saved, setSaved] = useState(false);


  useEffect(() => {
    function loadUser() {
      const user = JSON.parse(params.user);
      setUser(user);
      setMobile(user.mobile);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setPassword(user.password);
      console.log(params.intervalId);
      clearInterval(params.intervalId);
    }
    loadUser();
  }, []);

  useEffect(() => {
    async function checkImage() {
      const response = await fetch(
        "http://172.20.10.5:8080/NativeSound/CheckImage?id=" + getUser.id
      );
      if (response.ok) {
        const json = await response.json();
        if (json.Image_found) {
          setImageFound(json.Image_found);
        }
      }
    }
    checkImage();
  }, [getUser, saved]);

  return (
    <View style={styles.main}>
      <View style={styles.body}>
        {/* //Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalMain}>
            <View style={styles.modalView1}>
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  setImage(null);
                }}
              >
                <AntDesign
                  name="closecircle"
                  style={{ alignSelf: "flex-end" }}
                  size={26}
                  color="black"
                />
              </Pressable>
              <View style={styles.modalView2}>
                {imageFound ? (
                  getImage == null ? (
                    <Image
                      source={
                        `http://172.20.10.5:8080/NativeSound/profile-images/` +
                        getUser.id +
                        `.png?timestamp=${new Date().getTime()}`
                      }
                      style={styles.profileImage2}
                    />
                  ) : (
                    <Image source={getImage} style={styles.profileImage2} />
                  )
                ) : null}
                <Pressable
                  style={styles.imageUpdateBtn}
                  onPress={
                    getImage == null
                      ? async () => {
                          let result =
                            await ImagePicker.launchImageLibraryAsync({
                              mediaTypes: ImagePicker.MediaTypeOptions.Images,
                              allowsEditing: true,
                              quality: 1,
                            });

                          if (!result.canceled) {
                            setImage(result.assets[0].uri);
                            setImageFound(true);
                          }
                        }
                      : async function saveImage() {
                          let form = new FormData();
                          form.append("id", getUser.id);
                          form.append("image", {
                            name: "",
                            uri: getImage,
                            type: "image/png",
                          });
                          const response = await fetch(
                            "http://172.20.10.5:8080/NativeSound/UpdateUser",
                            {
                              method: "POST",
                              body: form,
                            }
                          );
                          if (response.ok) {
                            setModalVisible(false);
                            setImage(null);
                          }
                        }
                  }
                >
                  {getImage != null ? (
                    <Text style={styles.btnText1}>Save</Text>
                  ) : (
                    <Text style={styles.btnText1}>
                      {imageFound ? "Change" : "Upload Image"}
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal */}

        {/* Password modal */}

        {/* Password Modal */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible2}
          onRequestClose={() => {
            setModalVisible2(!modalVisible2);
          }}
        >
          <View style={styles.modalMain2}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Enter Password</Text>

              <TextInput
                style={styles.modalTextInput}
                secureTextEntry={true}
                onChangeText={(text) => {
                  setCheckingPW(text);
                }}
              />

              <View style={styles.modalView2_2}>
                <Pressable
                  style={styles.modalBtn1}
                  onPress={() => setModalVisible2(!modalVisible2)}
                >
                  <Text style={styles.modalText}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={styles.modalBtn2}
                  onPress={() => {
                    if (getUser.password == checkingPW) {
                      setChecked(!checked);
                      setModalVisible2(!modalVisible2);
                    } else {
                      setModalVisible2(!modalVisible2);
                    }
                  }}
                >
                  <Text style={styles.modalText}>Go</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Password modal */}

        <Pressable
          style={styles.imageView}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          {imageFound ? (
            <Image
              source={
                getImage == null
                  ? `http://172.20.10.5:8080/NativeSound/profile-images/` +
                    getUser.id +
                    `.png?timestamp=${new Date().getTime()}`
                  : getImage
              }
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileLatterView}>
              <Text style={styles.text4}>
                {getFirstName.charAt(0) + " " + getLastName.charAt(0)}
              </Text>
            </View>
          )}
        </Pressable>

        <View style={styles.fieldsView1}>
          <TextInput
            style={[styles.input1, styles.input2]}
            value={getFirstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={[styles.input1, styles.input2]}
            value={getLastName}
            onChangeText={setLastName}
          />

          <TextInput
            style={[styles.input1, styles.input2]}
            value={getMobile}
            onChangeText={setMobile}
          />
          <View style={styles.inputView}>
            <TextInput
              style={[styles.input1, styles.input2]}
              value={getPassword}
              secureTextEntry={passwordVisible ? false : true}
              onChangeText={setPassword}
              editable={!checked ? false : true}
              onPress={() => {
                !checked ? setModalVisible2(!modalVisible2) : null;
              }}
            />
            <Pressable
              style={styles.icon}
              onPress={() => {
                checked
                  ? setPasswordVisible(!passwordVisible)
                  : setModalVisible2(!modalVisible2);
                setPasswordVisible(!passwordVisible);
              }}
            >
              {passwordVisible ? (
                <Ionicons
                  name="eye"
                  size={20}
                  color="black"
                  onPress={() => {
                    checked
                      ? setPasswordVisible(!passwordVisible)
                      : setModalVisible2(!modalVisible2);
                  }}
                />
              ) : (
                <Ionicons
                  name="eye-off"
                  size={20}
                  color="black"
                  onPress={() => {
                    checked
                      ? setPasswordVisible(!passwordVisible)
                      : setModalVisible2(!modalVisible2);
                  }}
                />
              )}
            </Pressable>
          </View>
          <Pressable
            style={styles.updateBtn}
            onPress={async () => {
              let form = new FormData();
              form.append("id", getUser.id);
              form.append("firstName", getFirstName);
              form.append("lastName", getLastName);
              form.append("mobile", getMobile);
              form.append("password", getPassword);
              const response = await fetch(
                "http://172.20.10.5:8080/NativeSound/UpdateUser",
                {
                  method: "POST",
                  body: form,
                }
              );
              if (response.ok) {
                const json = await response.json();
                if (json.success) {
                  Alert.alert("Success", "Update success");
                  const user = json.object;
                  await AsyncStorage.setItem("user", JSON.stringify(user));
                  setPasswordVisible(!passwordVisible);
                  setChecked(!checked);
                } else {
                  Alert.alert("Message", json.message);
                }
              }
            }}
          >
            <Text style={styles.btnText1}>Update</Text>
          </Pressable>
          <Pressable
            style={styles.signOutBtn}
            onPress={async () => {
              await AsyncStorage.removeItem("user");
              router.replace("/");
            }}
          >
            <Text style={styles.btnText2}>Sign Out</Text>
          </Pressable>
        </View>
      </View>

      {/* Buttom tab */}

      <View style={styles.bottom}>
        <View style={styles.bottomView1}>
          <Pressable
            style={styles.bottomView2}
            onPress={() => {
              setInChat(true);
              setInPeople(false);
              setInSetting(false);
              router.replace("/home");
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
              setInChat(false);
              setInPeople(true);
              setInSetting(false);
              router.replace("/home");
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
              setInChat(false);
              setInPeople(false);
              setInSetting(true);
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
      <StatusBar hidden={true}/>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#5E94FB",
  },

  header: {
    paddingTop: 7,
    paddingBottom: 16,
    backgroundColor: "#5E94FB",
    paddingTop: 50,
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
  },

  bottomView2: {
    alignItems: "center",
    rowGap: 4,
  },

  body: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 40,
    paddingHorizontal: 14,
    borderTopStartRadius: 26,
    borderTopEndRadius: 26,
  },

  imageView: {
    alignItems: "center",
    marginTop: 50,
  },

  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 80,
  },

  profileLatterView: {
    width: 150,
    height: 150,
    borderRadius: 85,
    borderWidth: 1,
    backgroundColor: "lightgray",
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },

  text4: {
    fontSize: 40,
    color: "black",
    fontFamily: "f1",
  },

  modalMain: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalView1: {
    backgroundColor: "gray",
    borderRadius: 20,
  },

  modalView2: {
    padding: 22,
    paddingTop: 8,
  },

  profileImage2: {
    width: 250,
    height: 250,
    borderRadius: 20,
  },

  imageUpdateBtn: {
    width: 250,
    borderRadius: 20,
    backgroundColor: "black",
    paddingVertical: 8,
    alignItems: "center",
    marginTop: 14,
  },

  updateBtn: {
    width: 200,
    borderRadius: 20,
    backgroundColor: "black",
    paddingVertical: 8,
    alignItems: "center",
    marginTop: 20,
  },

  signOutBtn: {
    width: 200,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "black",
    paddingVertical: 7,
    alignItems: "center",
    marginTop: 12,
  },

  btnText1: {
    fontSize: 20,
    color: "white",
    fontFamily: "f1",
  },

  btnText2: {
    fontSize: 20,
    color: "black",
    fontFamily: "f1",
  },

  fieldsView1: {
    paddingTop: 40,
    paddingHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
    rowGap: 24,
  },

  fieldsView1_1: {
    flexDirection: "row",
    columnGap: 14,
  },

  input1: {
    padding: 8,
    // backgroundColor: "gray",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    width: "48%",
    fontSize: 18,
  },

  inputView: {
    width: "100%",
    flexDirection: "row",
  },

  input2: {
    width: "100%",
  },

  icon: {
    right: 1,
    position: "absolute",
    alignSelf: "center",
    width: 30,
    alignItems: "center",
  },

  modalMain2: {
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

  modalView2_2: {
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
