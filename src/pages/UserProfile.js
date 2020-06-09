import React, { useContext } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import { AuthContext } from '../AuthProvider';
import styles from './stylesProfile';

export default (UserPerfil = ({ route, navigation }) => {
	const { user, logout } = useContext(AuthContext);

	btnLogout = () => {
		logout();
	};
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View style={styles.headerContent}>
					<Image style={styles.avatar} source={{ uri: '../logoImpulso.png' }} />
					<Text style={styles.name}>{`${user.user.Nombre} ${user.user.Paterno}`}</Text>
					<Text style={styles.name}>{`${user.user.Responsabilidad.label}`}</Text>
				</View>
			</View>

			<View style={styles.profileDetail}>
				<View style={styles.detailContent}>
					<Text style={styles.title}>Promovidos</Text>
					<Text style={styles.count}>200</Text>
				</View>
				<View style={styles.detailContent}>
					<Text style={styles.title}>Voluntarios</Text>
					<Text style={styles.count}>200</Text>
				</View>
				<View style={styles.detailContent}>
					<Text style={styles.title}>Asignación</Text>
					<Text style={styles.count}>200</Text>
				</View>
			</View>

			<View style={styles.body}>
				<View style={styles.bodyContent}>
					<TouchableOpacity style={styles.buttonContainer}>
						<Text>Opcion 1</Text>
					</TouchableOpacity>
					<Text style={styles.description}>
						Lorem ipsum dolor sit amet, saepe sapientem eu nam. Qui ne assum electram expetendis, omittam
						deseruisse consequuntur ius an,
					</Text>
				</View>
			</View>
		</View>
	);
});
