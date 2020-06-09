import React, { useContext } from 'react';
import { Text, Button, View } from 'react-native';
import { Ionicons, FontAwesome5, FontAwesome, MaterialIcons, Octicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { AgendaStack } from './AgendaStack';
import { ResumenStack } from './ResumenStack';

const Tabs = createBottomTabNavigator();

export const AppAgendaTabs = () => {
	return (
		<Tabs.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;

					if (route.name === 'Resumen') {
						return <Octicons name="graph" size={size} color={color} />;
					} else if (route.name === 'Electoral') {
						return <FontAwesome5 name="people-carry" size={size} color={color} />;
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
			<Tabs.Screen name="Agenda" component={AgendaStack} />
		</Tabs.Navigator>
	);
};
