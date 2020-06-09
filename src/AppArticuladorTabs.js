import React, { useContext } from 'react';
import { Text, Button } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { FiltroStack } from './FiltroStack';
import { ConsultaStack } from './ConsultaStack';
import { ConfiguracionStack } from './ConfiguracionStack';
import { Center } from './components/Center';
import { AuthContext } from './AuthProvider';

const Tabs = createBottomTabNavigator();

export const AppArticuladorTabs = () => {
	return (
		<Tabs.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;

					if (route.name === 'Grupos') {
						return <FontAwesome name="users" size={size} color={color} />;
					} else if (route.name === 'Entrega') {
						iconName = 'tasks';
					} else if (route.name === 'Consulta') {
						iconName = 'user-md';
					} else if (route.name === 'Configuración') {
						return <Ionicons name="ios-settings" size={size} color={color} />;
					}

					// You can return any component that you like here!
					return <FontAwesome name={iconName} size={size} color={color} />;
				},
			})}
			tabBarOptions={{
				activeTintColor: 'tomato',
				inactiveTintColor: 'gray',
			}}
		>
			<Tabs.Screen name="Entrega" component={FiltroStack} />
			<Tabs.Screen name="Consulta" component={ConsultaStack} />
			<Tabs.Screen name="Configuración" component={ConfiguracionStack} />
		</Tabs.Navigator>
	);
};
