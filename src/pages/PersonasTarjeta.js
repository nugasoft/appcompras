import React, { useContext, useState, useEffect, useRef } from 'react';
import {
	ActivityIndicator,
	Linking,
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

import { AntDesign, FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Center } from '../components/Center';
import { calcularEdad } from '../components/funciones';
import { AuthContext } from '../AuthProvider';

import styles from './styles';

export default Personas = ({ route, navigation }) => {
	const { user } = useContext(AuthContext);
	const [catmuni, setCatMuni] = useState({ data: [], total: 0 });
	const [catmuniFiltro, setCatMuniFiltro] = useState([]);
	const [search, setSearch] = useState('');
	const [dataSearch, setDataSearch] = useState('');
	const [extraData, setExtraData] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [buscando, setBuscando] = useState(false);
	const [dataPage, setDataPage] = useState({ page: 0, pageSize: 100, maxPage: 1 });

	useEffect(() => {
		var data = {};

		console.log('=> Search Municipio: ', search);

		if (search) {
			data = {
				page: dataPage.page,
				tipo: 'or',
				all: 0,
				NombreCompleto: search,
				pageSize: dataPage.pageSize,
				sorted: [{id:"et_aprobadoscomite.NombreC", desc:false}, {id:"et_aprobadoscomite.PaternoC", desc:false}],
				filtered: [],
			};
		} else {
			data = {
				page: dataPage.page,
				tipo: 'and',
				all: 0,
				pageSize: dataPage.pageSize,
				sorted: [{id:"et_aprobadoscomite.NombreC", desc:false}, {id:"et_aprobadoscomite.PaternoC", desc:false}],
				filtered: [],
			};
		}

		console.log('=>>data To Municipio: ', data);

		var requestInfo = {
			method: 'POST',
			body: JSON.stringify(data),
			headers: new Headers({
				'Content-Type': 'application/json',
				Authorization: 'bearer ' + user.token,
			}),
		};

		setBuscando(true);

		fetch('https://apicovid.chiapasavanza.com/api/getTarjetaAsignadaET', requestInfo)
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				throw new Error(`Ocurrio un error: ${response.statusText}`);
			})
			.then((dataRS) => {
				setBuscando(false);
				console.log('=>RS getTarjetaAsignadaET: ', dataRS);
				setCatMuni({ ...catmuni, data: dataRS.data, total: dataRS.total });
				setCatMuniFiltro(dataRS.data);
				setDataPage({ ...dataPage, maxPage: dataRS.total / dataPage.pageSize });
			})
			.catch((e) => {
				setBuscando(false);
				console.log('==>Error en getMunicipiosET: ', e);
			});
	}, [search]);

	btnSearch = () => {
		console.log('=> Búsqueda');
	};

	btnDownload = (item) => {
		var url = `https://apicovid.chiapasavanza.com/api/getTarjeta?token=${user.token}&curp=${item.CURP}`;

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
			<Card key={`${item.id}`} title={`${item.Nombre} ${item.Paterno} ${item.Materno}`}>
				<View
					style={{
						justifyContent: 'center',
						alignContent: 'center',
						alignItems: 'center',
					}}
				>
					<Text
						style={{
							fontWeight: 'bold',
							color: '#3714de',
						}}
					>{`Grupo: ${item.idGrupo} ${item.Municipio}`}</Text>
				</View>
				<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
					<AntDesign name="pdffile1" size={30} color="#000" onPress={() => btnDownload(item)} />
					<Text style={{ fontWeight: 'bold' }}>{`Tarjeta: ${item.Terminacion}`}</Text>
				</View>
				<View style={styles.rowDeep}>
					<View>
						{item.Sexo == 'F' ? (
							<Avatar overlayContainerStyle={{ backgroundColor: '#de40b8' }} rounded title={item.Sexo} />
						) : (
							<Avatar overlayContainerStyle={{ backgroundColor: '#40b8de' }} rounded title={item.Sexo} />
						)}
						<Text style={{ fontWeight: 'bold' }}>{`${calcularEdad(item.FechaNacimientoC)} años`}</Text>
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
							<Text style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>Folio:</Text>
							<Text style={{ fontWeight: 'bold' }}> {`${item.FolioC}`}</Text>
						</View>
						<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5 }}>
							<Text style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>FechaNacimiento:</Text>
							<Text style={{ fontWeight: 'bold' }}> {`${item.FechaNacimientoC}`}</Text>
						</View>
						<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5 }}>
							<Text style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>CURP:</Text>
							<Text style={{ fontWeight: 'bold' }}> {`${item.CURP}`}</Text>
						</View>
						<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5 }}>
							<Text style={{ fontWeight: 'bold' }}> {`${item.Calle} Num.${item.NumExt} `}</Text>
						</View>
						<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5 }}>
							<Text style={{ fontWeight: 'bold' }}> {`${item.Colonia}`}</Text>
						</View>
						<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5 }}>
							<Text style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>Mun.:</Text>
							<Text style={{ fontWeight: 'bold' }}> {`${item.Municipio}`}</Text>
						</View>
						<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5 }}>
							<Text style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>Loc.:</Text>
							<Text style={{ fontWeight: 'bold' }}> {`${item.Localidad}`}</Text>
						</View>
						<View style={{ flex: 1, flexDirection: 'row', marginLeft: 5 }}>
							<Text style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>Capturo:</Text>
							<View style={{ flex: 1, flexDirection: 'column', marginLeft: 5 }}>
								<Text style={{ flexWrap: 'wrap', alignItems: 'flex-start', fontWeight: 'bold' }}>
									{' '}
									{`${item.emailCapturo}`}
								</Text>
								<Text style={{ flexWrap: 'wrap', alignItems: 'flex-start', fontWeight: 'bold' }}>
									{' '}
									{`${item.NombreCapturo} ${item.PaternoCapturo}`}
								</Text>
								<Text style={{ flexWrap: 'wrap', alignItems: 'flex-start', fontWeight: 'bold' }}>
									{' '}
									{`${item.created_at}`}
								</Text>
							</View>
						</View>
					</View>
				</View>
			</Card>
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
			<View style={{ width: '100%', justifyContent: 'center', margin: 5 }}>
				{!buscando && (
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
				)}
				{buscando && <ActivityIndicator animating={buscando} size="large" />}
			</View>
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
					!catmuniFiltro.length ? <Text style={styles.emptyMessageStyle}>No hay información</Text> : null
				}
			/>
		</Center>
	);
};
