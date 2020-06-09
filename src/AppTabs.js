import React, { useContext, useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';
import { AppResumenDFTabs } from './AppResumenDFTabs';
import { AppResumenDLTabs } from './AppResumenDLTabs';
import { AppPromovidosTabs } from './AppPromovidosTabs';
import { AppVoluntariosTabs } from './AppVoluntariosTabs';
import { AppNotificacionesTabs } from './AppNotificacionesTabs';
import { AppAgendaTabs } from './AppAgendaTabs';
import { AppADNTabs } from './AppADNTabs';

import { AuthContext } from './AuthProvider';
import { MenuLeft } from './MenuLeft';
import useFocusEffect from '@react-navigation/core';

const Drawer = createDrawerNavigator();

export const AppTabs = ({ route, navigation }) => {
	const { user, logout } = useContext(AuthContext);

	return (
		<Drawer.Navigator initialRouteName="Promovidos" drawerContent={(props) => <MenuLeft {...props} />}>
			<Drawer.Screen name="Inicio" drawerLabel="Home" component={AppPromovidosTabs} />
			<Drawer.Screen name="ResumenDF" component={AppResumenDFTabs} />
			<Drawer.Screen name="ResumenDL" component={AppResumenDLTabs} />
			<Drawer.Screen name="Promovidos" component={AppPromovidosTabs} />
			<Drawer.Screen name="Voluntarios" component={AppVoluntariosTabs} />
			<Drawer.Screen name="Mensajes" component={AppNotificacionesTabs} />
			<Drawer.Screen name="Agenda" component={AppAgendaTabs} />
			<Drawer.Screen name="ADN" component={AppADNTabs} />
		</Drawer.Navigator>
	);
};
