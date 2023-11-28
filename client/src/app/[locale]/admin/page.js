"use client"
import {useContext} from "react";
import {AuthContext} from "@/context/AuthContext";

export default function Page() {
    const {
        signOut
    } = useContext(AuthContext)
    return (<div>
        you are an admin<br/>
        <button className={"text-red-600"} onClick={signOut}>LogOut</button>
    </div>)
}
