import { createContext, useEffect, useState } from 'react';
import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from 'firebase/auth';
import app from '../firebase/firebase.config';
import axios from 'axios';
import PropTypes from 'prop-types';

export const AuthContext = createContext(null)
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const createUser = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const signIn = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }

    const signInWithGoogle = () => {
        setLoading(true)
        return signInWithPopup(auth, googleProvider)
    }

    const logOut = async () => {
        setLoading(true);
        return signOut(auth);
    }

    const updateUserProfile = (name, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photo,
        })
    }

    // onAuthStateChange
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            console.log("state changed", currentUser);
            const userEmail = currentUser?.email || user?.email;
            const loggedUserEmail = { email: userEmail }
            if (currentUser) {
                axios.post(`${import.meta.env.VITE_API_URL}/jwt`, loggedUserEmail, {withCredentials: true})
                    .then(res => {
                    console.log(res.data);
                })
            } else {
                axios.post(`${import.meta.env.VITE_API_URL}/logout`, loggedUserEmail, {withCredentials: true})
                    .then(res => {
                    console.log(res.data)
                })
            }
            setUser(currentUser)
            setLoading(false);
        })
        return () => {
            return unsubscribe();
        }
    }, [user])

    const authInfo = {
        user,
        setUser,
        loading,
        setLoading,
        createUser,
        signIn,
        signInWithGoogle,
        logOut,
        updateUserProfile,
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node,
}


export default AuthProvider;