"use client"
import React,{ createContext, useContext, useState } from "react";


type globalType = {
    dataValidValidation: boolean;
    setDataValidValidation: (valid: boolean) => void;

    statusValidation: string;
    setStatusValidation: (status: string) => void;

    loading: boolean;
    setLoading: (loading: boolean) => void;

    eventStatus: string;
    setEventStatus: (status: string) => void;   

};

const globalContext = createContext<globalType | undefined>(undefined);




export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [dataValidValidation, setDataValidValidation] = useState<boolean>(false);
    const [statusValidation, setStatusValidation] = useState<string>("Iniciando...");
    const [loading, setLoading] = useState<boolean>(true);
    const [eventStatus,setEventStatus] = useState<string>("START_KYC");

    return (
        <globalContext.Provider
        value={{ dataValidValidation, setDataValidValidation,statusValidation, setStatusValidation, loading, setLoading, eventStatus,setEventStatus }}
        >
            {children}
        </globalContext.Provider>
    );


}




export const useGlobalContext = () => {
    const ctx = useContext(globalContext);
    if (!ctx) throw new Error("useGlobalContext must be used inside a globalProvider");
    return ctx;
}