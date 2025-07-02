import React, { createContext, useState, useContext, useEffect } from 'react';
import { resetTo } from "../Navigationservice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  useEffect(() => {
    const initializeUser = async () => {
      try {
        //const storedToken = await AsyncStorage.getItem("token");
        const storedUserDetails = await AsyncStorage.getItem("userDetails");
        if (storedUserDetails) {
          setUser(storedUserDetails);
        }
        if (storedUserDetails) {
          try {
            const userData = JSON.parse(storedUserDetails);
            console.log(userData,"user data");
            
            setUser(userData);
            setLoading(false);
            //  getProfilData(userData?.profile_id);
            // resetTo("MainApp");
          } catch (error) {
            console.error("Error parsing user profile:", error);
          }
        }else{
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch data from AsyncStorage:", error);
      }
    };
    initializeUser();
  }, []);

  const contextValue = {
    user,
    loading,
    setUser,
  };
  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};
export const useGetUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useGetUser must be used within a UserProvider");
  }
  return context;
};

