import { StatusBar } from 'expo-status-bar';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MyPlacesScreen from './screens/MyPlacesScreen';
import AddPlaceScreen from './screens/AddPlaceScreen';
import StatisticsScreen from './screens/StatisticsScreen';

export default function App() {
    return (
        <>
            {/* No navigation yet - uncomment the screen you want to preview */}
            <LoginScreen />
            {/* <RegisterScreen /> */}
            {/* <HomeScreen /> */}
            {/* <MyPlacesScreen /> */}
            {/* <AddPlaceScreen /> */}
            {/* <StatisticsScreen /> */}

            <StatusBar style="light" />
        </>
    );
}
