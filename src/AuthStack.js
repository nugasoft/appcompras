import React, { useContext } from 'react';
import { Text, Button } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';

import { Center } from './components/Center';
import { AuthContext } from './AuthProvider';

import LoginPage from './pages/LoginPage';
import RegistroUsers from './pages/RegistroUsers';

const Stack = createStackNavigator();

function Registro({ navigation }) {
	return (
		<Center>
			<Text>I am a Registro</Text>
			<Button
				title="Go to Login"
				onPress={() => {
					navigation.navigate('Login');
				}}
			/>
		</Center>
	);
}

export const AuthStack = ({}) => {
	return (
		<Stack.Navigator initialRouteName="Login">
			<Stack.Screen
				name="Login"
				options={{
					headerTitle: 'Entrar',
				}}
				component={LoginPage}
			/>
			<Stack.Screen
				name="RegistroUsers"
				options={{
					headerTitle: 'Registro',
				}}
				component={RegistroUsers}
			/>
		</Stack.Navigator>
	);
};
