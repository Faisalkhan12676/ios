import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  ToastAndroid,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {TextInput, HelperText} from 'react-native-paper';
import {Button} from 'react-native-paper';
import {Formik, useFormik} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {color} from '../components/Colors';
import {BASE_URL} from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import Recaptcha from 'react-native-recaptcha-that-works';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import Recaptcha from 'react-native-recaptcha-that-works';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NetInfo from '@react-native-community/netinfo';
import firestore from '@react-native-firebase/firestore';
//6LfkbEMgAAAAAIkc9Cd-pls5ZspaVywaGQfgG4Dl Captha API Key
const validation = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const [isloading, setIsLoading] = useState(false);
  const [eye, setEye] = useState(true);
  const navigate = useNavigation();
  const dispatch = useDispatch();
  const [isConnected, setIsConnected] = useState();
  const [text, setText] = useState('');

  const loginstate = useSelector(state => state.LoginReducer.isLoggedIn);
  const [toast, setToast] = useState('');
  const [cardnotified, setCardNotified] = useState({});

  const size = 'normal';
  const $recaptcha = useRef();
  const handleOpenPress = useCallback(() => {
    $recaptcha.current.open();
  }, []);
  const handleClosePress = useCallback(() => {
    $recaptcha.current.close();
  }, []);

  useEffect(() => {
    //checkInternet
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      if (state.isConnected === true) {
        setIsConnected(true);
        setText('Connected');

        setTimeout(() => {
          setText('');
        }, 5000);
      } else if (state.isConnected === false) {
        setIsConnected(false);
        setText('No Internet Connection You Can Login Offline');
        setTimeout(() => {
          setText('');
        }, 5000);
      }
    });

    // Unsubscribe
    return () => unsubscribe();
  }, []);

  // useEffect(() => {
  //   const subscriber = firestore()
  //     .collection('Notification')
  //     .doc('cardNotification')
  //     .onSnapshot(documentSnapshot => {
  //       console.log('isNotified ', documentSnapshot.data());
  //       const {onLogIn, title} = documentSnapshot.data();
  //       setCardNotified({onLogIn, title});
  //     });
  //   // Stop listening for updates when no longer required
  //   return () => subscriber();
  // }, []);

  return (
    <>
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        validationSchema={validation}
        onSubmit={(values, {resetForm}) => {
          setIsLoading(true);
          //remove spaces from values
          const username = values.username.trim();
          const password = values.password.trim();
          const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection type', state.type);
            console.log('Is connected?', state.isConnected);
            if (state.isConnected === true) {
              console.log('IM  AVAILIBLE');
              AsyncStorage.removeItem('@studentData');
              axios
                .post(`${BASE_URL}/Auth/StudentLogin`, {
                  username,
                  password,
                })
                .then(res => {
                  const data = JSON.stringify(res.data);
                  try {
                    AsyncStorage.setItem('@userlogininfo', data);
                    AsyncStorage.setItem(
                      '@localLoginInfo',
                      JSON.stringify({
                        localusername: username,
                        lp_: password,
                      }),
                    );
                    console.log('data', data);

                    dispatch({type: 'LOGIN'});
                    if (loginstate) {
                      navigate.navigate('str');
                    }
                    resetForm();
                  } catch (e) {
                    // saving error
                  }
                })
                .catch(err => {
                  // console.log(err.data);
                  console.log(err.response.data);
                  setToast(err.response.data);
                  setIsLoading(false);
                });
            } else if (state.isConnected === false) {
              console.log('IM NOT AVAILIBLE');
              const loginOffline = async () => {
                const Local = await AsyncStorage.getItem('@localLoginInfo');

                if (Local !== null) {
                  //YOU ARE OFLINE
                  const data = JSON.parse(Local);
                  const {localusername, lp_} = data;
                  if (localusername === username && lp_ === password) {
                    dispatch({type: 'LOGIN'});
                    if (loginstate) {
                      navigate.navigate('str');
                    }
                  } else {
                    //ONLY THAT USER CAN LOGIN WHO HAVE PEVIOUS LOGIN
                    Alert.alert(
                      'Login Failed',
                      'Offline? Try To Login With Previous Creditentials',
                      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                      {cancelable: false},
                    );

                    setIsLoading(false);
                  }
                } else {
                  //TOAST YOU NEED TO CONNECT TO THE INTERNET
                  //disable btn
                  setIsLoading(false);
                  Alert.alert(
                    'NO INTERNET CONNECTION',
                    'Please connect to the internet to login',
                    [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                    {cancelable: false},
                  );
                }
              };

              loginOffline();
            }
          });

          // Unsubscribe
          unsubscribe();
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.container}>
            {/* {cardnotified.onLogIn ? (
              <>
                <View
                  style={{
                    height: 'auto',
                    width: '100%',
                    backgroundColor: '#ef233c',
                    position: 'absolute',
                    top: 0,
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      paddingHorizontal: 20,
                      color: '#fff',
                      backgroundColor: '#ef233c',
                    }}>
                    {cardnotified.title}
                  </Text>
                </View>
              </>
            ) : (
              <></>
            )} */}

            <Text
              style={{
                color:
                  text === 'No Internet Connection You Can Login Offline'
                    ? 'red'
                    : 'green',
                fontSize: 14,
              }}>
              {text}
            </Text>
            <View style={styles.logo}>
              <Image
                source={require('../assets/Bano-Qabil-Logo-Green.png')}
                style={styles.img}
              />
            </View>

            <View>
              <TextInput
                label="Username"
                onChangeText={handleChange('username')}
                value={values.name}
                style={styles.input}
                mode="flat"
                onBlur={handleBlur('username')}
                activeUnderlineColor={color.primary}
              />
              <HelperText
                type="error"
                visible={errors.username && touched.username}>
                {errors.username}
              </HelperText>

              <TextInput
                label="Password"
                secureTextEntry={eye}
                value={values.password}
                mode="flat"
                onBlur={handleBlur('password')}
                onChangeText={handleChange('password')}
                activeUnderlineColor={color.primary}
                right={
                  <TextInput.Icon
                    name={eye ? 'eye-off' : 'eye'}
                    onPress={() => (eye ? setEye(false) : setEye(true))}
                  />
                }
                style={styles.input}
              />
              <HelperText
                style={{textAlign: 'left'}}
                type="error"
                visible={errors.password}>
                {errors.password}
              </HelperText>
              <TouchableOpacity
                onPress={() => {
                  navigate.navigate('ForgetScreen');
                }}
                style={{
                  marginLeft: 10,
                }}>
                <Text style={{color: '#000'}}>Forgot Your Password?</Text>
              </TouchableOpacity>
              <View>
                <Text style={{color: 'red', marginLeft: 10}}>{toast}</Text>
              </View>

              <Button
                loading={isloading}
                onPress={handleSubmit}
                disabled={isloading}
                mode="contained"
                style={styles.button}>
                login
              </Button>
            </View>
            <TouchableOpacity onPress={() => navigate.navigate('Register')}>
              <Text
                style={{
                  width: '100%',
                  marginVertical: 20,
                  alignItems: 'center',
                }}>
                Don't Have Account?
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
  },
  input: {
    width: 300,
    height: 65,
    marginLeft: 10,
  },
  button: {
    width: 300,
    margin: 10,
    backgroundColor: color.primary,
    color: '#fff',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  logo: {
    width: 200,
    height: 200,
  },
});
