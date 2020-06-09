import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Avatar, ListItem } from 'react-native-elements';

import { AuthContext } from './AuthProvider';

import defaultPic from './images/logoImpulso.png';

export function MenuLeft({ state, navigation }) {
	const { user, logout } = useContext(AuthContext);

	useEffect(
		() => {
			console.log('=> Menu: ', user);
		},
		[ user.menu, state ]
	);

	return (
		<DrawerContentScrollView>
			<View style={styles.drawerContent}>
				<View style={styles.userInfoSection}>
					<View style={styles.preference}>
						{!user.user.Foto64 && <Avatar rounded source={defaultPic} size={50} />}
						{user.user.Foto64 && <Avatar rounded source={{ uri: user.user.Foto64 }} size={50} />}
						<MaterialCommunityIcons name="exit-to-app" size={24} color="black" onPress={() => logout()} />
					</View>
					<Text style={styles.title}>{`${user.user.Nombre} ${user.user.Paterno}`}</Text>
					<Text style={styles.caption}>{`${user.user.Responsabilidad.label}`}</Text>
					<View style={styles.row}>
						<View style={styles.section}>
							<Text style={[ styles.paragraph, styles.caption ]}>202</Text>
							<Text style={styles.caption}>Directos</Text>
						</View>
						<View style={styles.section}>
							<Text style={[ styles.paragraph, styles.caption ]}>159</Text>
							<Text style={styles.caption}>Indirectos</Text>
						</View>
					</View>
				</View>
				<View style={{ paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth }} />
				{user.menu.map((item, id) => {
					console.log('=> itemMenu: ', item);
					return (
						<ListItem
							key={id}
							containerStyle={{
								backgroundColor: state.routes[state.index].name == item.layout ? '#333333' : '#FFF'
							}}
							titleStyle={{
								color: state.routes[state.index].name == item.layout ? '#FFF' : '#000',
								textShadowRadius: 0.5,
								fontWeight: state.routes[state.index].name == item.layout ? 'bold' : 'normal'
							}}
							leftIcon={{
								type: `${item.iconTipo}`,
								name: `${item.icon}`,
								color: state.routes[state.index].name == item.layout ? '#91896A' : '#000'
							}}
							title={item.Menu}
							bottomDivider
							chevron
							onPress={() => navigation.navigate(`${item.layout}`)}
						/>
					);
				})}
			</View>
		</DrawerContentScrollView>
	);
}

const styles = StyleSheet.create({
	drawerContent: {
		flex: 1
	},
	userInfoSection: {
		paddingLeft: 20
	},
	title: {
		marginTop: 20,
		fontWeight: 'bold'
	},
	caption: {
		fontSize: 14,
		lineHeight: 14
	},
	row: {
		marginTop: 20,
		flexDirection: 'row',
		alignItems: 'center'
	},
	section: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: 15
	},
	paragraph: {
		fontWeight: 'bold',
		marginRight: 3
	},
	drawerSection: {
		marginTop: 15
	},
	preference: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 12,
		paddingHorizontal: 16
	}
});
