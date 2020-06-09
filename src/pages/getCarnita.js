import React, { useContext, useState, useEffect, useRef } from 'react';
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	ScrollView,
	StyleSheet,
	View,
	Button,
	FlatList,
	TouchableHighlight,
	Picker
} from 'react-native';
import { SearchBar, Text, Tile, Avatar, Card, CheckBox, Input, Slider } from 'react-native-elements';

import { Ionicons, FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Center } from '../components/Center';
import { calcularEdad } from '../components/funciones';
import { AuthContext } from '../AuthProvider';
import dataPersonas from '../../data/personas.json';

import styles from './styles';

export default (getCarnita = ({ route, navigation }) => {
	const { user, logout } = useContext(AuthContext);
	const [ personas, setPersonas ] = useState({ data: [], total: 0 });
	const [ personasFiltro, setPersonasFiltro ] = useState([]);
	const [ search, setSearch ] = useState('');
	const [ dataSearch, setDataSearch ] = useState('');
	const [ extraData, setExtraData ] = useState(false);
	const [ refreshing, setRefreshing ] = useState(false);
	const [ dataPage, setDataPage ] = useState({ page: 0, pageSize: 100, maxPage: 1 });

	useEffect(
		() => {
			var data = {};

			console.log('=> Search getCarnita: '.search);

			if (search) {
				setRefreshing(true);

				data = {
					page: dataPage.page,
					tipo: 'and',
					NombreCompleto: search,
					pageSize: dataPage.pageSize,
					sorted: [],
					filtered: []
				};

				var requestInfo = {
					method: 'POST',
					body: JSON.stringify(data),
					headers: new Headers({
						'Content-Type': 'application/json',
						Authorization: 'bearer ' + user.token
					})
				};

				fetch('https://api.chiapasavanza.com/api/getCarnita', requestInfo)
					.then((response) => {
						console.log('error: ', response);
						if (response.ok) {
							return response.json();
						}
						throw new Error(response);
					})
					.then((dataRS) => {
						console.log('=>PErsonas RS: ', dataRS);
						setRefreshing(false);
						setPersonas({ ...personas, data: dataRS.data, total: dataRS.total });
						setPersonasFiltro(dataRS.data);
						setDataPage({ ...dataPage, maxPage: dataRS.total / dataPage.pageSize });
					})
					.catch((e) => {
						console.log(e);
						logout();
						setRefreshing(false);
					});
			}
			console.log('=>>data getCarnita: ', data);
		},
		[ search ]
	);

	btnSeleccionar = (item) => {
		console.log('=Item Carnita: ', item);
		route.params.setPersona(item);
		navigation.goBack();
	};

	rowItem = (item) => {
		return (
			<TouchableHighlight key={`${item.INE}`} onPress={() => btnSeleccionar(item)}>
				<Card key={`${item.INE}`} title={`${item.NombreCompleto}`}>
					<View style={styles.rowDeep}>
						<View>
							{item.SEXO == 'M' ? (
								<Avatar
									overlayContainerStyle={{ backgroundColor: '#de40b8' }}
									rounded
									title={item.SEXO}
								/>
							) : (
								<Avatar
									overlayContainerStyle={{ backgroundColor: '#40b8de' }}
									rounded
									title={item.SEXO}
								/>
							)}
						</View>

						<View
							style={{
								flex: 1,
								flexDirection: 'column',
								justifyContent: 'space-around',
								marginHorizontal: 5
							}}
						>
							<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5 }}>
								<Text style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>FechaNacimiento:</Text>
								<Text style={{ fontWeight: 'bold' }}> {`${item.FECHA_NA_B}`}</Text>
							</View>
							<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5 }}>
								<Text style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>Clave Única:</Text>
								<Text style={{ fontWeight: 'bold' }}> {`${item.INE}`}</Text>
							</View>
							<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5 }}>
								<Text style={{ fontWeight: 'bold' }}>
									{' '}
									{`${item.CALLE} Num.${item.NUM_EXTERI} ${item.NUM_INTERI
										? 'Int.' + item.NUM_INTERI
										: ''}`}
								</Text>
							</View>
							<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5 }}>
								<Text style={{ fontWeight: 'bold' }}> {`${item.COLONIA}`}</Text>
							</View>
							<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5 }}>
								<Text style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>Mun.:</Text>
								<Text style={{ color: 'red', fontWeight: 'bold' }}> {`${item.Municipio}`}</Text>
							</View>
							<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5 }}>
								<Text style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>Sección.:</Text>
								<Text style={{ fontWeight: 'bold' }}> {`${item.SECCION}`}</Text>
							</View>
						</View>
					</View>
				</Card>
			</TouchableHighlight>
		);
	};

	updateSearch = (text) => {
		console.log('=>Buscar: ', search);
		setSearch(text);
		setExtraData(!extraData);
		return true;
	};

	onClearSearch = () => {
		console.log('=>Se borro el search');
	};

	onEndReached = () => {
		console.log('Es el fin del scroll');
	};

	renderFooter = () => {
		if (refreshing) {
			return <ActivityIndicator size="large" />;
		} else {
			return null;
		}
	};

	return (
		<Center>
			<View style={{ width: '100%', justifyContent: 'center', margin: 5 }}>
				{!refreshing && (
					<Input
						placeholder="Buscar municipio..."
						value={dataSearch}
						onChangeText={(text) => setDataSearch(text)}
						onSubmitEditing={() => setSearch(dataSearch)}
						rightIcon={
							<MaterialCommunityIcons
								name="account-search"
								size={35}
								color="black"
								onPress={() => setSearch(dataSearch)}
							/>
						}
					/>
				)}
				{refreshing && <ActivityIndicator size="large" color="#0000ff" />}
			</View>
			<Text>
				Mostrando {personasFiltro.length} de {personas.total}
			</Text>
			<FlatList
				onEndReached={onEndReached}
				onEndReachedThreshold={0.1}
				ListFooterComponent={renderFooter}
				extraData={extraData}
				style={{ width: '100%' }}
				renderItem={({ item }) => {
					return rowItem(item);
				}}
				keyExtractor={(item) => item.id}
				data={personasFiltro}
				ListHeaderComponent={() =>
					!personasFiltro.length ? <Text style={styles.emptyMessageStyle}>No hay información</Text> : null}
			/>
		</Center>
	);
});
