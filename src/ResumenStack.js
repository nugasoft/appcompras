import React, { useContext, useState, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View, Button, FlatList, TouchableHighlight } from 'react-native';
import { Text, Tile, Avatar, Card } from 'react-native-elements';
import { Ionicons, FontAwesome, MaterialIcons, Foundation } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';

import { Center } from './components/Center';
import { AuthContext } from './AuthProvider';

import Resumen from './pages/Resumen';

const Stack = createStackNavigator();

export const ResumenStack = ({}) => {
	return (
		<Stack.Navigator>
			<Stack.Screen name="Resumen" component={Resumen} />
		</Stack.Navigator>
	);
};
