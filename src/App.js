import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from './screens/HomeScreen';
import MyPlacesScreen from './screens/MyPlacesScreen';
import AddPlaceScreen from './screens/AddPlaceScreen';
import StatisticsScreen from './screens/StatisticsScreen';

import RootNavigator from './navigation/RootNavigator';

export default function App() {
    return (
        <NavigationContainer>
            <RootNavigator />
            {/* No navigation yet - uncomment the screen you want to preview */}
            {/* <HomeScreen /> */}
            {/* <MyPlacesScreen /> */}
            {/* <AddPlaceScreen /> */}
            {/* <StatisticsScreen /> */}

            <StatusBar style="light" />
        </NavigationContainer>
    );
}
