import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 5
	},
	rowColumn: {
		flexDirection: 'column',
		alignItems: 'flex-start',
		padding: 5
	},
	rowDeep: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginHorizontal: 5
	},
	rowPersona: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginHorizontal: 5
	},
	NoTiene: { fontWeight: 'normal', textDecorationLine: 'line-through', textDecorationStyle: 'solid' },
	Normal: { fontWeight: 'bold' },
	emptyMessageStyle: {
		textAlign: 'center'
	},
	container: {
		flex: 1,
		marginTop: Constants.statusBarHeight,
		backgroundColor: '#FFF'
	},
	scrollView: {
		marginHorizontal: 20,
		backgroundColor: '#FFF'
	}
});

export default styles;
