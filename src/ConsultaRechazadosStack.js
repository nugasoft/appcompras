import React, { useContext, useState, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View, Button, FlatList, TouchableHighlight } from 'react-native';
import { Text, Tile, Avatar, Card } from 'react-native-elements';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';

import PersonasRechazadas from './pages/PersonasRechazadas';

const Stack = createStackNavigator();

export const ConsultaRechazadosStack = ({}) => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				options={({ route }) => ({
					headerTitle: 'Personas Rechazadas',
				})}
				name="Rechazadas"
				component={PersonasRechazadas}
			/>
		</Stack.Navigator>
	);
};
