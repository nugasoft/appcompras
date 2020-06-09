import React, { useContext, useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { ListItem, Text, Avatar, Input } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Center } from '../components/Center';
import { AuthContext } from '../AuthProvider';

import styles from './styles';

export default catLocalidades = ({ route, navigation }) => {
	const { user } = useContext(AuthContext);
	const [catmuni, setCatMuni] = useState({ data: [], total: 0 });
	const [catmuniFiltro, setCatMuniFiltro] = useState({ data: [], total: 1 });
	const [search, setSearch] = useState('');
	const [dataSearch, setDataSearch] = useState('');
	const [extraData, setExtraData] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [firstItem, setFirstItem] = useState(true);
	const [dataPage, setDataPage] = useState({ page: 0, pageSize: 50, maxPage: 1 });

	useEffect(() => {
		var data = {};
		setRefreshing(true);
		setExtraData(!extraData);
		setDataPage({ page: 0, pageSize: 10, maxPage: 1 });
		console.log('=> Search Localidad: '.search);

		if (search) {
			data = {
				page: 0,
				tipo: 'and',
				pageSize: dataPage.pageSize,
				sorted: [{ id: 'Nombre', desc: true }],
				filtered: [
					{ id: 'IdMunicipio', value: route.params.municipio.Id },
					{
						id: 'Nombre',
						value: search,
					},
				],
			};
		} else {
			data = {
				page: 0,
				tipo: 'and',
				pageSize: dataPage.pageSize,
				sorted: [{ id: 'Nombre', desc: true }],
				filtered: [{ id: 'IdMunicipio', value: route.params.municipio.Id }],
			};
		}

		console.log('=>>data To getLocalidadET: ', data);

		var requestInfo = {
			method: 'POST',
			body: JSON.stringify(data),
			headers: new Headers({
				'Content-Type': 'application/json',
				Authorization: 'bearer ' + user.token,
			}),
		};

		fetch('https://api.chiapasavana.com/api/getLocalidades', requestInfo)
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				throw new Error(`Ocurrio un error: ${response.statusText}`);
			})
			.then((dataRS) => {
				console.log('=>RSEffectBuscar: ', dataRS);
				setRefreshing(false);
				//setCatMuni({ ...catmuni, data: dataRS.data, total: dataRS.total });
				setCatMuniFiltro({ data: dataRS.data, total: dataRS.total });
				setDataPage({ ...dataPage, maxPage: dataRS.total / dataPage.pageSize });
			})
			.catch((e) => {
				console.log('==>Error en getLocalidades: ', e);
				setRefreshing(false);
			});
	}, [search]);

	btnSeleccionar = (item) => {
		console.log('=Item getLocalidadET: ', item);
		route.params.setLocalidad(item);
		navigation.goBack();
	};

	rowItem = (item) => {
		return route.params.municipio.Id === item.Id ? (
			<ListItem
				title={item.Nombre}
				subtitle={`Región ${item.SubRegion}`}
				bottomDivider
				chevron
				rightAvatar={<Avatar rounded icon={{ name: 'check' }} />}
				onPress={() => btnSeleccionar(item)}
			/>
		) : (
			<ListItem
				title={`${item.Numero} ${item.Nombre}`}
				bottomDivider
				chevron
				onPress={() => btnSeleccionar(item)}
			/>
		);
	};

	updateSearch = (text) => {
		console.log('=>BuscarUpfated: ', search);
		setSearch(text);
		setExtraData(!extraData);
		return true;
	};

	searchDataApi = () => {
		var data = {};
		setRefreshing(true);
		setExtraData(!extraData);

		console.log('=> Entro a searchApi');

		if (search) {
			data = {
				page: dataPage.page,
				tipo: 'and',
				pageSize: dataPage.pageSize,
				sorted: [{ id: 'Nombre', desc: true }],
				filtered: [
					{ id: 'IdMunicipio', value: route.params.municipio.Id },
					{
						id: 'Nombre',
						value: search,
					},
				],
			};
		} else {
			data = {
				page: dataPage.page,
				tipo: 'and',
				pageSize: dataPage.pageSize,
				sorted: [{ id: 'Nombre', desc: true }],
				filtered: [{ id: 'IdMunicipio', value: route.params.municipio.Id }],
			};
		}

		console.log('=>>data To getLocalidadET: ', data);

		var requestInfo = {
			method: 'POST',
			body: JSON.stringify(data),
			headers: new Headers({
				'Content-Type': 'application/json',
				Authorization: 'bearer ' + user.token,
			}),
		};

		fetch('https://apivales.apisedeshu.com/api/getLocalidadET', requestInfo)
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				throw new Error('Ocurrio un error: ', response.statusText);
			})
			.then((dataRS) => {
				console.log('=>NextComercios RS: ', dataRS);
				setRefreshing(false);

				//setGrupos({ ...grupos, data: dataRS.data, total: dataRS.total });
				setCatMuniFiltro({ total: dataRS.total, data: catmuniFiltro.data.concat(dataRS.data) });
				setDataPage({ ...dataPage, page: dataPage.page + 1, maxPage: dataRS.total / dataPage.pageSize });
			})
			.catch((e) => {
				console.log('==>Error Grupos: ', e);
				setRefreshing(false);
			});
	};

	onClearSearch = () => {
		console.log('=>Se borro el search');
	};

	onEndReached = () => {
		console.log('=> Info Final');
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
			console.log('=>Else FirstItem es false');
			setRefreshing(false);
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
			<View style={{ width: '100%', justifyContent: 'center', margin: 5 }}>
				{!refreshing && (
					<Input
						placeholder="Buscar localidad..."
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
				Mostrando {catmuniFiltro.data.length} de {catmuniFiltro.total}
			</Text>
			<FlatList
				style={{ width: '100%' }}
				renderItem={({ item }) => {
					return rowItem(item);
				}}
				keyExtractor={(item, index) => index.toString()}
				data={catmuniFiltro.data}
				onEndReached={onEndReached}
				onEndReachedThreshold={0.1}
				refreshing={refreshing}
				ListFooterComponent={renderFooter}
				extraData={extraData}
				ListHeaderComponent={() =>
					!setCatMuniFiltro.data ? <Text style={styles.emptyMessageStyle}>No hay información</Text> : null
				}
			/>
		</Center>
	);
};
