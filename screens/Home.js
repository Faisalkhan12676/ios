import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Paper from 'react-native-vector-icons/Ionicons';
import Cap from 'react-native-vector-icons/FontAwesome';
import Award from 'react-native-vector-icons/MaterialCommunityIcons';
import ProjectIcon from 'react-native-vector-icons/FontAwesome5';
import Slider from '../components/Swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {color} from '../components/Colors';
import {useNavigation} from '@react-navigation/native';
import Logout from '../components/Logout';
import {useDispatch} from 'react-redux';
import Info from 'react-native-vector-icons/MaterialIcons';
import AdmissionForm from './AdmissionForm';
import CheckBox from '@react-native-community/checkbox';
import {BASE_URL} from '../config';
import axios from 'axios';
import Header from '../components/Header';
import DeviceInfo from 'react-native-device-info';
import firestore from '@react-native-firebase/firestore';
import NetInfo from '@react-native-community/netinfo';
import {SafeAreaView} from 'react-native-safe-area-context';
import CountDown from 'react-native-countdown-component';

{
  /* <ion-icon name="qr-code-outline"></ion-icon> */
}

const Home = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const imgSourse = require('../assets/logo2.png');
  const [imgs, setImgs] = useState('');
  const [student, setStudent] = useState([]);
  const [title, setTitle] = useState('');
  const [bgcolor, setBgcolor] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [showcard, setShowCard] = useState(true);
  const [cardnotified, setCardNotified] = useState({});
  const [examloading, setExamLoading] = useState(true);
  const [localexam, setLocalExam] = useState({});
  useEffect(() => {
    firestore().enableNetwork();
    AsyncStorage.getItem('@userlogininfo')
      .then(value => {
        axios
          .get(`${BASE_URL}/ExamQuestion/GetAllWithRelationShipSecond`, {
            headers: {
              Authorization: `Bearer ${JSON.parse(value).token}`,
            },
          })
          .then(res => {
            console.log('STORED EXAM');
            // console.log(res.data);
            AsyncStorage.setItem(
              '@EXAMDATA',
              JSON.stringify({
                exam: res.data,
              }),
            );
          })
          .catch(err => {
            console.log(err);
          });

        axios
          .get(`${BASE_URL}/Student/GetByUserIdWithRelationShip`, {
            headers: {
              Authorization: `Bearer ${JSON.parse(value).token}`,
            },
          })
          .then(res => {
            // console.log(res.data);
            AsyncStorage.setItem('@studentData', JSON.stringify(res.data));
          })
          .catch(err => {
            console.log(err);
          });

        axios
          .get(`${BASE_URL}/Student/GetImage`, {
            headers: {
              Authorization: `Bearer ${JSON.parse(value).token}`,
            },
          })
          .then(res => {
            // console.log(res.data);
            AsyncStorage.setItem('@studentImage', JSON.stringify(res.data));
          })
          .catch(err => {
            console.log(err);
          });

        axios
          .get(
            `${BASE_URL}/StudentEducation/GetAllByStudentIdWithRelationShip`,
            {
              headers: {
                Authorization: `Bearer ${JSON.parse(value).token}`,
              },
            },
          )
          .then(res => {
            // console.log(res.data);
            AsyncStorage.setItem('@userEducation', JSON.stringify(res.data));
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });

    //get version of app
    const getv = DeviceInfo.getVersion();
    // console.log(getv);

    const isExamexist = id => {
      firestore()
        .collection('exam')
        .where('stdid', '==', `${id}`)
        .get()
        .then(res => {
          console.log(res.docs, 'ress');
          if (res.docs == []) {
            res.docs.map(doc => {
              console.log(doc.data(), 'doc');
              const {exam} = doc.data();
              console.log(exam, 'exam');
              if (exam.length > 0) {
                setToggle(true);
                setTitle('Result will be announced in few days');
                setBgcolor(true);
              } else {
                setToggle(false);
                setTitle('Test will be conducted on 3rd of July 2022');
                setBgcolor(false);
              }
            });
          } else {
            setToggle(false);
            setTitle('Test will be conducted on 3rd of July 2022');
            setBgcolor(false);
          }
        })
        .catch(err => {
          setToggle(false);
          setTitle('Test will be conducted on 3rd of July 2022');
          setBgcolor(false);
        });
    };

    AsyncStorage.getItem('@studentData')
      .then(res => {
        const val = JSON.parse(res);
        const {student, user} = val;
        setStudent(user.id);
        isExamexist(user.id);
        console.log(user);
      })
      .catch(err => {
        console.log(err);
      });

    // AsyncStorage.getItem('@finishtitle')
    //   .then(res => {
    //     console.log(res);
    //     const {id,title} = JSON.parse(res);
    //     console.log(student,"STUDENT IDD");
    //     if(id == student.id){
    //       setTitle(title);
    //       setBgcolor(true);
    //     }else{
    //       setTitle(' Test will be conducted on 3rd of July 2022');
    //       setBgcolor(false);
    //       AsyncStorage.removeItem('@finishtitle');
    //     }
    //   })
    //   .catch(err => {
    //     console.log(err);

    //   });
    // AsyncStorage.removeItem('@finishtitle')
  }, []);

  //SHOW CARD AND DONT SHOW CARD
  useEffect(() => {
    const subscriber = firestore()
      .collection('showExamAndAttendance')
      .doc('008')
      .onSnapshot(documentSnapshot => {
        console.log('isEXAM ', documentSnapshot.data());
        const {isExam} = documentSnapshot.data();
        setShowCard(isExam);
      });
    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  useEffect(() => {
    const subscriber = firestore()
      .collection('Notification')
      .doc('cardNotification')
      .onSnapshot(documentSnapshot => {
        console.log('isNotified ', documentSnapshot.data());
        const {onHome, title} = documentSnapshot.data();
        setCardNotified({onHome, title});
        if (onHome == true) {
          setExamLoading(false);
        } else if (onHome == false) {
          setExamLoading(true);
        }
      });
    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  useEffect(() => {
    const subscriber = firestore()
      .collection('demoExam')
      .doc('demoExam')
      .onSnapshot(documentSnapshot => {
        console.log('isDemoExam ', documentSnapshot.data());
        const {isDemoExam} = documentSnapshot.data();
        setLocalExam(isDemoExam);
      });
    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  return (
    <>
      {/* HEADER */}
      <SafeAreaView
        style={{
          backgroundColor: '#fff',
          flex: 1,
        }}>
        <ScrollView
          style={{
            backgroundColor: '#fff',
          }}>
          <Header />
          <Slider />

          <View style={styles.container}>
            {/* <ion-icon name="alert-circle-outline"></ion-icon> */}

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => navigation.navigate('selectedCourses')}>
              <View style={styles.card}>
                <Paper name="cog-outline" size={60} style={styles.clr} />
                <Text style={styles.clr}>Preferences</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => navigation.navigate('admitCard')}>
              <View style={styles.card}>
                <Info name="person" size={38} style={styles.clr} />
                <View>
                  <Text style={styles.clr}>Admit Card</Text>
                </View>
              </View>
            </TouchableOpacity>

            {localexam ? (
              <>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => navigation.navigate('demoexam')}>
                  <View style={styles.card}>
                    <Paper name="copy-outline" size={38} style={styles.clr} />
                    <View>
                      <Text style={styles.clr}>Demo Exam</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </>
            ) : (
              <></>
            )}

            {showcard ? (
              <>
                {examloading ? (
                  <></>
                ) : (
                  <>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => navigation.navigate('exam')}>
                      <View style={styles.card}>
                        <Paper
                          name="copy-outline"
                          size={38}
                          style={styles.clr}
                        />
                        <Text style={styles.clr}>Exam</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => navigation.navigate('attendence')}>
                      <View style={styles.card}>
                        <Paper
                          name="qr-code-outline"
                          size={32}
                          style={styles.clr}
                        />
                        <Text style={styles.clr}>Attendence</Text>
                      </View>
                    </TouchableOpacity>
                  </>
                )}
              </>
            ) : (
              <></>
            )}
          </View>

          {cardnotified.onHome ? (
            <>
              <View
                style={{
                  width: '100%',
                  height: 'auto',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '90%',
                    height: 'auto',
                    backgroundColor: bgcolor ? color.primary : '#ef233c',
                    borderRadius: 10,
                    marginHorizontal: 10,
                    marginVertical: 10,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.22,
                    shadowRadius: 2.22,

                    elevation: 3,
                    borderColor: color.divider,
                    borderWidth: 2.5,
                  }}>
                  {/* <ProjectIcon name="fa-3" size={60} style={styles.clr} /> */}
                  <Text style={styles.clr}>{cardnotified.title}</Text>
                </View>
              </View>
            </>
          ) : (
            <></>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Home;

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
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 22,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    width: '100%',

    flex: 1,
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 140,
    height: 140,
    backgroundColor: color.primary,
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    borderColor: color.divider,
    borderWidth: 2.5,
  },
  clr: {
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
