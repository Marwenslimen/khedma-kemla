import React, { useEffect,useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import { auth, app } from "../../../config";
import axios from 'axios'
import { baseUrl } from '../../../urlConfig/urlConfig';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {updateEmail,updatePassword } from 'firebase/auth'
const PlayerSettings = () => {

  const [data,setData]=useState(null)
  const [FirstName, setFirstName] = useState("Marwen");
  const [SecondName, setSecondName] = useState("Slimen");
  const [Email, setEmail] = useState();
  const [ProfileImage, setProfileImage] = useState();
  const [Password,setPassword]=useState(null)
  const [ConfirmPassword,setConfirmPassword]=useState(null)
useEffect(() => {
  
axiosGetPlayer()
 
}, [])
// function hedhi bech tetna7A kif norbot l khedma 
const axiosGetPlayer =()=>{
    axios.get(`${baseUrl}api/player/g4BNGHXshTTJCgQr8GT7LM6EJOf2`).then((res)=>{
      console.log(res.data[0]);
      setData(res.data[0])
    })
}


  const updateEmailFirebase=()=>{
    updateEmail(auth.currentUser,Email)
    .then((res)=>console.log("updatedEmail"))
    .catch(err=>console.log(err))
  }

  const updatePasswordFirebase=()=>{
    updatePassword(auth.currentUser,Password)
    .then(()=>console.log("UpdatedPassword"))
     .catch(err=>console.log(err))
  }

  const uploadProfileImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = uri.substring(uri.lastIndexOf("/") + 1);
    const storage = getStorage(app);
    const storageRef = ref(storage, `terrent_Profile_images/${filename}`);
    const uploadTask = uploadBytesResumable(storageRef, blob, filename);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setProfileImage(downloadURL);
        });
      }
    );
  };


  const pickProfileImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      uploadProfileImage(result.uri);
    }
  };

  const handleSubmit = () => {
    if (Password && Password === ConfirmPassword) {


    updateEmailFirebase()
    const body={
      FireId:"g4BNGHXshTTJCgQr8GT7LM6EJOf2",
      FirstName,
      SecondName,
      Email,
      ProfileImage
    }
axios.put(`${baseUrl}api/player/updatePlayer`,body)
.then(res=>alert("Updated")).catch(err=>console.log(err))

  updatePasswordFirebase()
}else{
  alert("Wrong Confirm Password")
}

}

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          style={styles.avatar}
          source={{uri:ProfileImage}}
        />
        <TouchableOpacity style={styles.changeAvatarButton} onPress={() => {pickProfileImage()}}>
          <Text style={styles.changeAvatarButtonText}>Change Avatar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Your First Name"
          value={FirstName}
          onChangeText={setFirstName}
        />
         <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Your Last Name"
          value={SecondName}
          onChangeText={setSecondName}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          value={Email}
          onChangeText={setEmail}
        />
       
        <Text style={styles.label}>Password</Text>
        <TextInput
          secureTextEntry={true} 

          style={styles.input}
          placeholder="Enter New Password"
          
          onChangeText={setPassword}
        />
         <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          secureTextEntry={true} 

          style={styles.input}
          placeholder="Confirm New Password"
          
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor:'black',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {

    width: '80%',
  },
  label: {
    color:"lightgrey",
    marginTop: 20,
  },
  input: {
    backgroundColor: 'lightgrey',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 18,
  },
  button: {
    alignItems: 'center',

    marginTop: 20,
    backgroundColor: 'orange',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  avatarContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  changeAvatarButton: {
    marginTop: 10,
  },
  changeAvatarButtonText: {
    color: '#1E90FF',
    fontSize: 18,
  },
});

export default PlayerSettings;

