import { Text, View } from "react-native";
import { Link } from "expo-router";
import { LoginForm } from "@/components/forms/LoginForm";

const LoginView = () => {
  console.log("LoginView");
  return (
    <View style={{ flex:1}}>
      <Text style={{ fontWeight: "bold" }}>Login</Text>
      <LoginForm />
      <Link href={"/auth/register"}>Or register</Link>
    </View>
  )
}

export default LoginView;