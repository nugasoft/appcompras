import React, { useContext, useState, useEffect, useRef } from 'react';
import { Linking, ActivityIndicator, View, FlatList, TouchableHighlight } from 'react-native';
import { Text, Tile, Avatar, Card, CheckBox, Input, Slider } from 'react-native-elements';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import {
	Foundation,
	AntDesign,
	FontAwesome5,
	FontAwesome,
	MaterialIcons,
	MaterialCommunityIcons
} from '@expo/vector-icons';

import DropdownAlert from 'react-native-dropdownalert';
import { Center } from '../components/Center';
import { AuthContext } from '../AuthProvider';
import { calcularEdad } from '../components/funciones';
import styles from './styles';
import moment from 'moment';

export default (Promovidos = ({ route, navigation }) => {
	const { user } = useContext(AuthContext);
	const dropDownAlertRef = useRef(null);

	const [ gruposFiltro, setGruposFiltro ] = useState({ data: [], total: 1 });
	const [ search, setSearch ] = useState('');
	const [ susGiros, setsusGiros ] = useState([]);
	const [ dataSearch, setDataSearch ] = useState('');
	const [ extraData, setExtraData ] = useState(false);
	const [ refreshing, setRefreshing ] = useState(false);
	const [ firstItem, setFirstItem ] = useState(true);
	const [ dataPage, setDataPage ] = useState({ page: 0, pageSize: 400, maxPage: 1 });
	const [ menu, setMenu ] = useState({ idMenu: 0, Ver: 0, Agregar: 0, Editar: 0, Eliminar: 0, Exportar: 0 });

	useEffect(
		() => {
			console.log('=> menu:', menu);
		},
		[ menu ]
	);

	useEffect(
		() => {
			var data = {};
			setRefreshing(true);
			setExtraData(!extraData);
			setFirstItem(true);
			setDataPage({ page: 0, pageSize: 10, maxPage: 1 });

			if (search) {
				data = {
					page: 0,
					tipo: 'and',
					pageSize: dataPage.pageSize,
					sorted: [],
					filtered: [ { id: 'UserCreate', value: user.user.id } ]
				};
			} else {
				data = {
					page: 0,
					tipo: 'and',
					pageSize: dataPage.pageSize,
					sorted: [],
					filtered: [ { id: 'UserCreate', value: user.user.id } ]
				};
			}

			console.log('=>>data getCompromisos: ', data);

			var requestInfo = {
				method: 'POST',
				body: JSON.stringify(data),
				headers: new Headers({
					'Content-Type': 'application/json',
					Authorization: 'bearer ' + user.token
				})
			};

			console.log('=>Token: ', user);

			fetch('https://api.chiapasavanza.com/api/getCompromisos', requestInfo)
				.then((response) => {
					if (response.ok) {
						return response.json();
					}
					throw new Error('Ocurrio un error: ', response.statusText);
				})
				.then((dataRS) => {
					console.log('=>getCompromisos RS: ', dataRS);
					setRefreshing(false);

					setGruposFiltro({ total: dataRS.total, data: dataRS.data });
					setDataPage({ ...dataPage, page: 0, maxPage: dataRS.total / dataPage.pageSize });
					console.log('=> Quedo en ceros');
				})
				.catch((e) => {
					console.log('==>Error getCompromisos: ', e);
					setRefreshing(false);
				});
		},
		[ search ]
	);

	searchDataApi = () => {
		var data = {};
		setRefreshing(true);
		setExtraData(!extraData);

		if (search) {
			data = {
				page: dataPage.page,
				tipo: 'and',
				pageSize: dataPage.pageSize,
				sorted: [],
				filtered: [ { id: 'UserCreate', value: user.user.id } ]
			};
		} else {
			data = {
				page: dataPage.page,
				tipo: 'and',
				pageSize: dataPage.pageSize,
				sorted: [],
				filtered: [ { id: 'UserCreate', value: user.user.id } ]
			};
		}

		console.log('=>>data getCompromisos: ', data);

		var requestInfo = {
			method: 'POST',
			body: JSON.stringify(data),
			headers: new Headers({
				'Content-Type': 'application/json',
				Authorization: 'bearer ' + user.token
			})
		};

		fetch('https://api.chiapasavanza.com/api/getCompromisos', requestInfo)
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				throw new Error('Ocurrio un error: ', response.statusText);
			})
			.then((dataRS) => {
				console.log('=>NextComercios RS: ', dataRS);
				setRefreshing(false);

				setGruposFiltro({ total: dataRS.total, data: gruposFiltro.data.concat(dataRS.data) });
				setDataPage({ ...dataPage, page: dataPage.page + 1, maxPage: dataRS.total / dataPage.pageSize });
			})
			.catch((e) => {
				console.log('==>Error Grupos: ', e);
				setRefreshing(false);
			});
	};

	btnDownloadWord = () => {
		var url = `https://apivales.apisedeshu.com/api/getReportesolicitudVales?d=${moment(new Date()).format(
			'YYYY-MM-DD hh:mm:ss'
		)}&token=${user.token}`;

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

	btnEditar = (item) => {
		if (menu.Editar == 0) {
			console.log('=>Editar: ', menu);
			console.log('=>MenuUSer: ', user);
			dropDownAlertRef.current.alertWithType(
				'error',
				'Error',
				'No tiene privilegios para editar asignados. Contacte a su administrador.'
			);
			return true;
		}

		if (user.user.idTipoUser.id == 3 && item.idStatus != 1) {
			console.log('=>Edit: ', user.user.idTipoUser.id);
			console.log('=>item.idStatus: ', item.idStatus);
			dropDownAlertRef.current.alertWithType(
				'error',
				'Error',
				'No tiene privilegios para editar. Contacte a su administrador.'
			);
			return true;
		}
		navigation.navigate('SolicitudesEditar', {
			refreshData,
			item,
			menu,
			validate: false
		});
	};

	btnNuevoComercio = () => {
		console.log('=> Nnuevo Solicitud: ', menu);

		if (user.menu[1].Agregar == 0) {
			dropDownAlertRef.current.alertWithType(
				'error',
				'Error',
				'No tiene privilegios asignados. Contacte a su administrador.'
			);
			return true;
		}

		navigation.navigate('SolicitudesAdd', {
			refreshData
		});
	};

	rowItem = (item) => {
		return (
			<TouchableHighlight onPress={() => btnEditar(item)}>
				<Card title={`${item.Nombres} ${item.Paterno} ${item.Materno}`}>
					<View style={{ flexDirection: 'row', marginRight: 10 }}>
						<View>
							<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5, flexWrap: 'wrap' }}>
								<Text
									style={{
										flexWrap: 'wrap',
										alignItems: 'flex-start',
										fontSize: 12,
										fontWeight: '600'
									}}
								>
									Clave Única:
								</Text>
								<Text style={{ fontWeight: 'bold', fontSize: 12 }}>{`${item.ClaveElector}`}</Text>
							</View>

							<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5, flexWrap: 'wrap' }}>
								<Text
									style={{
										flexWrap: 'wrap',
										alignItems: 'flex-start',
										fontSize: 12,
										fontWeight: '600'
									}}
								>
									Tel Casa
								</Text>
								<Text style={{ fontWeight: 'bold' }}> {`${item.Telefono ? item.Telefono : '-'}`}</Text>
							</View>
							<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5, flexWrap: 'wrap' }}>
								<Text
									style={{
										flexWrap: 'wrap',
										alignItems: 'flex-start',
										fontSize: 12,
										fontWeight: '600'
									}}
								>
									Tel Celular
								</Text>
								<Text style={{ fontWeight: 'bold' }}> {`${item.Celular ? item.Celular : '-'}`}</Text>
							</View>

							<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5, flexWrap: 'wrap' }}>
								<Text
									style={{
										flexWrap: 'wrap',
										alignItems: 'flex-start',
										fontSize: 12,
										fontWeight: '600'
									}}
								>
									Tel Recados
								</Text>
								<Text style={{ fontWeight: 'bold' }}>
									{`${item.TelMensajes ? item.TelMensajes : '-'}`}
								</Text>
							</View>

							<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5, flexWrap: 'wrap' }}>
								<Text
									style={{
										flexWrap: 'wrap',
										alignItems: 'flex-start',
										fontSize: 12,
										fontWeight: '600'
									}}
								>
									Calle:
								</Text>
								<Text style={{ fontWeight: 'bold' }}>
									{item.NumExt ? (
										`${item.CalleVive} Num.${item.NumExtVive}`
									) : (
										`${item.CalleVive} Num.${item.NumExtVive} NumExt.${item.NumIntVive}`
									)}
								</Text>
							</View>
							<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5, flexWrap: 'wrap' }}>
								<Text
									style={{
										flexWrap: 'wrap',
										alignItems: 'flex-start',
										fontSize: 12,
										fontWeight: '600'
									}}
								>
									Colonia:
								</Text>
								<Text style={{ fontWeight: 'bold' }}> {`${item.ColoniaVive}`}</Text>
							</View>

							<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5, flexWrap: 'wrap' }}>
								<Text
									style={{
										flexWrap: 'wrap',
										alignItems: 'flex-start',
										fontSize: 12,
										fontWeight: '600'
									}}
								>
									CP:
								</Text>
								<Text style={{ fontWeight: 'bold' }}> {`${item.CPVive}`}</Text>
							</View>
							<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5, flexWrap: 'wrap' }}>
								<Text style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>Municipio:</Text>
								<Text style={{ fontWeight: 'bold' }}> {item.MunicipioVive.label}</Text>
							</View>
							<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5, flexWrap: 'wrap' }}>
								<Text style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>Sección:</Text>
								<Text style={{ fontWeight: 'bold' }}> {item.SeccionVota}</Text>
							</View>
						</View>
					</View>
				</Card>
			</TouchableHighlight>
		);
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
					//searchDataApi();
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

	refreshData = () => {
		const data = {
			page: dataPage.page,
			tipo: 'and',
			pageSize: dataPage.pageSize,
			sorted: [],
			NombreCompleto: search,
			filtered: [ { id: 'UserCreate', value: user.user.id } ]
		};

		console.log('=>Refresh Data Grupos: ', data);

		var requestInfo = {
			method: 'POST',
			body: JSON.stringify(data),
			headers: new Headers({
				'Content-Type': 'application/json',
				Authorization: 'bearer ' + user.token
			})
		};

		fetch('https://api.chiapasavanza.com/api/getCompromisos', requestInfo)
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				throw new Error(`Ocurrio un error: ${response.statusText}`);
			})
			.then((dataRS) => {
				console.log('=>Grupos RS: ', dataRS);
				setExtraData(!extraData);
				// setGrupos({ ...grupos, data: dataRS.data, total: dataRS.total });
				// setGruposFiltro(dataRS.data);
				// setDataPage({ ...dataPage, maxPage: dataRS.total / dataPage.pageSize });

				setGruposFiltro({ data: dataRS.data, total: dataRS.total });
				setDataPage({ ...dataPage, page: 0, maxPage: dataRS.total / dataPage.pageSize });
			})
			.catch((e) => {
				console.log('==>Error Grupos: ', e);
			});
	};

	setUpdateGiro = (item) => {
		const data = susGiros;
		console.log('=> Inicial: ', data);

		data.push(item);
		const results = data.unique();
		console.log('=> REsults: ', results);
		setsusGiros(results);
	};

	return (
		<Center>
			<View style={{ width: '100%', justifyContent: 'center', margin: 5 }}>
				{!refreshing && (
					<Input
						placeholder="Buscar persona..."
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
				<FontAwesome name="file-excel-o" size={30} color="#000" onPress={() => btnDownloadWord()} />
			</View>
			<Text>
				Mostrando {gruposFiltro.data ? gruposFiltro.data.length : '0'} de {gruposFiltro.total}
			</Text>

			<FlatList
				style={{ width: '100%' }}
				//refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshData} />}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item }) => {
					return rowItem(item);
				}}
				data={gruposFiltro.data}
				onEndReached={onEndReached}
				onEndReachedThreshold={0.1}
				refreshing={refreshing}
				ListFooterComponent={renderFooter}
				extraData={extraData}
				ListHeaderComponent={() =>
					!gruposFiltro.data ? <Text style={styles.emptyMessageStyle}>No hay información</Text> : null}
			/>

			<DropdownAlert ref={dropDownAlertRef} />
		</Center>
	);
});
