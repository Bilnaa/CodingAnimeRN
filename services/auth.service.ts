import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "@firebase/auth";
import { auth } from "@/config/firebase.config";
import { FirebaseError } from "@firebase/app";

export const register = async (email: string, password: string, setError: (message: string) => void) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password)
    }
    catch (e: any) {
        const err = e as FirebaseError
        if(err.code === "auth/email-already-in-use") {
            setError("Email already in use")
        }
        else if(err.code === "auth/invalid-email") {
            setError("Invalid email")
        }
        else if(err.code === "auth/weak-password") {
            setError("Password should be at least 6 characters")
        }
        else {
            setError("An unexpected error occurred, please try in a few seconds")
        }
    }
}

export const login = async (email: string, password: string, setError: (message: string) => void) => {
    try {
        await signInWithEmailAndPassword(auth, email, password)
    }
    catch (e: any) {
        const err = e as FirebaseError
        if(err.code === "auth/invalid-credential") {
            setError("Invalid credentials")
        }
        else {
            setError("An unexpected error occurred, please try in a few seconds")
        }
    }
}

export const logout = async () => {
    await auth.signOut()
}