import React, { useContext } from 'react';
import { Text, Button, View } from 'react-native';
import { Ionicons, FontAwesome, MaterialIcons, Octicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { FiltroStack } from './FiltroStack';
import { ResumenStack } from './ResumenStack';
import { ConsultaRechazadosStack } from './ConsultaRechazadosStack';
import { ConsultaStack } from './ConsultaStack';
import { ConfiguracionStack } from './ConfiguracionStack';
import { Center } from './components/Center';
import { AuthContext } from './AuthProvider';

const Tabs = createBottomTabNavigator();

function HomeScreen() {
	return (
		<Tabs.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;

					if (route.name === 'Resumen') {
						return <Octicons name="graph" size={size} color={color} />;
					} else if (route.name === 'Promovidos') {
						iconName = 'users';
					} else if (route.name === 'Consulta') {
						return <MaterialIcons name="find-in-page" size={size} color={color} />;
					} else if (route.name === 'Rechazados') {
						return <FontAwesome name="user-times" size={size} color={color} />;
					} else if (route.name === 'Configuración') {
						return <Ionicons name="ios-settings" size={size} color={color} />;
					}

					// You can return any component that you like here!
					return <FontAwesome name={iconName} size={size} color={color} />;
				}
			})}
			tabBarOptions={{
				activeTintColor: 'tomato',
				inactiveTintColor: 'gray'
			}}
		>
			<Tabs.Screen name="Resumen" component={ResumenStack} />
			<Tabs.Screen name="Promovidos" component={FiltroStack} />
			<Tabs.Screen name="Configuración" component={ConfiguracionStack} />
		</Tabs.Navigator>
	);
}
function NotificationsScreen({ navigation }) {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Button onPress={() => navigation.goBack()} title="Go back home" />
		</View>
	);
}

const Drawer = createDrawerNavigator();

export const AppTabs = () => {
	return (
		<Drawer.Navigator initialRouteName="Promovidos">
			<Drawer.Screen name="Promovidos" component={HomeScreen} />
			<Drawer.Screen name="Notifications" component={NotificationsScreen} />
		</Drawer.Navigator>
	);
};
