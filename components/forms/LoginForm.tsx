import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { login } from "@/services/auth.service";
import { router } from "expo-router";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const submitLogin = async () => {
    await login(email, password, setError);
    router.replace("/");
  }
  return (
    <View>
      <TextInput placeholder="Email" keyboardType={"email-address"} autoCapitalize={"none"} autoComplete={"email"}
                 onChangeText={setEmail}/>
      <TextInput placeholder="Password" onChangeText={setPassword} secureTextEntry={true}/>
      <TouchableOpacity>
        <Text onPress={submitLogin}>Login</Text>
      </TouchableOpacity>
      {error && <Text>{error}</Text>}
    </View>
  )
}