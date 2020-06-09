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
	Picker,
} from 'react-native';
import { SearchBar, Text, Tile, Avatar, Card, CheckBox, Input, Slider } from 'react-native-elements';

import { Ionicons, FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Center } from '../components/Center';
import { calcularEdad } from '../components/funciones';
import { AuthContext } from '../AuthProvider';
import dataPersonas from '../../data/personas.json';

import styles from './styles';

export default PersonasBuscar = ({ navigation }) => {
	const { user } = useContext(AuthContext);
	const [personas, setPersonas] = useState({ data: [], total: 0 });
	const [personasFiltro, setPersonasFiltro] = useState([]);
	const [search, setSearch] = useState('');
	const [extraData, setExtraData] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [dataPage, setDataPage] = useState({ page: 0, pageSize: 100, maxPage: 1 });

	useEffect(() => {
		console.log('Init Bucar Personas search: ', search);
		console.log('Init Bucar Personas dataPage: ', dataPage);
		console.log('Init Bucar Personas: ', personas);
		console.log('Init Bucar personasFiltro: ', personasFiltro);

		var data = {};

		console.log('=> Search PErsonas: '.search);

		if (search) {
			data = {
				page: dataPage.page,
				tipo: 'or',
				pageSize: dataPage.pageSize,
				sorted: [],
				filtered: [
					{ id: 'personas.Nombre', value: search },
					{ id: 'personas.Paterno', value: search },
					{ id: 'personas.Materno', value: search },
					{ id: 'cat_municipio.Municipio', value: search },
					{ id: 'personas.Colonia', value: search },
				],
			};
		} else {
			data = {
				page: dataPage.page,
				tipo: 'and',
				pageSize: dataPage.pageSize,
				sorted: [],
				filtered: [],
			};
		}

		console.log('=>>data To Filtro: ', data);

		var requestInfo = {
			method: 'POST',
			body: JSON.stringify(data),
			headers: new Headers({
				'Content-Type': 'application/json',
				Authorization: 'bearer ' + user.token,
			}),
		};

		fetch('https://apicovid.chiapasavanza.com/api/getPersonas', requestInfo)
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				throw new Error(`Ocurrio un error: ${api}: ${response.statusText}`);
			})
			.then((dataRS) => {
				console.log('=>PErsonas RS: ', dataRS);
				setPersonas({ ...personas, data: dataRS.data, total: dataRS.total });
				setPersonasFiltro(dataRS.data);
				setDataPage({ ...dataPage, maxPage: dataRS.total / dataPage.pageSize });
			})
			.catch((e) => {
				console.log('==>Error: ', e);
			});
	}, [search]);

	rowItem = (item) => {
		return (
			<TouchableHighlight key={`${item.id}`}>
				<Card key={`${item.id}`} title={`${item.Nombre} ${item.Paterno} ${item.Materno}`}>
					<View style={styles.rowDeep}>
						<View>
							{item.Sexo == 'F' ? (
								<Avatar
									overlayContainerStyle={{ backgroundColor: '#de40b8' }}
									rounded
									title={item.Sexo}
								/>
							) : (
								<Avatar
									overlayContainerStyle={{ backgroundColor: '#40b8de' }}
									rounded
									title={item.Sexo}
								/>
							)}
							<Text style={{ fontWeight: 'bold' }}>{`${calcularEdad(item.FechaNacimiento)} años`}</Text>
						</View>

						<View
							style={{
								flex: 1,
								flexDirection: 'column',
								justifyContent: 'space-around',
								marginHorizontal: 5,
							}}
						>
							<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5 }}>
								<Text style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>FechaNacimiento:</Text>
								<Text style={{ fontWeight: 'bold' }}> {`${item.FechaNacimiento}`}</Text>
							</View>
							<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5 }}>
								<Text style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>CURP:</Text>
								<Text style={{ fontWeight: 'bold' }}> {`${item.CURP}`}</Text>
							</View>
							<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5 }}>
								<Text style={{ fontWeight: 'bold' }}>
									{' '}
									{`${item.Calle} Num.${item.NumExt} ${item.NumInt ? 'Int.' + item.NumInt : ''}`}
								</Text>
							</View>
							<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5 }}>
								<Text style={{ fontWeight: 'bold' }}> {`${item.Colonia}`}</Text>
							</View>
							<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5 }}>
								<Text style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>Mun.:</Text>
								<Text style={{ color: 'red', fontWeight: 'bold' }}>
									{' '}
									{`${item.idMunicipio.Municipio}`}
								</Text>
							</View>
							<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5 }}>
								<Text style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>Loc.:</Text>
								<Text style={{ fontWeight: 'bold' }}> {`${item.idLocalidad.nom_loc}`}</Text>
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
		/*
    const newData =personasFiltro.filter(item => {      
      const itemData = `${item.Nombre.toUpperCase()}   
      ${item.Paterno.toUpperCase()} ${item.Materno.toUpperCase()} ${item.Colonia.toUpperCase()} ${item.Calle.toUpperCase()} ${item.idMunicipio.Municipio.toUpperCase()}`;
      
       const textData = text.toUpperCase();
        
       return itemData.indexOf(textData) > -1;   

    });

    console.log('newData: ', newData)
    
    setPersonasFiltro(newData);  
            */
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
			<SearchBar
				autoCorrect={false}
				onClear={onClearSearch}
				round
				lightTheme
				inputContainerStyle={{ width: '100%' }}
				placeholder="Buscar..."
				onChangeText={updateSearch}
				value={search}
			/>
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
					!personasFiltro.length ? <Text style={styles.emptyMessageStyle}>No hay información</Text> : null
				}
			/>
		</Center>
	);
};
