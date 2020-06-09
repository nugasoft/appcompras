import React, { useContext, useState, useEffect, useRef } from 'react';
import { KeyboardAvoidingView, ActivityIndicator, View, Button, TouchableHighlight } from 'react-native';
import { Text, Tile, Avatar, Card, CheckBox, Input, Slider } from 'react-native-elements';
import DropdownAlert from 'react-native-dropdownalert';
import { Ionicons, FontAwesome, FontAwesome5, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Center } from '../components/Center';
import { RowPersona } from '../components/RowPersona';
import { AuthContext } from '../AuthProvider';
import { calcularEdad } from '../components/funciones';

import styles from './styles';

export default RegistroUsers = ({ route, navigation }) => {
	const { user } = useContext(AuthContext);
	const [formState] = useState();
	const [persona, setPersonaGrupo] = useState({
		id: null,
		CURP: '',
		NombreC: '',
		PaternoC: '',
		MaternoC: '',
		FechaNacimientoC: '',
		SexoC: '',
		EntidadNacimientoC: '',
		CalleC: '',
		NumeroC: '',
		NumeroInteriorC: '',
		ColoniaC: '',
		idMunicipioC: '',
		MunicipioC: '',
		idLocalidadC: '',
		NumeroLocalidad: '',
		Localidad: '',
		CodigoPostalC: '',
		FolioC: '',
		EstatusExpediente: '',
	});
	const [tarjeta, setTarjeta] = useState('');
	const [loading, setLoading] = useState(false);
	const submit = useRef(() => {});

	useEffect(() => {
		navigation.setParams({ submit });
	}, []);

	useEffect(() => {
		console.log('=>DataFiltro: ', persona);
	}, [persona]);

	submit.current = () => {
		btnAsignarTarjeta();
	};

	btnAsignarTarjeta = () => {
		if (!persona.id) {
			console.log('Nombre requerido');
			this.dropDownAlertRef.alertWithType('error', 'Error', 'Haga click en el icono para selccionar persona.');
			return true;
		}
		if (tarjeta.length !== 4) {
			console.log('tarjeta requerido');
			this.dropDownAlertRef.alertWithType('error', 'Error', 'Falta terminación tarjeta');
			return true;
		}
		console.log('=>Guardar');
		setLoading(true);

		const data = {
			Terminacion: tarjeta,
			id: persona.id,
			CURP: persona.CURP,
			Nombre: persona.NombreC,
			Paterno: persona.PaternoC,
			Materno: persona.MaternoC,
			idMunicipio: persona.idMunicipioC,
			idLocalidad: persona.idLocalidadC,
			Calle: persona.CalleC,
			NumExt: persona.NumExtC,
			NumInt: persona.NumIntC,
			Colonia: persona.ColoniaC,
			CP: persona.CodigoPostalC,
			TipoGral: persona.TipoGral,
			idGrupo: route.params.item.id,
		};
		var requestInfo = {
			method: 'POST',
			body: JSON.stringify(data),
			headers: new Headers({
				'Content-Type': 'application/json',
				Authorization: 'bearer ' + user.token,
			}),
		};

		console.log('=>Envio de parametros a setTarjetaAsignadaET: ', data);

		fetch('https://apicovid.chiapasavanza.com/api/setTarjetaAsignadaET', requestInfo)
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				throw new Error('setTarjetaAsignadaET error: ', response);
			})
			.then((dataRS) => {
				setLoading(false);
				if (dataRS.success) {
					if (dataRS.results) {
						console.log('=>Insert setTarjetaAsignadaET: ', dataRS);
						route.params.refreshData();
						navigation.goBack();
					} else {
						console.log('=>Error Results Insert setTarjetaAsignadaET: ', dataRS);

						if (dataRS.error) {
							if (dataRS.error.Terminacion) {
								if (dataRS.error.Terminacion[0] === 'The terminacion field is required.')
									this.dropDownAlertRef.alertWithType(
										'error',
										'Error',
										'El campo Terminación es requerido.'
									);

								if (dataRS.error.Terminacion[0] === 'The terminacion has already been taken.')
									this.dropDownAlertRef.alertWithType(
										'error',
										'Error',
										'El campo Terminación es requerido.'
									);
							}
						} else if (dataRS.errors) {
							this.dropDownAlertRef.alertWithType('error', 'Error', dataRS.errors);
						}
					}
				} else {
					console.log('=>Error Success Insert setTarjetaAsignadaET: ', dataRS);
					if (dataRS.errors) {
						if (dataRS.errors.Terminacion) {
							if (dataRS.errors.Terminacion[0] === 'The terminacion field is required.')
								this.dropDownAlertRef.alertWithType(
									'error',
									'Error',
									'El campo Terminación es requerido.'
								);

							if (dataRS.errors.Terminacion[0] === 'The terminacion has already been taken.')
								this.dropDownAlertRef.alertWithType(
									'error',
									'Error',
									'El campo Terminación es requerido.'
								);
						} else {
							console.log('=>No hayTerminacion');
						}
					} else {
						console.log('=> No hay erros');
						this.dropDownAlertRef.alertWithType('error', 'Error', dataRS.errors);
					}
					return true;
				}
			})
			.catch((e) => {
				console.log('==>Error en setGrupoET: ', e);
				this.dropDownAlertRef.alertWithType('error', 'Error', e.message);
				setLoading(false);
				return true;
			});
	};

	setPersona = (persona) => {
		setPersonaGrupo(persona);
	};

	return (
		<View>
			<KeyboardAvoidingView behavior="padding" enabled>
				<Card title={`Grupo ${route.params.item.id} ${route.params.item.Municipio} `}></Card>
				<TouchableHighlight
					onPress={() =>
						navigation.navigate('Personas', {
							item: route.params.item,
							setPersona,
						})
					}
				>
					<Card
						title={
							persona.id
								? `${persona.NombreC} ${persona.PaternoC} ${persona.MaternoC}`
								: 'Click para seleccionar'
						}
					>
						<Text>Seleccione a una persona </Text>
						<Input
							placeholder="Persona"
							value={`${persona.NombreC} ${persona.PaternoC} ${persona.MaternoC}`}
							disabled
							leftIcon={<MaterialCommunityIcons name="account-search" size={24} color="black" />}
						/>
					</Card>
				</TouchableHighlight>
				<Card title="Terminación Tarjeta">
					<Input
						placeholder="Terminación Tarjeta"
						value={`${tarjeta}`}
						onChangeText={(text) => setTarjeta(text)}
						leftIcon={<FontAwesome name="credit-card" size={24} color="black" />}
					/>
				</Card>
				{!loading && <Button title="Asignar" onPress={btnAsignarTarjeta} />}
				{loading && <ActivityIndicator size="large" />}
			</KeyboardAvoidingView>
			<DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} />
		</View>
	);
};
