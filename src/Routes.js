import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, ActivityIndicator, AsyncStorage } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import { Center } from './components/Center';
import { AuthContext } from './AuthProvider';
import { AppTabs } from './AppTabs';
import { AuthStack } from './AuthStack';
import { AppArticuladorTabs } from './AppArticuladorTabs';

export const Routes = () => {
	const { user, login } = useContext(AuthContext);
	const [ loading, setLoading ] = useState(true);

	useEffect(() => {
		AsyncStorage.getItem('user')
			.then((userString) => {
				//console.log('USer: ', userString)
				if (userString) {
					//decode it
					login();
				}
				setLoading(false);
			})
			.catch((err) => {
				console.log('error: ', err);
				setLoading(false);
			});
	}, []);

	if (loading) {
		return (
			<Center>
				<ActivityIndicator size="large" />
			</Center>
		);
	}

	return <NavigationContainer>{user ? <AppTabs /> : <AuthStack />}</NavigationContainer>;
};
