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
import { ListItem, SearchBar, Text, Tile, Avatar, Card, CheckBox, Input, Slider } from 'react-native-elements';

import { Ionicons, FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Center } from '../components/Center';
import { calcularEdad } from '../components/funciones';
import { AuthContext } from '../AuthProvider';

import styles from './styles';

export default (catColonia = ({ route, navigation }) => {
	const { user } = useContext(AuthContext);
	const [ catmuni, setCatMuni ] = useState({ data: [], total: 0 });
	const [ catmuniFiltro, setCatMuniFiltro ] = useState({ total: 0, data: [] });
	const [ search, setSearch ] = useState('');
	const [ dataSearch, setDataSearch ] = useState('');
	const [ extraData, setExtraData ] = useState(false);
	const [ refreshing, setRefreshing ] = useState(false);
	const [ firstItem, setFirstItem ] = useState(true);
	const [ dataPage, setDataPage ] = useState({ page: 0, pageSize: 100, maxPage: 1 });

	useEffect(
		() => {
			var data = {};
			setRefreshing(true);
			setExtraData(!extraData);
			setFirstItem(true);
			setDataPage({ page: 0, pageSize: 10, maxPage: 1 });

			console.log('==>params: ', route.params);

			if (search) {
				data = {
					page: 0,
					tipo: 'and',
					pageSize: dataPage.pageSize,
					sorted: [ { id: 'd_asenta', desc: false } ],
					filtered: [
						{ id: 'd_asenta', value: search },
						{ id: 'c_mnpio', value: route.params.municipio.Clave }
					]
				};
			} else {
				data = {
					page: 0,
					tipo: 'and',
					pageSize: dataPage.pageSize,
					sorted: [ { id: 'd_asenta', desc: false } ],
					filtered: [ { id: 'c_mnpio', value: route.params.municipio.Clave } ]
				};
			}

			console.log('=>>data getCP: ', data);

			var requestInfo = {
				method: 'POST',
				body: JSON.stringify(data),
				headers: new Headers({
					'Content-Type': 'application/json',
					Authorization: 'bearer ' + user.token
				})
			};

			fetch('https://api.chiapasavanza.com/api/getCP', requestInfo)
				.then((response) => {
					if (response.ok) {
						return response.json();
					}
					throw new Error('Ocurrio un error: ', response.statusText);
				})
				.then((dataRS) => {
					console.log('=>getCP RS: ', dataRS);
					setRefreshing(false);

					if (dataRS.results) {
						//setGrupos({ ...grupos, data: dataRS.data, total: dataRS.total });
						setCatMuniFiltro({ total: dataRS.total, data: dataRS.data });
						setDataPage({ ...dataPage, page: 0, maxPage: dataRS.total / dataPage.pageSize });
						console.log('=> Quedo en ceros');
					}
				})
				.catch((e) => {
					console.log('==>Error Grupos: ', e);
					setRefreshing(false);
				});
		},
		[ search ]
	);

	searchDataApi = () => {
		console.log('=> Engtro DataSearch');
		var data = {};
		setRefreshing(true);
		setExtraData(!extraData);

		if (search) {
			data = {
				page: dataPage.page,
				tipo: 'and',
				pageSize: dataPage.pageSize,
				sorted: [ { id: 'd_asenta', desc: false } ],
				filtered: [ { id: 'd_asenta', value: search }, { id: 'c_mnpio', value: route.params.municipio.Clave } ]
			};
		} else {
			data = {
				page: dataPage.page,
				tipo: 'and',
				pageSize: dataPage.pageSize,
				sorted: [ { id: 'd_asenta', desc: false } ],
				filtered: [ { id: 'c_mnpio', value: route.params.municipio.Clave } ]
			};
		}

		console.log('=>>data To getCP: ', data);

		var requestInfo = {
			method: 'POST',
			body: JSON.stringify(data),
			headers: new Headers({
				'Content-Type': 'application/json',
				Authorization: 'bearer ' + user.token
			})
		};

		fetch('https://api.chiapasavanza.com/api/getCP', requestInfo)
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				throw new Error('Ocurrio un error: ', response.statusText);
			})
			.then((dataRS) => {
				console.log('=>getCP RS: ', dataRS);
				setRefreshing(false);
				if (dataRS.results) {
					setCatMuni({ ...catmuni, data: dataRS.data, total: dataRS.total });
					setCatMuniFiltro({ total: dataRS.total, data: catmuniFiltro.data.concat(dataRS.data) });
					setDataPage({ ...dataPage, page: dataPage.page + 1, maxPage: dataRS.total / dataPage.pageSize });
				}
			})
			.catch((e) => {
				console.log('==>Error Grupos: ', e);
				setRefreshing(false);
			});
	};

	btnSeleccionar = (item) => {
		console.log('=Item setComercio: ', item);
		route.params.setColonia(item);
		navigation.goBack();
	};

	rowItem = (item) => {
		return <ListItem title={item.d_asenta} bottomDivider chevron onPress={() => btnSeleccionar(item)} />;
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
		if (!firstItem) {
			if (!refreshing) {
				console.log('Es el fin del scroll: ', dataPage);

				if (dataPage.maxPage > dataPage.page) {
					console.log('=>Page: ', dataPage);
					searchDataApi();
				} else {
					console.log('=> Ya no mas registros');
				}
			}
		} else {
			setFirstItem(false);
		}
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
			<Input
				placeholder="Buscar colonia..."
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
			<Text>
				Mostrando {catmuniFiltro.data.length} de {catmuniFiltro.total}
			</Text>
			<FlatList
				onEndReached={onEndReached}
				onEndReachedThreshold={0.1}
				ListFooterComponent={renderFooter}
				refreshing={refreshing}
				extraData={extraData}
				style={{ width: '100%' }}
				renderItem={({ item }) => {
					return rowItem(item);
				}}
				keyExtractor={(item, index) => index.toString()}
				data={catmuniFiltro.data}
				ListHeaderComponent={() =>
					!catmuniFiltro.data.length ? (
						<Text style={styles.emptyMessageStyle}>No hay información</Text>
					) : null}
			/>
		</Center>
	);
});
