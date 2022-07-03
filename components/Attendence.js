import {StyleSheet, Text, View,Image} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Avatar,
  Button,
  Divider,
  ActivityIndicator,
  Colors,
} from 'react-native-paper';
import {color} from './Colors';
const imgSourse = require('../assets/logo2.png');
const Attendence = () => {
  const [gender, setGender] = useState('');
  const [id, setId] = useState('');
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {

    
    //get admit card info from async storage
    const getAttendence = () => {
      AsyncStorage.getItem('@studentData')
        .then(value => {
          const val = JSON.parse(value);
          const {student, user} = val;
          const a_gender = student.gender === 'Male' ? 0 : 1;
          console.log(a_gender);
          setGender(a_gender);
          setId(user.id);
          setIsLoading(false);
          // console.log(user.id, "ID");
        })
        .catch(error => {
          console.log(error);
        });
    };
    getAttendence();
  }, []);
  
 
  return (
    <>
      {isloading ? (
        <>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator animating={true} color={Colors.green400} />
          </View>
        </>
      ) : (
        <>
         <View style={styles.header}>
            <View
              style={{
                height: 60,
                width: 100,
              }}>
              <Image
                source={require('../assets/Bano-Qabil-Logo-Green.png')}
                style={styles.logo}
              />
            </View>
            <View
              style={{
                height: 60,
                width: 100,
              }}>
              <Image
                source={imgSourse}
                style={{
                  height: '100%',
                  width: '100%',
                  resizeMode: 'contain',
                }}
              />
            </View>
          </View>
          <Text
            style={{
              fontSize: 30,
              fontWeight: 'bold',
              textAlign: 'center',
              marginTop: 20,
              color: color.primary,
            }}>
            Attendence
          </Text>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <QRCode
              value={`${id.toString()}-${gender}`}
              backgroundColor="transparent"
              size={120}
            />
          </View>
        </>
      )}
    </>
  );
};

export default Attendence;

const styles = StyleSheet.create({
  header: {
    backgroundColor: color.light,
    height: 70,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
