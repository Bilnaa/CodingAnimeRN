import { RegisterForm } from "@/components/forms/register-form";
import { Text, View } from "react-native";
import { Link } from "expo-router";

const RegisterView = () => {
    return (
      <View>
        <Text style={{ fontWeight: "bold" }}>Register</Text>
        <RegisterForm />
        <Link href={"/(auth)/login"}>Or login</Link>
      </View>
    )
}



export default RegisterView;