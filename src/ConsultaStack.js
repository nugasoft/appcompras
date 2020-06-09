import React, { useContext, useState, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View, Button, FlatList, TouchableHighlight } from 'react-native';
import { Text, Tile, Avatar, Card } from 'react-native-elements';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';

import PersonasTarjeta from './pages/PersonasTarjeta';

const Stack = createStackNavigator();

export const ConsultaStack = ({}) => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				options={({ route }) => ({
					headerTitle: 'consulta asignados',
				})}
				name="PersonasTarjeta"
				component={PersonasTarjeta}
			/>
		</Stack.Navigator>
	);
};
