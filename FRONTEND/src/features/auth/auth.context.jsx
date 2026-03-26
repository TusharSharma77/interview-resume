/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import { getMe } from "../../services/auth.api";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser ] = useState(null);
    const[loading,setloading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const data = await getMe();
                if (!cancelled) setUser(data?.user ?? null);
            } catch {
                if (!cancelled) setUser(null);
            } finally {
                if (!cancelled) setloading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    return(
        <AuthContext.Provider value={{user, setUser, loading, setloading}}>
            {children}
        </AuthContext.Provider>
    )
}