import React, { useContext, useState, useEffect, useRef } from 'react';
import { SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { Text, Tile, Avatar, Card, CheckBox, Input, Slider } from 'react-native-elements';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import { Ionicons, AntDesign, FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph } from 'react-native-chart-kit';

import { Center } from '../components/Center';
import { AuthContext } from '../AuthProvider';
import styles from './styles';

const chartConfig = {
	backgroundGradientFrom: '#1E2923',
	backgroundGradientTo: '#08130D',
	color: (opacity = 1) => `rgba(17, 17, 17, ${opacity})`
};

export default (Resumen = () => {
	const { user } = useContext(AuthContext);

	return (
		<SafeAreaView style={{ backgroundColor: '#FFF' }}>
			<ScrollView style={styles.scrollView}>
				<LineChart
					data={{
						labels: [ '25 May', '26 May', '27 May', '28 May', '29 May', '30 May' ],
						datasets: [
							{
								data: [ 10, 12, 11, 20, 28, 25 ]
							}
						]
					}}
					width={Dimensions.get('window').width - 15} // from react-native
					height={250}
					chartConfig={{
						backgroundColor: '#e26a00',
						backgroundGradientFrom: '#fb8c00',
						backgroundGradientTo: '#ffa726',
						decimalPlaces: 2, // optional, defaults to 2dp
						color: (opacity = 0.5) => `rgba(17, 17, 17, ${opacity})`,
						style: {
							borderRadius: 16
						}
					}}
					bezier
					style={{
						marginVertical: 15,
						borderRadius: 16
					}}
				/>
			</ScrollView>
		</SafeAreaView>
	);
});
