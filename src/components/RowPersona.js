import React from 'react';
import { View, TouchableHighlight} from 'react-native'
import { Text,  Avatar, Card  } from 'react-native-elements';



import { calcularEdad } from '../components/funciones';
import styles from '../pages/styles';

export const RowPersona = ({item}) => {
  console.log('=>Item Row: ', item)
  return(
    <TouchableHighlight key={`${item.Id}`} onPress={() =>btnSeleccionar(item)}>
    <Card  key={`${item.Id}`} title={`${item.NombreC} ${item.PaternoC} ${item.MaternoC}`}>
    <View style={styles.rowPersona}>
          <View>
            {item.SexoC == "F" ? <Avatar overlayContainerStyle={{backgroundColor: '#de40b8'}} rounded title={item.Sexo} /> : <Avatar overlayContainerStyle={{backgroundColor: '#40b8de'}} rounded title={item.Sexo} />}
            <Text style={{ fontWeight: 'bold',}}>{`${calcularEdad(item.FechaNacimientoC)} años`}</Text>
          </View>
          
          <View style={{ flex:1, flexDirection:"column", justifyContent: "space-around", marginHorizontal: 5}}>
            <View style={{ flex:1, flexDirection:"row", marginLeft: 5}}>
              <Text style={{ flexWrap: 'wrap', alignItems: 'flex-start'}}>FechaNacimiento:</Text>
              <Text style={{ fontWeight: 'bold',}}> {`${item.FechaNacimientoC}`}</Text>
            </View>
            <View style={{ flex:1, flexDirection:"row", marginLeft: 5}}>
              <Text style={{ flexWrap: 'wrap', alignItems: 'flex-start'}}>CURP:</Text>
              <Text style={{ fontWeight: 'bold',}}> {`${item.CURP}`}</Text>
            </View>
            <View style={{ flex:1, flexDirection:"row", marginLeft: 5}}>
              <Text style={{ fontWeight: 'bold',}}> {`${item.CalleC} Num.${item.NumeroC} `}</Text>
            </View>
            <View style={{ flex:1, flexDirection:"row", marginLeft: 5}}>
              <Text style={{ fontWeight: 'bold',}}> {`${item.ColoniaC}`}</Text>
            </View>
            <View style={{ flex:1, flexDirection:"row", marginLeft: 5}}>
            <Text style={{ flexWrap: 'wrap', alignItems: 'flex-start'}}>Mun.:</Text>
              <Text style={{ fontWeight: 'bold',}}> {`${item.MunicipioC}`}</Text>
            </View>
            <View style={{ flex:1, flexDirection:"row", marginLeft: 5}}>
            <Text style={{ flexWrap: 'wrap', alignItems: 'flex-start'}}>Loc.:</Text>              
              <Text style={{ fontWeight: 'bold',}}> {`${item.Localidad}`}</Text>
            </View>
          </View>
      </View>
    </Card>
    </TouchableHighlight>
  )
}