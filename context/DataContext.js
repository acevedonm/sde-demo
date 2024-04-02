// src/context/state.js
import { createContext, useContext, useState } from "react";

export const AppContext = createContext();

export function AppWrapper({ children }) {
  let [login, setLogin] = useState(false);
  return (
    <AppContext.Provider value={{ login, setLogin }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
