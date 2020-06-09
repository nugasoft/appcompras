import React, { useContext, useState, useEffect, useRef } from 'react';
import {
	RefreshControl,
	KeyboardAvoidingView,
	Linking,
	ScrollView,
	StyleSheet,
	View,
	Button,
	FlatList,
	TouchableHighlight,
	Picker,
} from 'react-native';
import { Text, Tile, Avatar, Card, CheckBox, Input, Slider } from 'react-native-elements';
import moment from 'moment';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { ConfirmDialog } from 'react-native-simple-dialogs';

import { Center } from '../components/Center';
import { AuthContext } from '../AuthProvider';
import { calcularEdad } from '../components/funciones';
import styles from './styles';

export default GruposDetalle = ({ route, navigation }) => {
	const { user } = useContext(AuthContext);
	const [grupos, setGrupos] = useState({ data: [], total: 0 });
	const [gruposFiltro, setGruposFiltro] = useState([]);
	const [search, setSearch] = useState('');
	const [dataSearch, setDataSearch] = useState('');
	const [extraData, setExtraData] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [dataPage, setDataPage] = useState({ page: 0, pageSize: 55, maxPage: 1 });
	const [confirmDialogVisible, setConfirmDialog] = useState(false);
	const [deleteItem, setDeleteItem] = useState({ id: null });

	useEffect(() => {
		console.log('Init GruposX search: ', search);
		console.log('Init Grupos dataPage: ', dataPage);
		console.log('Init Grupos: ', grupos);
		console.log('Init GruposFiltro: ', gruposFiltro);

		var data = {};

		console.log('=> PAram item: ', route.params.item);

		if (search) {
			data = {
				page: dataPage.page,
				tipo: 'or',
				NombreCompleto: search,
				pageSize: dataPage.pageSize,
				sorted: [{ id: 'et_tarjetas_asignadas.created_at', desc: true }],
				filtered: [{ id: 'et_tarjetas_asignadas.idGrupo', value: route.params.item.id }],
			};
		} else {
			data = {
				page: dataPage.page,
				tipo: 'and',
				pageSize: dataPage.pageSize,
				sorted: [{ id: 'et_tarjetas_asignadas.created_at', desc: true }],
				filtered: [{ id: 'et_tarjetas_asignadas.idGrupo', value: route.params.item.id }],
			};
		}

		console.log('=>>data To Grupos: ', data);

		var requestInfo = {
			method: 'POST',
			body: JSON.stringify(data),
			headers: new Headers({
				'Content-Type': 'application/json',
				Authorization: 'bearer ' + user.token,
			}),
		};

		fetch('https://apicovid.chiapasavanza.com/api/getTarjetaAsignadaET', requestInfo)
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				throw new Error(`Ocurrio un error: ${response.statusText}`);
			})
			.then((dataRS) => {
				console.log('=>getTarjetaAsignadaET RS: ', dataRS);

				setGrupos({ ...grupos, data: dataRS.data, total: dataRS.total });
				setGruposFiltro(dataRS.data);
				setDataPage({ ...dataPage, maxPage: dataRS.total / dataPage.pageSize });
			})
			.catch((e) => {
				console.log('==>Error Grupos: ', e);
			});
	}, [search]);

	btnDownloadWord = (item) => {
		console.log('=> Descargar Formato Tarjeta: ', item);

		var url = `https://apicovid.chiapasavanza.com/api/getTarjeta?t=w&d=${moment(new Date()).format(
			'YYYY-MM-DD hh:mm:ss'
		)}&token=${user.token}&curp=${item.CURP}`;

		console.log('url: ', url);

		Linking.canOpenURL(url)
			.then((supported) => {
				if (!supported) {
					console.log("Can't handle url: " + url);
				} else {
					return Linking.openURL(url);
				}
			})
			.catch((err) => console.error('An error occurred', err));
	};

	rowItem = (item) => {
		return (
			<TouchableHighlight key={`${item.id}`} onPress={() => console.log('=>Click: ', item)}>
				<Card title={`${item.Nombre} ${item.Paterno} ${item.Materno}`}>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
						<AntDesign
							name="deleteuser"
							size={30}
							color="#000"
							onPress={() => {
								setDeleteItem(item);
								setConfirmDialog(true);
							}}
						/>
						<AntDesign name="wordfile1" size={30} color="#000" onPress={() => btnDownloadWord(item)} />
					</View>
					<View
						style={{
							flex: 1,
							flexDirection: 'column',
							justifyContent: 'space-between',
							alignItems: 'flex-end',
							marginHorizontal: 5,
						}}
					>
						<Text>Tarjeta:</Text>

						<Text style={{ fontWeight: 'bold' }}>{`${item.Terminacion}`} </Text>
					</View>
					<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5 }}>
						<Text style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>Folio:</Text>
						<Text style={{ fontWeight: 'bold' }}> {item.FolioC}</Text>
					</View>
					<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5 }}>
						<Text style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>Fecha Nacimiento:</Text>
						<Text style={{ fontWeight: 'bold' }}> {item.FechaNacimientoC}</Text>
					</View>
					<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5 }}>
						<Text style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>CURP:</Text>
						<Text style={{ fontWeight: 'bold' }}> {`${item.CURP}`}</Text>
					</View>

					<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5 }}>
						<Text style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>Municipio:</Text>
						<Text style={{ fontWeight: 'bold' }}> {`${item.Municipio}`}</Text>
					</View>
					<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5 }}>
						<Text style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>Región:</Text>
						<Text style={{ fontWeight: 'bold' }}> {`${item.SubRegion}`}</Text>
					</View>
				</Card>
			</TouchableHighlight>
		);
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

	refreshData = () => {
		console.log('=>Refresh Data');

		const data = {
			page: dataPage.page,
			tipo: 'and',
			pageSize: dataPage.pageSize,
			sorted: [{ id: 'et_tarjetas_asignadas.created_at', desc: true }],
			filtered: [{ id: 'et_tarjetas_asignadas.idGrupo', value: route.params.item.id }],
		};

		var requestInfo = {
			method: 'POST',
			body: JSON.stringify(data),
			headers: new Headers({
				'Content-Type': 'application/json',
				Authorization: 'bearer ' + user.token,
			}),
		};

		fetch('https://apicovid.chiapasavanza.com/api/getTarjetaAsignadaET', requestInfo)
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				throw new Error(`Ocurrio un error: ${response.statusText}`);
			})
			.then((dataRS) => {
				console.log('=>getTarjetaAsignadaET RS: ', dataRS);
				route.params.refreshData();
				setExtraData(!extraData);
				setGrupos({ ...grupos, data: dataRS.data, total: dataRS.total });
				setGruposFiltro(dataRS.data);
				setDataPage({ ...dataPage, maxPage: dataRS.total / dataPage.pageSize });
			})
			.catch((e) => {
				console.log('==>Error Grupos: ', e);
			});
	};

	btnDeleteAsignacion = () => {
		console.log('=>Eliminar: ', deleteItem);

		const data = {
			Terminacion: deleteItem.Terminacion,
		};

		var requestInfo = {
			method: 'POST',
			body: JSON.stringify(data),
			headers: new Headers({
				'Content-Type': 'application/json',
				Authorization: 'bearer ' + user.token,
			}),
		};

		fetch('https://apicovid.chiapasavanza.com/api/deleteTarjetaAsignadaET', requestInfo)
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				throw new Error(`Ocurrio un error: ${response.statusText}`);
			})
			.then((dataRS) => {
				console.log('=>getTarjetaAsignadaET RS: ', dataRS);
				setConfirmDialog(false);
				route.params.refreshData();
				refreshData();
			})
			.catch((e) => {
				console.log('==>Error Grupos: ', e);
			});
	};

	return (
		<Center>
			<View style={{ width: '100%', justifyContent: 'center', margin: 5 }}>
				<Input
					placeholder="Buscar..."
					value={dataSearch}
					onChangeText={(text) => setDataSearch(text)}
					rightIcon={
						<MaterialCommunityIcons
							name="account-search"
							size={35}
							color="black"
							onPress={() => setSearch(dataSearch)}
						/>
					}
				/>
			</View>
			<Text>
				Mostrando {gruposFiltro.length} de {grupos.total}
			</Text>
			<ConfirmDialog
				title="Eliminar Asignación de Tarjeta"
				message="¿Esta seguro que desea elminimar la asignación de la Tarjeta?"
				visible={confirmDialogVisible}
				onTouchOutside={() => setConfirmDialog(false)}
				positiveButton={{
					title: 'SI',
					onPress: () => btnDeleteAsignacion(),
				}}
				negativeButton={{
					title: 'NO',
					onPress: () => setConfirmDialog(false),
				}}
			/>
			<FlatList
				style={{ width: '100%' }}
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshData} />}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item }) => {
					return rowItem(item);
				}}
				data={gruposFiltro}
				onEndReached={onEndReached}
				onEndReachedThreshold={0.1}
				ListFooterComponent={renderFooter}
				extraData={extraData}
				ListHeaderComponent={() =>
					!gruposFiltro.length ? <Text style={styles.emptyMessageStyle}>No hay información</Text> : null
				}
			/>
		</Center>
	);
};
