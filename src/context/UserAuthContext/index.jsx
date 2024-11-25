import { createContext, useContext, useEffect, useState } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";

const userAuthContext = createContext();

export function UserAuthContextProvider({children}) {
    const [user, setUser] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const [ename, setEname] = useState([]);

    function signIn(email,password) {
        return signInWithEmailAndPassword(auth, email, password)
        
    }
    function logout() {
        return signOut(auth);
    }
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (currentUser)=>{
            setUser(currentUser);
            setIsFetching(false);
            currentUser ? setEname(currentUser.email.split('@')):setEname('');
        })
        return () => unsubscribe();
    },[]);
    
    if(isFetching) {
        return <h2>loading...</h2>
    }

return <userAuthContext.Provider value={{user, setIsFetching, ename, signIn, logout}}>{children}</userAuthContext.Provider>
}

export function useUserAuth() {
    return useContext(userAuthContext);
}