import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";

export async function logUserIn(email: string, password: string) {  
    try {
        await signInWithEmailAndPassword(auth, email, password)
    } catch (error: unknown){
        throw error
    }
}

export async function signUserOut() {
    try{
        await signOut(auth)        
        return true
    } catch(error: unknown){
        throw error
    }
}