import React, { useContext, useState, useEffect, useRef} from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View, Button, FlatList, TouchableHighlight, Picker} from 'react-native'
import { Text, Tile, Avatar, Card, CheckBox, Input,Slider  } from 'react-native-elements';

import { Ionicons, FontAwesome, MaterialIcons, MaterialCommunityIcons} from '@expo/vector-icons';

import { Center } from '../components/Center';
import { AuthContext } from "../AuthProvider";

import styles from './styles';

export default AgregarFiltro =({ route, navigation }) =>{
  const [formState] = useState();
  const [filtro, setFiltro]= useState({Nombre: '', Paterno:'',MotivoConsulta:'', TieneFiebre: false, TieneTos: false, TieneCefalea: false, TuvoExposicion: false, OtroSintoma:'', TiempoEvolucionSintomas:1, Indicaciones: ''})
  const submit = useRef(() => {});

  useEffect(() => {
    navigation.setParams({ submit})
  }, [])

  useEffect(() => {
console.log('=>DataFiltro: ', filtro)
  }, [filtro])

  submit.current = () => {
    apiCallEdit(formState);

      navigation.goBack();
  }

  handleInputChange = (Campo, Valor) => {
    if (/^\d+$/.test(Valor)) {
      setFiltro({...filtro, Campo: Valor});
    }
  }

  return(
    <View>
      <KeyboardAvoidingView behavior="padding" enabled>
      <View style={styles.rowColumn}>
        <Text>Click en el icono para buscar a la persona</Text>
        <Input
          placeholder='Nombre'
          disabled
          leftIcon={
            <MaterialCommunityIcons
              name='account-search'
              size={24}
              color='black'
              onPress={() => navigation.navigate("PersonasBuscar")}
            />
          }
        />
      </View> 
      <View style={styles.rowColumn}>
        <Text>Municipio Procedencia</Text>
        <Input
          placeholder='Nombre'
          disabled
          leftIcon={
            <FontAwesome
              name='map-signs'
              size={24}
              color='black'
              onPress={() => navigation.navigate("BuscarPersona")}
            />
          }
        />
      </View> 
      <View style={styles.rowColumn}>
      <Text>Especifique si tiene estos síntomas:</Text>
        <CheckBox
          center
          title='Tiene Fiebre'
          iconRight
          iconType='material'
          checkedIcon='check'
          uncheckedIcon='add'
          checkedColor='blue'
          checked={filtro.TieneFiebre}
          onPress={() => setFiltro({...filtro, TieneFiebre: !filtro.TieneFiebre})}
        />
        <CheckBox
          center
          title='Tiene Tos'
          iconRight
          iconType='material'
          checkedIcon='check'
          uncheckedIcon='add'
          checkedColor='blue'
          checked={filtro.TieneTos}
          onPress={() => setFiltro({...filtro, TieneTos: !filtro.TieneTos})}
        />
        <CheckBox
          center
          title='Tiene Cefalea'
          iconRight
          iconType='material'
          checkedIcon='check'
          uncheckedIcon='add'
          checkedColor='blue'
          checked={filtro.TieneCefalea}
          onPress={() => setFiltro({...filtro, TieneCefalea: !filtro.TieneCefalea})}
        />
        <CheckBox
          center
          title='Estuvo Expuesto'
          iconRight
          iconType='material'
          checkedIcon='check'
          uncheckedIcon='add'
          checkedColor='blue'
          checked={filtro.TuvoExposicion}
          onPress={() => setFiltro({...filtro, TuvoExposicion: !filtro.TuvoExposicion})}
        />
        <Input
            style={{}}
            multiline={true}
            placeholder='Algún otro síntoma'
            leftIcon={
              <MaterialIcons
                name='note-add'
                size={24}
                color='black'
              />
            }
            onChangeText={(OtroSintoma) =>  setFiltro({...filtro, OtroSintoma})}
          />
          <Text>¿Tiempo de Evolución de los Síntomas?</Text>
          <Input
            keyboardType='numeric'
            placeholder='Días'
            leftIcon={
              <MaterialCommunityIcons
                name='calendar-clock'
                size={24}
                color='black'
              />
            }
            onChangeText={(TiempoEvolucionSintomas) =>  setFiltro({...filtro, TiempoEvolucionSintomas})}
            value={`${filtro.TiempoEvolucionSintomas}`}
          />
          <Text>Indicaciones</Text>
          <Input
            multiline={true}
            placeholder='Indicaciones'
            leftIcon={
              <MaterialCommunityIcons
                name='medical-bag'
                size={24}
                color='black'
              />
            }
            onChangeText={(Indicaciones) =>  setFiltro({...filtro, Indicaciones})}
            value={`${filtro.Indicaciones}`}
          />
      </View> 
      </KeyboardAvoidingView>
    </View>
  )
}