import React, { createContext, useState, useContext } from 'react';
import { useColorMode } from 'native-base';

const ColorModeContext = createContext();

export const ColorModeProvider = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [mode, setMode] = useState(colorMode);

  const toggleMode = () => {
    toggleColorMode();
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ColorModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ColorModeContext.Provider>
  );
};

export const useColorModeValue = () => useContext(ColorModeContext);
