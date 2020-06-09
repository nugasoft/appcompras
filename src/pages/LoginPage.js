import React, { useContext, useState, useEffect, useRef } from 'react';
import { ActivityIndicator, View, SafeAreaView, ScrollView, AsyncStorage, Platform } from 'react-native';
import { Image, Text, Button, Avatar, Card, CheckBox, Input, Slider } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DropdownAlert from 'react-native-dropdownalert';
import { Ionicons, FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { Center } from '../components/Center';
import { AuthContext } from '../AuthProvider';

import styles from './styles';

export default (LoginPage = ({ route, navigation }) => {
	const { login } = useContext(AuthContext);
	const dropDownAlertRef = useRef(null);

	const [ formState ] = useState();
	const [ token, setToken ] = useState('');
	const [ notificacion, setNotificacion ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ state, setState ] = useState({ email: '', password: '', security: true });

	registerForPushNotificationsAsync = async () => {
		if (Expo.Constants.isDevice) {
			const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
			let finalStatus = existingStatus;

			if (existingStatus !== 'granted') {
				const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
				finalStatus = status;
			}
			if (finalStatus !== 'granted') {
				console.log('Error al obtener el token para las notificaciones');
				return true;
			}
			let token = await Notifications.getExpoPushTokenAsync();

			setToken(token);
			console.log('=>Token:', token);
		} else {
			console.log('Debes de user un dispositivo que soporte Notificaciones');
		}
	};

	handleNotification = (notification) => {
		setNotificacion(notification);
		console.log('=>Notificación: ', notification);
	};

	useEffect(() => {
		registerForPushNotificationsAsync();

		this.notificationSubscription = Notifications.addListener(this.handleNotification);
	}, []);

	btnLogin = () => {
		console.log('=> stste: ', state);

		if (state.email.length < 10) {
			dropDownAlertRef.current.alertWithType('error', 'Error', 'Usuario requerido');
			return true;
		}

		if (state.password.length < 5) {
			dropDownAlertRef.current.alertWithType('error', 'Error', 'Contraseña requerida');
			return true;
		}

		const data = {
			email: state.email,
			password: state.password,
			DeviceID: Expo.Constants.deviceId,
			DeviceOS: Platform.OS,
			Token: token,
			Metodo: 'movil'
		};

		setLoading(true);

		console.log('=>Data: ', data);

		var requestInfo = {
			method: 'POST',
			body: JSON.stringify(data),
			headers: new Headers({
				'Content-Type': 'application/json'
			})
		};
		fetch('https://api.chiapasavanza.com/api/login', requestInfo)
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				throw new Error('Ocurrio un error: ', response);
			})
			.then((dataRS) => {
				console.log('=>dataRS Login: ', dataRS);
				setLoading(false);
				if (dataRS.results) {
					var MenuArray = [];
					dataRS.menus.forEach((item) => {
						MenuArray[item.idMenu] = item;
					});

					const data = {
						token: dataRS.access_token,
						user: dataRS.user,
						menu: MenuArray,
						users_dl: dataRS.users_dl,
						users_df: dataRS.users_df,
						users_poligonos: dataRS.users_poligonos,
						users_secciones: dataRS.users_secciones
					};

					console.log('=>Save Menu: ', data);

					login(data);
				} else {
					dropDownAlertRef.current.alertWithType('error', 'Error', 'error de acceso');
				}
			})
			.catch((e) => {
				console.log('==>Error: ', e);
				setLoading(false);
				dropDownAlertRef.current.alertWithType('error', 'Error', 'Usuario y/o Contraseña incorrecta!');
			});
	};
	return (
		<SafeAreaView>
			<ScrollView style={styles.scrollView}>
				<View style={{ flex: 1, justifyContent: 'center' }}>
					<View style={{ flexDirection: 'column' }}>
						<View style={{ alignSelf: 'center' }}>
							<Image
								resizeMode="contain"
								source={require('../images/logoImpulso.png')}
								style={{ width: 90, height: 90 }}
							/>
						</View>
						<View>
							<Input
								style={{ width: '100%' }}
								placeholder="Celular"
								keyboardType="numeric"
								value={state.email}
								onChangeText={(email) => setState({ ...state, email })}
								leftIcon={
									<FontAwesome style={{ marginHorizontal: 5 }} name="user" size={24} color="black" />
								}
							/>
						</View>
						<View>
							<Input
								style={{ width: '100%', paddingTop: 10 }}
								placeholder="Contraseña"
								secureTextEntry={state.security}
								onChangeText={(password) => setState({ ...state, password })}
								leftIcon={
									<FontAwesome style={{ marginHorizontal: 5 }} name="lock" size={24} color="black" />
								}
								rightIcon={
									<FontAwesome
										style={{ marginHorizontal: 5 }}
										name="eye"
										size={24}
										color="black"
										onPress={() => setState({ ...state, security: !state.security })}
									/>
								}
								onSubmitEditing={btnLogin}
							/>
						</View>
						<View
							style={{
								width: '70%',
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignSelf: 'center',
								padding: 15
							}}
						>
							{!loading && <Button title="Entrar" onPress={btnLogin} />}
							{loading && <ActivityIndicator size="large" />}
						</View>
					</View>
				</View>
				<Center>
					<Text>ver 1.0</Text>
				</Center>
				<DropdownAlert ref={dropDownAlertRef} />
			</ScrollView>
		</SafeAreaView>
	);
});
