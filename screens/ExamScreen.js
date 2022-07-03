import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  Modal,
  AppState,
  Image,
  BackHandler,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  RadioButton,
  Colors,
  ActivityIndicator,
} from 'react-native-paper';
import CheckBox from '@react-native-community/checkbox';
import {color} from '../components/Colors';
import CountDown from 'react-native-countdown-component';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Ionicons';
import {StackActions, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../config';
import firestore from '@react-native-firebase/firestore';
import NetInfo from '@react-native-community/netinfo';
import {firebase} from '@react-native-firebase/messaging';
import {SafeAreaView} from 'react-native-safe-area-context';
import AlertIcon from 'react-native-vector-icons/Ionicons';

const ExamScreen = () => {
  const navigate = useNavigation();
  const exam = [
    {
      id: 1,
      question: 'DEMO QUESTION',
      questionType: 'string',
      option: [
        {
          option: 'DEMO1',
          isChecked: false,
        },
        {
          option: 'DEMO2',
          isChecked: false,
        },
        {
          option: 'DEMO3',
          isChecked: false,
        },
      ],
    },
  ];

  const [modalVisible, setModalVisible] = useState(false);
  const [modalattendance, setModalattendance] = useState(false);
  const [modalalreadyexam, setModalalreadyexam] = useState(false);
  const [examwillstart, setExamwillstart] = useState(false);
  const [finished, setFinished] = useState(false);
  const [state, setState] = useState(exam);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [backdisbaled, setBackDisabled] = useState(true);
  const [isloading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [id, setId] = useState('');
  const [examId, setExamId] = useState('');
  const [duration, setDuration] = useState('');
  const [startedTime, setStartedTime] = useState('');
  const imgSourse = require('../assets/logo2.png');

  const [checkedques, setCheckedques] = useState([]);
  const [autoSubmit, setAutoSubmit] = useState(false);

  const getcount = (id) => {
    firestore()
      .collection('examstudent')
      .doc(`${id}`)
      .get()
      .then(res => {
        const increment = firebase.firestore.FieldValue.increment(1);
        const examid = res.data().examid;
        firebase.firestore().collection('examlist').doc(`${examid}`).update({
          examstartcount: increment, // increment age by 1
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const getExam = () => {
    AsyncStorage.getItem('@EXAMDATA')
      .then(value => {
        let examData = JSON.parse(value);
        const {id} = examData.exam[0];
        const x = String(id);
        setExamId(id);
        console.log(x, 'EXAM ID I HAVE GOT FROM ASYNCSTORAGE');
        console.log(examData.exam, 'EXAM LOCAL YES');
        setState(examData.exam);

        // setExamId()
      })
      .catch(err => {
        console.log(err);
      });
  };

  const isExamexist = id => {
    firestore()
      .collection('exam')
      .where('stdid', '==', id)
      .get()
      .then(res => {
        //INCREAMENT WORK

        //INCREAMENT WORK

        console.log(res.docs, 'ress');
        res.docs.map(doc => {
          console.log(doc.data(), 'doc');
          const {exam} = doc.data();
          console.log(exam, 'exam');
          if (exam.length > 0) {
            setModalalreadyexam(true);
          } else {
            setIsLoading(false);
            getcount(id);
          }
        });
      });
  };

  const isExamStatus = (id, exId) => {
    firestore()
      .collection('examstudent')
      .doc(`${id}`)
      .get()
      .then(res => {
        console.log(res.data().examstatus, 'ISEXIST DATA');

        var today = new Date();

        var time =
          today.getHours() +
          ':' +
          today.getMinutes() +
          ':' +
          today.getSeconds();
        if (res.data().examstatus == true) {
          firestore().collection('exam').doc(`${id}`).update({
            startexamtime: time,
          });

          isExamexist(id);
        } else {
          setExamwillstart(true);

        }
      })
      .catch(err => {
        console.log(err, 'TEST');
        setExamwillstart(true);
      });
  };

  const getData = id => {
    console.log(id, 'IM FROM GETDATA');
    firestore()
      .collection('exam')
      .doc(id)
      .get()
      .then(res => {
        console.log(res, 'EXISTSx');
        if (!res.exists) {
          setModalattendance(true);
        } else {
          // firestore().collection('exam').doc(`${id}`).update({
          //   examstart: true,
          // });
          isExamStatus(id, examId);
          console.log('YES YOU ARE PRESENT');
        }
      })
      .catch(err => {
        console.log(err, 'ERORR FROM FIREBASE');
        setModalattendance(true);
      });
  };

  const StudentDetail = () => {
    AsyncStorage.getItem('@studentData')
      .then(value => {
        let studentData = JSON.parse(value);
        const {student, user} = studentData;
        setData(user);
        console.log(typeof String(student.userId), 'ID');
        const x = String(student.userId);
        getData(x);

        setId(x);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const getFirebaseTime = () => {
    firestore()
      .collection('examstatus')
      .doc('007')
      .get()
      .then(res => {
        AsyncStorage.setItem(
          '@examStartTime',
          JSON.stringify(res.data().examstarttime),
        )
          .then(res => {
            console.log('SAVED TIME');
          })
          .catch(err => {
            console.log(err);
          });
        //DURATION
        AsyncStorage.setItem(
          '@examDuration',
          JSON.stringify(res.data().examDuration),
        )
          .then(res => {
            console.log('SAVED DURATION');
          })
          .catch(err => {
            console.log(err);
          });
      });
  };

  useEffect(() => {
    // isExamStatus();
    getExam();
    StudentDetail();
    // console.log(data.id,"ID")
    getFirebaseTime();
    // function howManySeconds(hours) {
    //   let time_arr = hours.split(':');
    //   let final_arr = time_arr.map(e => {
    //     return parseInt(e);
    //   });
    //   let second = final_arr[0] * 3600 + final_arr[1] * 60;
    //   return second;
    // }

    // function CalculateDuration(startTm, dura) {
    //   let startTime = howManySeconds(startTm);
    //   let duration = howManySeconds(dura);
    //   let current = new Date();
    //   let currentSecond = current.getSeconds();
    //   let spendHours = currentSecond - startTime;
    //   let final = spendHours - duration;
    //   return Math.floor(final / 60);
    // }
    AsyncStorage.getItem('@examStartTime')
      .then(value => {
        const a = JSON.parse(value);
        console.log(typeof a, 'EXAM START TIME');

        AsyncStorage.getItem('@examDuration')
          .then(value => {
            const x = JSON.parse(value);
            console.log(typeof x, 'EXAM DURATION');

            //  console.log(CalculateDuration(x, a), 'CALCULATION DURATION');
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const handlepress = id => {
    const finalarr = state.filter(item => {
      return item.option.filter(item => {
        return item.isChecked === true;
      });
    });
    var today = new Date();

    var time =
      today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

    firestore()
      .collection('exam')
      .doc(`${id}`)
      .update({
        exam: finalarr,
        endTime: time,
      })
      .then(res => {
        console.log(res);
        const title = {
          id: id,
          title: 'Result will announce in few days',
        };
        AsyncStorage.setItem('@finishtitle', JSON.stringify(title));
      })
      .catch(err => {
        console.log(err);
      });

    //WORK

    firestore()
      .collection('examstudent')
      .doc(`${id}`)
      .get()
      .then(res => {
        const increment = firebase.firestore.FieldValue.increment(1);
        const examid = res.data().examid;
        firebase.firestore().collection('examlist').doc(`${examid}`).update({
          examsubmitcount: increment, // increment age by 1
        });

        isExamexist(id);
      })
      .catch(err => {
        console.log(err);
      });
  };

  // useEffect(() => {
  //   const backAction = () => {
  //     Alert.alert('Hold on!', 'Are you sure you want to go back?', [
  //       {
  //         text: 'Cancel',
  //         onPress: () => null,
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'YES',
  //         onPress: () => {
  //           BackHandler.exitApp();
  //         },
  //       },
  //     ]);
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );

  //   return () => backHandler.remove();
  // }, []);

  return (
    <>
      {/* --------------------------------------------------------------------------------- */}

      {isloading ? (
        <>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}>
            <ActivityIndicator size="large" color={color.primary} />
            <Text>Loading...</Text>
          </View>
          <Modal
            visible={modalattendance}
            animationType="slide"
            transparent={true}
            onRequestClose={() => {
              setModalattendance(false);
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <View
                style={{
                  width: '80%',
                  height: 'auto',
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  paddingVertical: 50,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  Please mark your attendance 1st, before conducting exam
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginVertical: 10,
                    paddingHorizontal: 10,
                    marginTop: 30,
                  }}>
                  <Button
                    color={color.primary}
                    onPress={() => {
                      setModalattendance(false);
                      navigate.dispatch(StackActions.replace('attendence'));
                    }}>
                    OK
                  </Button>
                </View>
              </View>
            </View>
          </Modal>

          <Modal
            visible={modalalreadyexam}
            animationType="slide"
            transparent={true}
            onRequestClose={() => {
              setModalalreadyexam(false);
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <View
                style={{
                  width: '80%',
                  height: 'auto',
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  paddingVertical: 50,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  You have already submitted your exam.
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginVertical: 10,
                    paddingHorizontal: 10,
                    marginTop: 30,
                  }}>
                  <Button
                    color={color.primary}
                    onPress={() => {
                      setModalalreadyexam(false);
                      navigate.dispatch(StackActions.replace('TabNavigator'));
                    }}>
                    OK
                  </Button>
                </View>
              </View>
            </View>
          </Modal>

          <Modal
            visible={examwillstart}
            animationType="slide"
            transparent={true}
            onRequestClose={() => {
              setExamwillstart(false);
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <View
                style={{
                  width: '80%',
                  height: 'auto',
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  paddingVertical: 50,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  Please wait exam will start shortly.
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginVertical: 10,
                    paddingHorizontal: 10,
                    marginTop: 30,
                  }}>
                  <Button
                    color={color.primary}
                    onPress={() => {
                      setExamwillstart(false);
                      navigate.dispatch(StackActions.replace('TabNavigator'));
                    }}>
                    OK
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
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

          <Card>
            <Card.Content>
              <View>
                <CountDown
                  until={3600}
                  size={25}
                  onFinish={() => {
                    setAutoSubmit(true);
                    handlepress();
                  }}
                  digitStyle={{backgroundColor: '#FFF'}}
                  digitTxtStyle={{color: '#ef233c'}}
                  timeToShow={['M', 'S']}
                  timeLabels={{m: null, s: null}}
                  showSeparator
                  separatorStyle={{fontSize: 20, color: '#ef233c'}}
                />
                <Text
                  style={{
                    fontSize: 18,
                    textAlign: 'center',
                    color: 'red',
                  }}>
                  Time Remaining
                </Text>
              </View>
              <Text style={{color: '#495057', fontSize: 16, marginVertical: 3}}>
                Student Name: {data.name}
              </Text>
              <Text style={{color: '#495057', fontSize: 16, marginVertical: 3}}>
                Enrollment No: {data.username + data.id}
              </Text>

              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  textAlign: 'right',
                  marginHorizontal: 20,
                }}>
                {currentQuestion + 1}/{state.length}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    textAlign: 'right',
                    marginHorizontal: 20,
                    color: '#495057',
                  }}>
                  Attempted
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'right',
                    marginHorizontal: 20,
                    color: '#495057',
                  }}>
                  {checkedques.length}
                </Text>
              </View>
            </Card.Content>
          </Card>

          <ScrollView>
            <View>
              {state[currentQuestion].questionType === 'string' ? (
                <>
                  <Card
                    style={{
                      margin: 10,
                    }}>
                    <View></View>
                    <Card.Content>
                      <Title>{state[currentQuestion].question}</Title>
                      {state[currentQuestion].option.map((item, i) => {
                        return (
                          <>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginLeft: 15,
                                marginVertical: 5,
                              }}>
                              <CheckBox
                                value={item.isChecked}
                                onValueChange={() => {
                                  item.isChecked = !item.isChecked;
                                  setState([...state]);
                                }}
                              />
                              <Paragraph>{item.option}</Paragraph>
                            </View>
                          </>
                        );
                      })}
                    </Card.Content>
                  </Card>
                </>
              ) : (
                <>
                  <Card
                    style={{
                      margin: 10,
                    }}>
                    <Card.Content>
                      <Title>{state[currentQuestion].question}</Title>

                      {state[currentQuestion].option.map((item, i) => {
                        return (
                          <RadioButton.Group
                            onValueChange={e => {
                              //if option is checked then set all other option to false
                              if (e === item.option) {
                                state[currentQuestion].option.map((item, i) => {
                                  item.isChecked = false;
                                });
                                item.isChecked = true;
                                setState([...state]);
                              }
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <RadioButton.Item
                                value={item.option}
                                status={
                                  item.isChecked ? 'checked' : 'unchecked'
                                }
                              />
                              <Paragraph>{item.option}</Paragraph>
                            </View>
                          </RadioButton.Group>
                        );
                      })}
                    </Card.Content>
                  </Card>
                </>
              )}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 10,
                  paddingHorizontal: 10,
                }}>
                <Button
                  mode="contained"
                  color={color.primary}
                  disabled={currentQuestion === 0 ? true : false}
                  onPress={() => {
                    setCurrentQuestion(currentQuestion - 1);
                  }}>
                  Previous
                </Button>
                {currentQuestion === state.length - 1 ? (
                  <>
                    <Button
                      mode="contained"
                      color={color.primary}
                      onPress={() => setModalVisible(true)}>
                      Finish
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      disabled={
                        currentQuestion === state.length - 1 ? true : false
                      }
                      mode="contained"
                      color={color.primary}
                      onPress={() => {
                        setCurrentQuestion(currentQuestion + 1);
                        //check how many isCheck is true and store into array
                        let arr = [];
                        state[currentQuestion].option.map((item, i) => {
                          if (item.isChecked) {
                            setCheckedques([...checkedques, item.option]);
                          }
                        });
                      }}>
                      NEXT
                    </Button>
                  </>
                )}
              </View>
            </View>
          </ScrollView>

          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => {
              setModalVisible(false);
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <View
                style={{
                  width: '80%',
                  height: 'auto',
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  paddingVertical: 50,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: '#000',
                  }}>
                  Are you sure to finish your exam?
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginVertical: 10,
                    paddingHorizontal: 10,
                    marginTop: 30,
                  }}>
                  <Button
                    color={color.primary}
                    onPress={() => {
                      setModalVisible(false);
                    }}>
                    NO
                  </Button>
                  <Button
                    mode="contained"
                    color={color.primary}
                    onPress={() => {
                      setModalVisible(false);
                      handlepress(data.id);
                      setFinished(true);
                    }}>
                    YES
                  </Button>
                </View>
              </View>
            </View>
          </Modal>

          <Modal
            visible={finished}
            animationType="slide"
            transparent={true}
            onRequestClose={() => {
              setFinished(false);
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <View
                style={{
                  width: '80%',
                  height: 'auto',
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  paddingVertical: 50,
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      color: '#000',
                    }}>
                    Your exam is submitted successfully
                  </Text>
                  <AlertIcon
                    name="checkmark-circle-outline"
                    size={40}
                    color={color.primary}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginVertical: 10,
                    paddingHorizontal: 10,
                    marginTop: 30,
                  }}>
                  <Button
                    color={color.primary}
                    onPress={() => {
                      setFinished(false);
                      navigate.dispatch(StackActions.replace('TabNavigator'));
                    }}>
                    OK
                  </Button>
                </View>
              </View>
            </View>
          </Modal>

          <Modal
            visible={autoSubmit}
            animationType="fade"
            transparent={true}
            onRequestClose={() => {
              setAutoSubmit(false);
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
              }}>
              <View
                style={{
                  width: '80%',
                  height: 'auto',
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  paddingVertical: 50,
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      color: '#000',
                    }}>
                    Exam time is over, your exam is auto submitted.
                  </Text>
                  <AlertIcon
                    name="checkmark-circle-outline"
                    size={40}
                    color={color.primary}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginVertical: 10,
                    paddingHorizontal: 10,
                    marginTop: 30,
                  }}>
                  <Button
                    color={color.primary}
                    onPress={() => {
                      setAutoSubmit(false);
                      navigate.dispatch(StackActions.replace('TabNavigator'));
                    }}>
                    OK
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}

      {/* ---------------------------------------------------------------------------------------- */}
    </>
  );
};

export default ExamScreen;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
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
