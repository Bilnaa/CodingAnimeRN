import { Text, View } from "react-native";
import { Link } from "expo-router";

const LoginView = () => {
  return (
    <View>
      <Text style={{ fontWeight: "bold" }}>Login</Text>
      <LoginView />
      <Link href={"/(auth)/register"}>Or register</Link>
    </View>
  )
}

export default LoginView;