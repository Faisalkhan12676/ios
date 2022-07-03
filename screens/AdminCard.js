import {
  StyleSheet,
  Text,
  View,
  Image,
  Share,
  Dimensions,
  PermissionsAndroid,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import {
  Avatar,
  Button,
  Divider,
  ActivityIndicator,
  Colors,
} from 'react-native-paper';
import ViewShot, {captureScreen} from 'react-native-view-shot';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../config';
import QRCode from 'react-native-qrcode-svg';
import { color } from '../components/Colors';
// import Barcode from '@kichiyaki/react-native-barcode-generator';

const imgSourse = require('../assets/logo2.png');

const AdminCard = () => {
  const ViewShotref = useRef();
  const [isloading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  const [student, setStudent] = useState({});
  const [img, setImg] = useState('');
  useEffect(() => {
    //get admit card info from async storage
    const getAdmitCard = async () => {
      try {
        const value = await AsyncStorage.getItem('@studentData');
        if (value !== null) {
          // We have data!!
          const data = JSON.parse(value);
          console.log(data);

          const {student, user} = data;
          setStudent(student);
          setUser(user);

          setIsLoading(false);
        }
      } catch (error) {
        // Error retrieving data
        console.log(error);
      }
    };
    getAdmitCard();

    const getimg = async () => {
      try {
        const value = await AsyncStorage.getItem('@studentImage');
        if (value !== null) {
          // We have data!!
          const data = JSON.parse(value);
          // console.log(data);
          // console.log(data.img);
          setImg(data.image);
          setIsLoading(false);
        }
      } catch (error) {
        // Error retrieving data
        console.log(error);
      }
    };
    getimg();
  }, []);

  const barcode = user.id;

  var segs = [
    {data: `Registration No ${user.username + user.id}`, mode: 'byte'},
    {data: `\n Name ${user.name}`, mode: 'byte'},
    {data: `\n Father Name ${student.fatherName}`, mode: 'byte'},
    {data: `\n Phone Number ${student.whatsappNumber}`, mode: 'byte'},
  ];


  // var hms = '02:04:33';
  // var a = hms.split(':');
  // var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 

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
          <View style={styles.container}>
            <ViewShot
              style={styles.cardcontainer}
              ref={ViewShotref}
              options={{format: 'png', quality: 1.0}}>
              <Avatar.Image size={120} source={{uri: img}} />

              <View style={styles.content}>
                <Text style={styles.title}>Registration No</Text>
                <Text style={styles.title}>{user.username + user.id}</Text>
              </View>
              <Divider
                style={{
                  height: 2,
                  width: '100%',
                }}
              />

              <View style={styles.content}>
                <Text style={styles.title}>Name</Text>
                <Text style={styles.title}>{user.name}</Text>
              </View>
              <Divider
                style={{
                  height: 2,
                  width: '100%',
                }}
              />
              <View style={styles.content}>
                <Text style={styles.title}>Father Name</Text>
                <Text style={styles.title}>{student.fatherName}</Text>
              </View>
              <Divider
                style={{
                  height: 2,
                  width: '100%',
                }}
              />
              <View style={styles.content}>
                <Text style={styles.title}>Phone</Text>
                <Text style={styles.title}>{student.whatsappNumber}</Text>
              </View>
              <Divider
                style={{
                  height: 2,
                  width: '100%',
                }}
              />
              <View
                style={{
                  marginTop: 20,
                }}>
                <QRCode value={segs} backgroundColor="transparent" size={120} />
                
              </View>
              {/* <Barcode
                  format="CODE128B"
                  value="10000"
                  style={{
                    marginTop: 10,
                  }}
                  maxWidth={(Dimensions.get('window').width * 2) / 3}
                /> */}
            </ViewShot>
          </View>
        </>
      )}
    </>
  );
};

export default AdminCard;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 20,
  },
  cardcontainer: {
    width: '100%',
    height: "auto",
    alignItems: 'center',
    backgroundColor: '#ced4da',
    marginHorizontal: 20,
    paddingVertical: 50,
    borderRadius: 10,
    //shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
    paddingHorizontal: 10,
  },

  content: {
    width: '100%',
    padding: 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 16,
    marginHorizontal: 10,
  },
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
