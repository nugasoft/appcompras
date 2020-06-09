import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
	header: {
		backgroundColor: '#00CED1'
	},
	headerContent: {
		padding: 30,
		alignItems: 'center'
	},
	avatar: {
		width: 130,
		height: 130,
		borderRadius: 63,
		borderWidth: 4,
		borderColor: 'white',
		marginBottom: 10
	},
	name: {
		fontSize: 22,
		color: '#FFFFFF',
		fontWeight: '600'
	},
	profileDetail: {
		alignSelf: 'center',
		marginTop: 230,
		alignItems: 'center',
		flexDirection: 'row',
		position: 'absolute',
		backgroundColor: '#ffffff'
	},
	detailContent: {
		margin: 10,
		alignItems: 'center'
	},
	title: {
		fontSize: 20,
		color: '#00CED1'
	},
	count: {
		fontSize: 18
	},
	bodyContent: {
		flex: 1,
		alignItems: 'center',
		padding: 30,
		marginTop: 40
	},
	textInfo: {
		fontSize: 18,
		marginTop: 20,
		color: '#696969'
	},
	buttonContainer: {
		marginTop: 10,
		height: 45,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 20,
		width: 250,
		borderRadius: 30,
		backgroundColor: '#00CED1'
	},
	description: {
		fontSize: 20,
		color: '#00CED1',
		marginTop: 10,
		textAlign: 'center'
	}
});

export default styles;
