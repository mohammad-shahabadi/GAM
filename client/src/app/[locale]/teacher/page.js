"use client"
import {useContext} from "react";
import {AuthContext} from "@/context/AuthContext";

export default function Page() {
    const {
        signOut
    } = useContext(AuthContext)
    return(<div>
        you are a teacher
        <button onClick={signOut}>LogOut</button>
    </div>)
}
