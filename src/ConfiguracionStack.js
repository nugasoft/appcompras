import React, { useContext, useState, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View, Button, FlatList, TouchableHighlight } from 'react-native';
import { Text, Tile, Avatar, Card } from 'react-native-elements';
import { SimpleLineIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from './AuthProvider';
import UserProfile from './pages/UserProfile';

const Stack = createStackNavigator();

btnLogout = () => {
	logout();
};

export const ConfiguracionStack = ({}) => {
	const { user, logout } = useContext(AuthContext);
	return (
		<Stack.Navigator>
			<Stack.Screen
				options={({ route }) => ({
					headerTitle: 'Configuración',
					headerRight: () => {
						return (
							<SimpleLineIcons
								style={{ padding: 5, marginRight: 10 }}
								name="logout"
								size={25}
								color="#000"
								onPress={() => btnLogout()}
							/>
						);
					}
				})}
				name="UserPerfil"
				component={UserProfile}
			/>
		</Stack.Navigator>
	);
};
