import React, { useContext, useState, useEffect, useRef } from 'react';
import { SafeAreaView, ScrollView, View, ActivityIndicator } from 'react-native';
import { ListItem, Text, Tile, Avatar, Card, CheckBox, Input, Slider } from 'react-native-elements';

import DropdownAlert from 'react-native-dropdownalert';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import DatePicker from 'react-native-datepicker';
import { ConfirmDialog } from 'react-native-simple-dialogs';

import { AuthContext } from '../AuthProvider';
import moment from 'moment';
import styles from './styles';

export default (PromovidosAdd = ({ route, navigation }) => {
	const { user } = useContext(AuthContext);
	const dropDownAlertRef = useRef(null);

	const [ hasLocationPermission, setLocationPermission ] = useState(null);

	const [ location, setLocation ] = useState({
		coords: {
			accuracy: 65,
			altitude: '',
			altitudeAccuracy: '',
			heading: 0,
			latitude: '',
			longitude: '',
			speed: 0
		},
		timestamp: ''
	});

	const [ formState ] = useState();
	const [ municipio, setMunicipioGrupo ] = useState({ id: '87', Clave: '101', Municipio: 'Tuxtla Gutiérrez' });
	const [ giro, setGiro ] = useState({ id: null, Giro: 'Seleccione' });
	const [ cp, setCP ] = useState([ { id: '', d_codigo: '', d_asenta: '' } ]);
	const [ showFolio, setShowFolio ] = useState(false);
	const [ tipoNegocio, setTipoNegocio ] = useState({ id: null, Tipo: 'Seleccione' });
	const [ comercio, setComercio ] = useState({
		ClaveUnica: '',
		Nombres: '',
		Paterno: '',
		Materno: '',
		Sexo: '',
		FechaNacimiento: '',
		Calle: '',
		NumExt: '',
		NumInt: '',
		Colonia: '',
		CP: '',
		SeccionVota: '',
		TelFijo: '',
		TelCelular: '',
		TelRecados: '',
		isVoluntario: 0,
		ExperienciaElectoral: 0,
		Longitude: '',
		Latitude: '',
		idMunicipioVive: 1,
		idEstadoNacimiento: 8,
		idNivelEstudios: 1,
		idSituacionLaboral: 1,
		idPerfil: 1,
		isValidado: 0,
		isSync: 0,
		idRemoto: 0,
		UserOwned: user.user.id,
		idArticulador: user.user.id,
		idResponsabilidad: 1
	});
	const [ dataPage, setDataPage ] = useState({ page: 0, pageSize: 100, maxPage: 1 });
	const [ loading, setLoading ] = useState(false);
	const [ susGiros, setsusGiros ] = useState([]);
	const [ itemSave, setItemSave ] = useState({ FolioUnico: '' });

	const submit = useRef(() => {});

	useEffect(() => {
		navigation.setParams({ submit });

		console.log('=> Data User: ', user);
	}, []);

	getLocationAsync = async () => {
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			//No dio permiso de ubicación
		}

		let location = await Location.getCurrentPositionAsync({});
		console.log('=>location: ', location);
		setLocation(location);
		setComercio({ ...comercio, Longitude: location.coords.longitude, Latitude: location.coords.latitude });
	};

	useEffect(() => {
		Permissions.getAsync(Permissions.LOCATION).then((infoPermiso) => {
			console.log('=>Checar getAsync Permisos: ', infoPermiso.status);
			if (infoPermiso.status === 'undetermined') {
				//            setVisibleModal(true)
			} else if (infoPermiso.status === 'granted') {
				setLocationPermission(infoPermiso.status === 'granted');
			}
		});
		getLocationAsync();
	}, []);

	useEffect(
		() => {
			console.log('=>Info comercio: ', comercio);
		},
		[ comercio ]
	);

	btnGuardar = () => {
		console.log('=> inicia save Comercio.', comercio);
		setLoading(true);

		if (!comercio.ClaveUnica) {
			setLoading(false);
			dropDownAlertRef.current.alertWithType('error', 'Error', 'Error: ClaveUnica es requerido.');
			return true;
		}

		if (comercio.ClaveUnica.length != 18) {
			setLoading(false);
			dropDownAlertRef.current.alertWithType('error', 'Error', 'Error: ClaveUnica es inválida.');
			return true;
		}

		if (!comercio.Nombres) {
			setLoading(false);
			dropDownAlertRef.current.alertWithType('error', 'Error', 'Error: Nombre es requerido.');
			return true;
		}
		if (comercio.Nombres.length < 1) {
			setLoading(false);
			dropDownAlertRef.current.alertWithType('error', 'Error', 'Error: Nombre es requerido.');
			return true;
		}

		if (!comercio.Paterno) {
			setLoading(false);
			dropDownAlertRef.current.alertWithType('error', 'Error', 'Error: Paterno es requerido.');
			return true;
		}
		if (comercio.Paterno.length < 1) {
			setLoading(false);
			dropDownAlertRef.current.alertWithType('error', 'Error', 'Error: Paterno es requerido.');
			return true;
		}

		if (!comercio.Materno) {
			setLoading(false);
			dropDownAlertRef.current.alertWithType('error', 'Error', 'Error: Materno es requerido.');
			return true;
		}
		if (comercio.Materno.length < 1) {
			setLoading(false);
			dropDownAlertRef.current.alertWithType('error', 'Error', 'Error: Materno es requerido.');
			return true;
		}

		if (!comercio.Sexo) {
			setLoading(false);
			dropDownAlertRef.current.alertWithType('error', 'Error', 'Error: Sexo es requerido.');
			return true;
		}
		if (comercio.Sexo.length != 1) {
			setLoading(false);
			dropDownAlertRef.current.alertWithType('error', 'Error', 'Error: Sexo es requerido.');
			return true;
		}

		if (!comercio.FechaNacimiento) {
			setLoading(false);
			dropDownAlertRef.current.alertWithType('error', 'Error', 'Error: Fecha de Nacimiento es requerido.');
			return true;
		}

		if (comercio.FechaNacimiento.length != 10) {
			setLoading(false);
			dropDownAlertRef.current.alertWithType('error', 'Error', 'Error: Fecha de Nacimiento es requerido.');
			return true;
		}

		if (municipio.id == '') {
			setLoading(false);
			dropDownAlertRef.current.alertWithType(
				'error',
				'Error',
				'Haga click en el icono para selccionar un municipio.'
			);
			return true;
		}

		if (!comercio.Calle) {
			setLoading(false);
			dropDownAlertRef.current.alertWithType('error', 'Error', 'Error: Calle  es requerido.');
			return true;
		}
		if (comercio.Calle.length < 3) {
			setLoading(false);
			dropDownAlertRef.current.alertWithType('error', 'Error', 'Error: Calle  es requerido.');
			return true;
		}

		if (!comercio.NumExt) {
			setLoading(false);
			dropDownAlertRef.current.alertWithType('error', 'Error', 'Error: NumExt  es requerido.');
			return true;
		}

		if (!comercio.Colonia) {
			setLoading(false);
			dropDownAlertRef.current.alertWithType('error', 'Error', 'Error: Colonia  es requerido.');
			return true;
		}
		if (comercio.Colonia.length < 3) {
			setLoading(false);
			dropDownAlertRef.current.alertWithType('error', 'Error', 'Error: Colonia  es requerido.');
			return true;
		}

		//console.log('=>Guardar: ', comercio);

		const data = {
			ClaveElector: comercio.ClaveUnica,
			Nombres: comercio.Nombres,
			Paterno: comercio.Paterno,
			Materno: comercio.Materno,
			idSexo: comercio.Sexo == 'H' ? 2 : 3,
			FechaNacimiento: comercio.FechaNacimiento,
			idEstadoNacimiento: comercio.idEstadoNacimiento,
			idMunicipioVive: municipio.id,
			idMunicipioVota: municipio.id,
			CalleVive: comercio.Calle,
			NumExtVive: comercio.NumExt,
			NumIntVive: comercio.NumInt,
			ColoniaVive: comercio.Colonia,
			CPVive: comercio.CP,
			isVoluntario: comercio.isVoluntario,
			idVoluntario: 1,
			MismaAddress: 1,
			SeccionVota: comercio.SeccionVota,
			ExperienciaElectoral: comercio.ExperienciaElectoral,
			idNivelEstudios: 1,
			idSituacionLaboral: 1,
			idPerfil: 1,
			Latitude: comercio.Latitude,
			Longitude: comercio.Longitude,
			Telefono: comercio.TelFijo,
			TelMensajes: comercio.TelRecados,
			Celular: comercio.TelCelular,
			Compania: comercio.Compania,
			UserOwned: user.user.id,
			idResponsabilidad: 1,
			Metodo: 'app',
			Username: user.user.id,
			LastUpdate: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
			UserUpdate: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
			FechaCreate: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
			UserCreate: user.user.id,
			isSync: 0,
			idRemoto: 0,
			isValidado: 0
		};

		var requestInfo = {
			method: 'POST',
			body: JSON.stringify(data),
			headers: new Headers({
				'Content-Type': 'application/json',
				Authorization: 'bearer ' + user.token
			})
		};

		console.log('=>Envio setCompromisos: ', data);
		//return true;

		fetch('https://api.chiapasavanza.com/api/setCompromisos', requestInfo)
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				throw new Error('Ocurrio un error: ', response);
			})
			.then((dataRS) => {
				console.log('=>Insert setCompromisos: ', dataRS);
				setLoading(false);

				route.params.refreshData();
				navigation.goBack();

				// if (dataRS.success) {
				// 	if (dataRS.results) {
				// 		setItemSave(dataRS.data);
				// 		setShowFolio(true);
				// 	} else {
				// 		dropDownAlertRef.current.alertWithType(
				// 			'error',
				// 			'Error',
				// 			'Verifique que todos los campos estan completos.'
				// 		);
				// 		return true;
				// 	}
				// } else {
				// 	dropDownAlertRef.current.alertWithType('error', 'Error', dataRS.errors);
				// 	return true;
				// }
			})
			.catch((e) => {
				console.log('==>Error en setGrupoET: ', e);
				setLoading(false);
				dropDownAlertRef.current.alertWithType('error', 'Error', e.message);
				return true;
			});
	};

	submit.current = () => {
		//apiCallEdit(formState);
		btnGuardar();
	};

	setMunicipio = (item) => {
		console.log('=>Ins Muni: ', item);
		setMunicipioGrupo(item);
	};

	setColonia = (item) => {
		console.log('=> Colonia: ', item);
		setComercio({ ...comercio, Colonia: item.d_asenta, CP: item.d_codigo });
	};

	setMaps = (item) => {
		console.log('=> Set Maps:', item);
	};

	setPersona = (item) => {
		console.log('=> Selecciono: ', item);

		const FF = item.FECHA_NA_B.toString();
		console.log('==>', FF.substring(0, 4) + '-' + FF.substring(4, 6) + '-' + FF.substring(6, 8));

		setComercio({
			...comercio,
			ClaveUnica: item.INE,
			Nombres: item.NOMBRE,
			Paterno: item.APELLIDO_P,
			Materno: item.APELLIDO_M,
			Colonia: item.COLONIA,
			Calle: item.CALLE,
			Sexo: item.SEXO,
			NumExt: item.NUM_EXTERI,
			NumInt: item.NUM_INTERI,
			CP: item.CODIGO_POS,
			SeccionVota: item.SECCION,
			FechaNacimiento: FF.substring(0, 4) + '-' + FF.substring(4, 6) + '-' + FF.substring(6, 8)
		});
		setMunicipioGrupo({ id: item.idMunicipio, Clave: item.Clave, Municipio: item.Municipio });
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.scrollView}>
				<Card title="Datos del Solicitante">
					<View style={styles.rowColumn}>
						<View style={{ flex: 1, flexDirection: 'row' }}>
							<Text style={{ color: 'red' }}>*</Text>
							<Text>Clave única</Text>
						</View>

						{!loading && (
							<Input
								placeholder="ClaveUnica"
								value={comercio.ClaveUnica}
								autoCapitalize="characters"
								maxLength={18}
								onChangeText={(text) => setComercio({ ...comercio, ClaveUnica: text })}
								rightIcon={
									<FontAwesome5
										name="search-location"
										size={24}
										color="black"
										onPress={() =>
											navigation.navigate('getCarnita', {
												setPersona
											})}
									/>
								}
							/>
						)}
						{loading && <ActivityIndicator size="large" color="#0000ff" />}
					</View>
					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
						<View style={{ width: '100%' }}>
							<View style={{ flex: 1, flexDirection: 'row' }}>
								<Text style={{ color: 'red' }}>*</Text>
								<Text>Nombre</Text>
							</View>
							<Input
								placeholder="Nombre"
								value={comercio.Nombres}
								onChangeText={(text) => setComercio({ ...comercio, Nombres: text })}
							/>
						</View>
					</View>
					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
						<View style={{ width: '50%' }}>
							<View style={{ flex: 1, flexDirection: 'row' }}>
								<Text style={{ color: 'red' }}>*</Text>
								<Text>Paterno</Text>
							</View>
							<Input
								placeholder="Apellido"
								value={comercio.Paterno}
								onChangeText={(text) => setComercio({ ...comercio, Paterno: text })}
							/>
						</View>
						<View style={{ width: '50%' }}>
							<View style={{ flex: 1, flexDirection: 'row' }}>
								<Text style={{ color: 'red' }}>*</Text>
								<Text>Materno</Text>
							</View>
							<Input
								placeholder="Apellido"
								value={comercio.Materno}
								onChangeText={(text) => setComercio({ ...comercio, Materno: text })}
							/>
						</View>
					</View>
					<View style={[ styles.rowColumn, { flexDirection: 'row' } ]}>
						<CheckBox
							center
							title="Masculino"
							iconRight
							iconType="material"
							checkedIcon="check"
							uncheckedIcon="add"
							checkedColor="green"
							onPress={() => setComercio({ ...comercio, Sexo: 'H' })}
							checked={comercio.Sexo == 'H'}
						/>
						<CheckBox
							center
							title="Femenino"
							iconRight
							iconType="material"
							checkedIcon="check"
							uncheckedIcon="add"
							checkedColor="green"
							onPress={() => setComercio({ ...comercio, Sexo: 'M' })}
							checked={comercio.Sexo == 'M'}
						/>
					</View>
					<View style={styles.rowColumn}>
						<View style={{ flex: 1, flexDirection: 'row' }}>
							<Text style={{ color: 'red' }}>*</Text>
							<Text>Fecha Nacimiento</Text>
						</View>
						<DatePicker
							style={{ width: 200 }}
							date={comercio.FechaNacimiento}
							mode="date"
							placeholder="Seleccione Fecha"
							format="YYYY-MM-DD"
							minDate="1900-01-01"
							maxDate="2003-12-31"
							confirmBtnText="Confirm"
							cancelBtnText="Cancel"
							customStyles={{
								dateIcon: {
									position: 'absolute',
									left: 0,
									top: 4,
									marginLeft: 0
								},
								dateInput: {
									marginLeft: 36
								}
								// ... You can check the source to find the other keys.
							}}
							onDateChange={(date) => setComercio({ ...comercio, FechaNacimiento: date })}
						/>
					</View>

					<View style={styles.rowColumn}>
						<Text style={{ alignSelf: 'center', fontWeight: 'bold' }}>Datos de ubicación Geográfica</Text>
					</View>
					<View style={styles.rowColumn}>
						<View style={{ flex: 1, flexDirection: 'row' }}>
							<Text style={{ color: 'red' }}>*</Text>
							<Text>Municipio</Text>
						</View>
						<Input
							placeholder="Municipio"
							value={municipio.Municipio}
							disabled
							leftIcon={
								<FontAwesome5
									name="search-location"
									size={24}
									color="black"
									onPress={() =>
										navigation.navigate('CatMunicipios', {
											setMunicipio,
											municipio
										})}
								/>
							}
						/>
					</View>

					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
						<View style={{ width: '100%' }}>
							<View style={{ flex: 1, flexDirection: 'row' }}>
								<Text style={{ color: 'red' }}>*</Text>
								<Text>Calle</Text>
							</View>
							<Input
								placeholder="Calle"
								value={comercio.Calle}
								onChangeText={(text) => setComercio({ ...comercio, Calle: text })}
							/>
						</View>
					</View>
					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
						<View style={{ width: '50%' }}>
							<View style={{ flex: 1, flexDirection: 'row' }}>
								<Text style={{ color: 'red' }}>*</Text>
								<Text>NumExt</Text>
							</View>
							<Input
								placeholder="Num Exterior"
								value={comercio.NumExt}
								onChangeText={(text) => setComercio({ ...comercio, NumExt: text })}
							/>
						</View>
						<View style={{ width: '50%' }}>
							<Text>NumInt</Text>
							<Input
								placeholder="Num Interior"
								value={comercio.NumInt}
								onChangeText={(text) => setComercio({ ...comercio, NumInt: text })}
							/>
						</View>
					</View>
					<View style={styles.rowColumn}>
						<Text>Seleccione Colonia</Text>
						<Input
							placeholder="Colonia"
							value={comercio.Colonia}
							onChangeText={(text) => setComercio({ ...comercio, Colonia: text })}
							leftIcon={
								<FontAwesome5
									name="search-location"
									size={24}
									color="black"
									onPress={() =>
										navigation.navigate('catColonia', {
											setColonia,
											municipio,
											cp
										})}
								/>
							}
						/>
					</View>
					<View style={{ width: '50%' }}>
						<Text>CP</Text>
						<Input
							placeholder="CP"
							keyboardType="number-pad"
							value={`${comercio.CP}`}
							onChangeText={(text) => setComercio({ ...comercio, CP: text })}
						/>
					</View>
					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
						<View style={{ width: '50%' }}>
							<View style={{ flex: 1, flexDirection: 'row' }}>
								<Text style={{ color: 'red' }}>*</Text>
								<Text>Latitude</Text>
							</View>
							<Input
								placeholder="Latitude"
								value={`${comercio.Latitude}`}
								onChangeText={(text) => setComercio({ ...comercio, Latitude: text })}
							/>
						</View>
						<View style={{ width: '50%' }}>
							<View style={{ flex: 1, flexDirection: 'row' }}>
								<Text style={{ color: 'red' }}>*</Text>
								<Text>Longitude</Text>
							</View>
							<Input
								placeholder="Longitude"
								value={`${comercio.Longitude}`}
								onChangeText={(text) => setComercio({ ...comercio, Longitude: text })}
							/>
						</View>
					</View>
					<View style={{ width: '50%' }}>
						<Text>Sección</Text>
						<Input
							placeholder="Seccion"
							keyboardType="number-pad"
							maxLength={5}
							value={`${comercio.SeccionVota}`}
							onChangeText={(text) => setComercio({ ...comercio, SeccionVota: text })}
						/>
					</View>
				</Card>

				<Card title="Datos de Contacto">
					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
						<View style={{ width: '50%' }}>
							<Text>Teléfono Fijo</Text>
							<Input
								placeholder="Teléfono"
								value={comercio.TelFijo}
								maxLength={10}
								onChangeText={(text) => setComercio({ ...comercio, TelFijo: text })}
							/>
						</View>
						<View style={{ width: '50%' }}>
							<Text>Tel Recados</Text>
							<Input
								placeholder="Teléfono"
								value={comercio.TelRecados}
								maxLength={10}
								onChangeText={(text) => setComercio({ ...comercio, TelRecados: text })}
							/>
						</View>
					</View>
					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
						<View style={{ width: '50%' }}>
							<Text>Celular</Text>
							<Input
								placeholder="Teléfono"
								value={comercio.TelCelular}
								maxLength={10}
								onChangeText={(text) => setComercio({ ...comercio, TelCelular: text })}
							/>
						</View>
					</View>
				</Card>
				<Card title="Información Adicional">
					<Text>Desea ser voluntario?</Text>
					<View style={[ styles.rowColumn, { flexDirection: 'row' } ]}>
						<CheckBox
							center
							title="Si"
							iconRight
							iconType="material"
							checkedIcon="check"
							uncheckedIcon="add"
							checkedColor="green"
							onPress={() => setComercio({ ...comercio, isVoluntario: 1 })}
							checked={comercio.isVoluntario == 1}
						/>
						<CheckBox
							center
							title="No"
							iconRight
							iconType="material"
							checkedIcon="check"
							uncheckedIcon="add"
							checkedColor="green"
							onPress={() => setComercio({ ...comercio, isVoluntario: 0 })}
							checked={comercio.isVoluntario == 0}
						/>
					</View>
					<Text>Tiene Experiencia electoral?</Text>
					<View style={[ styles.rowColumn, { flexDirection: 'row' } ]}>
						<CheckBox
							center
							title="Si"
							iconRight
							iconType="material"
							checkedIcon="check"
							uncheckedIcon="add"
							checkedColor="green"
							onPress={() => setComercio({ ...comercio, ExperienciaElectoral: 1 })}
							checked={comercio.ExperienciaElectoral == 1}
						/>
						<CheckBox
							center
							title="No"
							iconRight
							iconType="material"
							checkedIcon="check"
							uncheckedIcon="add"
							checkedColor="green"
							onPress={() => setComercio({ ...comercio, ExperienciaElectoral: 0 })}
							checked={comercio.ExperienciaElectoral == 0}
						/>
					</View>
				</Card>
				<ConfirmDialog
					visible={showFolio}
					title="Registro Exitoso!"
					onTouchOutside={() => setShowFolio(false)}
					positiveButton={{
						title: 'OK',
						onPress: () => btnShowFolio()
					}}
				>
					<View style={{ alignSelf: 'center' }}>
						<Text>Tu Folio es:</Text>
						<Text style={{ color: 'red' }}>{itemSave.ClaveUnica}</Text>
					</View>
				</ConfirmDialog>
			</ScrollView>
			<DropdownAlert ref={dropDownAlertRef} />
		</SafeAreaView>
	);
});
