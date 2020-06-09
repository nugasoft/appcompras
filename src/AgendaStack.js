import React, { useContext, useState, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View, Button, FlatList, TouchableHighlight } from 'react-native';
import { Text, Tile, Avatar, Card } from 'react-native-elements';
import { Ionicons, FontAwesome, MaterialIcons, Foundation } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';

import { Center } from './components/Center';
import { AuthContext } from './AuthProvider';
import { calcularEdad } from './components/funciones';

import AgendaView from './pages/AgendaView';
import PromovidosAdd from './pages/PromovidosAdd';
import getCarnita from './pages/getCarnita';
import CatMunicipios from './pages/CatMunicipios';
import catColonia from './pages/catColonia';
import catLocalidades from './pages/catLocalidades';
import Personas from './pages/Personas';

const Stack = createStackNavigator();

export const AgendaStack = ({}) => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Agenda"
				options={({ route, navigation }) => ({
					headerRight: () => {
						return (
							<FontAwesome
								style={{ padding: 5, marginRight: 10 }}
								name="user-plus"
								size={25}
								color="#000"
								onPress={() =>
									navigation.navigate('PromovidosAdd', {
										refreshData
									})}
							/>
						);
					}
				})}
				component={AgendaView}
			/>

			<Stack.Screen
				options={({ route }) => ({
					headerTitle: 'Captura',
					headerRight: () => (
						<FontAwesome
							style={{ margin: 5, padding: 5 }}
							name="save"
							size={25}
							color="#000"
							onPress={() => {
								//btnSave()
								if (route.params.submit) {
									route.params.submit.current();
								}
							}}
						/>
					)
				})}
				name="PromovidosAdd"
				component={PromovidosAdd}
			/>

			<Stack.Screen
				options={({ route, navigation }) => ({
					headerTitle: 'Buscar...'
				})}
				name="getCarnita"
				component={getCarnita}
			/>

			<Stack.Screen
				options={({ route, navigation }) => ({
					headerTitle: 'Municipios'
				})}
				name="CatMunicipios"
				component={CatMunicipios}
			/>

			<Stack.Screen
				options={({ route, navigation }) => ({
					headerTitle: 'Colonias'
				})}
				name="catColonia"
				component={catColonia}
			/>

			<Stack.Screen
				options={({ route, navigation }) => ({
					headerTitle: 'Personas'
				})}
				name="Personas"
				component={Personas}
			/>
		</Stack.Navigator>
	);
};
