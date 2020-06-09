import React, { useContext } from 'react';
import { Text, Button, View } from 'react-native';
import { Ionicons, FontAwesome, MaterialIcons, Octicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { FiltroStack } from './FiltroStack';
import { ResumenStack } from './ResumenStack';
import { ConfiguracionStack } from './ConfiguracionStack';

const Tabs = createBottomTabNavigator();

export const AppPromovidosTabs = () => {
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
};
