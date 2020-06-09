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
import { SearchBar, Text, Tile, Avatar, Card, CheckBox, Input, ListItem } from 'react-native-elements';

import { Ionicons, FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Center } from '../components/Center';
import { calcularEdad } from '../components/funciones';
import { AuthContext } from '../AuthProvider';

import styles from './styles';

export default (CatMunicipios = ({ route, navigation }) => {
	const { user } = useContext(AuthContext);
	const [ catmuni, setCatMuni ] = useState({ data: [], total: 0 });
	const [ catmuniFiltro, setCatMuniFiltro ] = useState([]);
	const [ search, setSearch ] = useState('');
	const [ extraData, setExtraData ] = useState(false);
	const [ refreshing, setRefreshing ] = useState(false);
	const [ dataPage, setDataPage ] = useState({ page: 0, pageSize: 10, maxPage: 1 });

	useEffect(
		() => {
			var data = {};

			console.log('=> Search Municipio: '.search);

			if (search) {
				data = {
					page: dataPage.page,
					tipo: 'or',
					pageSize: dataPage.pageSize,
					sorted: [],
					filtered: [
						{
							id: 'Nombre',
							value: search
						}
					]
				};
			} else {
				data = {
					page: dataPage.page,
					tipo: 'and',
					pageSize: dataPage.pageSize,
					sorted: [],
					filtered: []
				};
			}

			console.log('=>>data To Municipio: ', data);

			var requestInfo = {
				method: 'POST',
				body: JSON.stringify(data),
				headers: new Headers({
					'Content-Type': 'application/json',
					Authorization: 'bearer ' + user.token
				})
			};

			fetch('https://api.chiapasavanza.com/api/getCatMunicipios', requestInfo)
				.then((response) => {
					if (response.ok) {
						return response.json();
					}
					throw new Error(`Ocurrio un error: ${response.statusText}`);
				})
				.then((dataRS) => {
					console.log('=>getCatMunicipiosRS: ', dataRS);
					setCatMuni({ ...catmuni, data: dataRS.data, total: dataRS.total });
					setCatMuniFiltro(dataRS.data);
					setDataPage({ ...dataPage, maxPage: dataRS.total / dataPage.pageSize });
				})
				.catch((e) => {
					console.log('==>Error en getMunicipiosET: ', e);
				});
		},
		[ search ]
	);

	btnSeleccionar = (item) => {
		console.log('=Item Municipio: ', item);
		route.params.setMunicipio(item);
		navigation.goBack();
	};

	rowItem = (item) => {
		return route.params.municipio.id === item.id ? (
			<ListItem
				title={item.Municipio}
				bottomDivider
				chevron
				rightAvatar={<Avatar rounded icon={{ name: 'check' }} />}
				onPress={() => btnSeleccionar(item)}
			/>
		) : (
			<ListItem title={item.Municipio} bottomDivider chevron onPress={() => btnSeleccionar(item)} />
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
    
    catmuniFiltro(newData);  
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
			<Text>
				Mostrando {catmuniFiltro.length} de {catmuni.total}
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
				keyExtractor={(item, index) => index.toString()}
				data={catmuniFiltro}
				ListHeaderComponent={() =>
					!catmuniFiltro.length ? <Text style={styles.emptyMessageStyle}>No hay información</Text> : null}
			/>
		</Center>
	);
});
