import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
 
export default function test() {
  useEffect(async () => {
    let user = {
      name: "Navindu",
      age: 22,
    };
    let user_json = JSON.stringify(user);
    await AsyncStorage.setItem("user", user_json);
  }, []);
}
