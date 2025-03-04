import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { register } from "@/services/auth.service";

export const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const submitRegister = async () => {
    await register(email, password, setError);
  }
  return (
    <View>
      <TextInput placeholder="Email" keyboardType={"email-address"} autoCapitalize={"none"} autoComplete={"email"} onChangeText={setEmail}/>
      <TextInput placeholder="Password" onChangeText={setPassword} secureTextEntry={true}/>
      <TouchableOpacity >
        <Text onPress={submitRegister}>Register</Text>
      </TouchableOpacity>
      {error && <Text>{error}</Text>}
    </View>
  )
}