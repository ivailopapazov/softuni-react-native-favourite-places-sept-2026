import { createStackNavigator } from '@react-navigation/stack';

import AuthNavigator from './AuthNavigator';

export default function RootNavigator() {
    const Stack = createStackNavigator();
    
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Auth" component={AuthNavigator} />  
        </Stack.Navigator>
    );
}
