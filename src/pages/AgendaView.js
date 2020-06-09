import React, { useContext, useState, useEffect, useRef } from 'react';
import { Text, Tile, Avatar, Card, CheckBox, Input, Slider } from 'react-native-elements';
import {
	StyleSheet,
	ActivityIndicator,
	FlatList,
	View,
	TextInput,
	Button,
	TouchableHighlight,
	Alert,
	Image,
	ListView,
	TouchableOpacity
} from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import DropdownAlert from 'react-native-dropdownalert';
import { AuthContext } from '../AuthProvider';

export default (AgendaView = ({ route, navigation }) => {
	const { user } = useContext(AuthContext);

	const [ dataSearch, setDataSearch ] = useState('');
	const [ search, setSearch ] = useState('');
	const [ agendaData, setAgendaData ] = useState({
		data: [
			{
				day: 1,
				month: 'Sep',
				allDay: 0,
				HoraInicial: '10:00 am',
				HoraFinal: '10:45 am',
				NombreEvento: 'Camina caña hueca',
				TipoEvento: 'Cominata'
			},
			{
				day: 1,
				month: 'Sep',
				allDay: 0,
				HoraInicial: '11:00 am',
				HoraFinal: '01:00 pm',
				NombreEvento: 'Recorrido mercado de los ancianos',
				TipoEvento: 'Mercado'
			},
			{
				day: 2,
				month: 'Jan',
				allDay: 0,
				HoraInicial: '10:00 am',
				HoraFinal: '11:45 am',
				NombreEvento: 'Volanteo esquina del estadio',
				TipoEvento: 'Volanteo'
			},
			{
				day: 3,
				month: 'Aug',
				allDay: 0,
				HoraInicial: '08:30 am',
				HoraFinal: '10:00 am',
				NombreEvento: 'Desayuno con Notarios',
				TipoEvento: 'Desayuno'
			},
			{
				day: 4,
				month: 'Dec',
				allDay: 0,
				HoraInicial: '15:00 am',
				HoraFinal: '05:35 pm',
				NombreEvento: 'Comida con Contadores',
				TipoEvento: 'Comida'
			},
			{
				day: 5,
				month: 'Jul',
				allDay: 0,
				HoraInicial: '10:00 am',
				HoraFinal: '10:45 am',
				NombreEvento: 'Caminata parque Central',
				TipoEvento: 'Cominata'
			},
			{
				day: 6,
				month: 'Oct',
				allDay: 0,
				HoraInicial: '08:00 am',
				HoraFinal: '08:45 am',
				NombreEvento: 'Caminata parque infantil',
				TipoEvento: 'Cominata'
			},
			{
				day: 7,
				month: 'Sep',
				allDay: 0,
				HoraInicial: '08:00 am',
				HoraFinal: '08:45 am',
				NombreEvento: 'Caminata zona centro',
				TipoEvento: 'Cominata'
			},
			{
				day: 8,
				month: 'Jan',
				allDay: 0,
				HoraInicial: '08:00 am',
				HoraFinal: '08:45 am',
				NombreEvento: 'Caminata mercado de mariscos',
				TipoEvento: 'Cominata'
			},
			{
				day: 29,
				month: 'May',
				allDay: 0,
				HoraInicial: '08:00 am',
				HoraFinal: '08:45 am',
				NombreEvento: 'Caminata parque solidariadad',
				TipoEvento: 'Cominata'
			}
		],
		total: 9
	});
	const [ extraData, setExtraData ] = useState(false);
	const [ refreshing, setRefreshing ] = useState(false);

	const dropDownAlertRef = useRef(null);

	btnEventoView = (item) => {
		console.log('=>Evento: ', item);
	};

	rowItem = (item) => {
		return (
			<TouchableOpacity onPress={() => btnEventoView(item)}>
				<View style={styles.eventBox}>
					<View style={styles.eventDate}>
						<Text style={styles.eventDay}>{item.day}</Text>
						<Text style={styles.eventMonth}>{item.month}</Text>
					</View>
					<View style={styles.eventContent}>
						<Text style={styles.eventTipo}>{item.TipoEvento}</Text>
						<Text style={styles.eventTipo}>{item.NombreEvento}</Text>
						<Text style={styles.eventTime}>
							{item.allDay == 1 ? 'Todo el día' : `${item.HoraInicial} - ${item.HoraFinal}`}
						</Text>
						<Text style={styles.userName}>John Doe</Text>
						<Text style={styles.description}>Lorem ipsum dolor sit amet, elit consectetur</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	};

	renderFooter = () => {
		if (refreshing) {
			return <ActivityIndicator size="large" />;
		} else {
			return null;
		}
	};

	return (
		<View style={styles.container}>
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
			</View>
			<Text>
				Mostrando {agendaData.data ? agendaData.data.length : '0'} de {agendaData.total}
			</Text>

			<FlatList
				style={{ width: '100%' }}
				//refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshData} />}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item }) => {
					return rowItem(item);
				}}
				data={agendaData.data}
				refreshing={refreshing}
				ListFooterComponent={renderFooter}
				extraData={extraData}
				ListHeaderComponent={() =>
					!agendaData.data ? <Text style={styles.emptyMessageStyle}>No hay información</Text> : null}
			/>

			<DropdownAlert ref={dropDownAlertRef} />
		</View>
	);
});

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#DCDCDC'
	},
	eventList: {
		marginTop: 20
	},
	eventBox: {
		padding: 10,
		marginTop: 5,
		marginBottom: 5,
		flexDirection: 'row'
	},
	eventDate: {
		flexDirection: 'column'
	},
	eventDay: {
		fontSize: 50,
		color: '#0099FF',
		fontWeight: '600'
	},
	eventMonth: {
		fontSize: 16,
		color: '#0099FF',
		fontWeight: '600'
	},
	eventContent: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'flex-start',
		marginLeft: 10,
		backgroundColor: '#FFFFFF',
		padding: 10,
		borderRadius: 10
	},
	description: {
		fontSize: 15,
		color: '#646464'
	},
	eventTipo: {
		fontSize: 18,
		color: '#151515'
	},
	eventTime: {
		fontSize: 16,
		color: '#151515'
	},
	userName: {
		fontSize: 16,
		color: '#151515'
	}
});
