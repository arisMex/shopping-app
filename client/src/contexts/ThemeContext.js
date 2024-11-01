import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../styles/themes';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(lightTheme);
    const [themeName, setThemeName] = useState('dark'); // State to hold 'dark' or 'light'

    useEffect(() => {
        // Load theme preference from storage
        const loadTheme = async () => {
            const savedTheme = await AsyncStorage.getItem('appTheme');
            if (savedTheme === 'dark') {
                setTheme(darkTheme);
                setThemeName('dark'); // Set the theme name to 'dark'
            } else {
                setTheme(lightTheme);
                setThemeName('light'); // Set the theme name to 'light'
            }
        };
        loadTheme();
    }, []);

    const toggleTheme = async () => {
        const newTheme = themeName === 'light' ? darkTheme : lightTheme;
        const newThemeName = themeName === 'light' ? 'dark' : 'light'; // Toggle theme name
        setTheme(newTheme);
        setThemeName(newThemeName);
        await AsyncStorage.setItem('appTheme', newThemeName); 
    };

    return (
        <ThemeContext.Provider value={{ theme, themeName, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
