import Switch from '@mui/material/Switch';

export default function ToggleTheme({ toggleTheme, isDarkMode }:{
    toggleTheme: () => void,
    isDarkMode: boolean
}){
    return (
        <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
        />
    );
};