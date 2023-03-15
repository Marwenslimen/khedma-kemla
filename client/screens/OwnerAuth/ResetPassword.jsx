import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Button
} from "react-native";
import { auth } from "../../config.js";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";


const ForgetPassword = () => {
  const navigation = useNavigation();
  
  const [email, setemail] = useState("");
  const NewPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Check Your Email To Reset Your Password ");
      })
      .then(() => {
        navigation.navigate("Signin");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <View style={styles.root}>
      <Text style={styles.title}> Reset your Password </Text>
      <Text > Email*</Text>
      <TextInput
        placeholder="Enter your Email "
        value={email}
        onChangeText={setemail}
      />
      <Button onPress={NewPassword} title="Send" />
      <Button
        onPress={() => navigation.navigate("ownerlogin")}
        title="BacktoLogin"
        type="tertiary"
      />
    </View>
  );
};
const styles = StyleSheet.create({
    root: {
      alignItems: "center",
      padding: 10,
    },
    title: {
      fontSize: 30,
      fontWeight: "bold",
      margin: 19,
      padding: 25,
    },
  });
export default ForgetPassword;











