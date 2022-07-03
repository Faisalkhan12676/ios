import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Pressable,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  Button,
  DataTable,
  ActivityIndicator,
  Colors,
  Modal,
  Portal,
  Text,
  Provider,
  TextInput,
  RadioButton,
  HelperText,
  Avatar,
} from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../config';
import {Divider} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {color} from '../components/Colors';
import DatePicker from 'react-native-date-picker';
import RNPickerSelect from 'react-native-picker-select';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';

const ShowStd = () => {
  const navigation = useNavigation();
  const [imgs, setImgs] = useState('');
  const [token, setToken] = useState('');
  const [visible, setVisible] = React.useState(false);
  const [data, setData] = useState([]);
  const [image, setImage] = React.useState(null);
  const [ext, setExt] = React.useState(null);
  const [imgplaceholder, setImgplaceholder] = useState('Add Image');

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white', padding: 20};

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const [district, setDistrict] = useState([]);
  const [city, setCity] = useState([]);
  const [id, setId] = useState('');
  // const [user, setUser] = useState([]);
  const [education, setEducation] = useState([]);

  const [user, setUser] = useState({});
  const [student, setStudent] = useState({});
  const [img, setImg] = useState('');
  const [edu, setedu] = useState([]);

  useEffect(() => {
    // const getstudent = async () => {
    //   const value = await AsyncStorage.getItem('@userlogininfo');
    //   if (value !== null) {
    //     const data = JSON.parse(value);
    //     setToken(data.token);

    const getAdmitCard = async () => {
      try {
        const value = await AsyncStorage.getItem('@studentData');
        if (value !== null) {
          // We have data!!
          const data = JSON.parse(value);
          // console.log(data);
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
          const data = JSON.parse(value);
          setImg(data.image);
          setIsLoading(false);
        }
      } catch (error) {
        // Error retrieving data
        console.log(error);
      }
    };
    getimg();

    AsyncStorage.getItem('@userEducation')
      .then(res => {
        setedu(JSON.parse(res)[0]);
        console.log(JSON.parse(res));
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const handleArea = value => {
    console.log(value + 'ID');
    axios
      .get(`${BASE_URL}/Area/GetByCityId?id=${value}`, {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then(res => {
        setDistrict(res.data);
        // console.log(res.data);
      })
      .catch(err => {
        console.log(err + 'FROM CITY POST');
      });
  };

  const ImageHandle = () => {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'photo',
      includeBase64: true,
    };
    launchImageLibrary(options, response => {
      // Same code as in above section!
      // const {base64} = response.assets;
      //  console.log(base64);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ');
      } else if (response.customButton) {
        console.log('User tapped custom button: ');
      } else {
        const {type} = response.assets[0];
        const typeSplit = type.split('/');
        const {base64} = response.assets[0];
        setImgplaceholder('Image Added');
        setImage(base64);
        setExt(typeSplit[1]);
      }
    });
  };

  //modify designation array with custom key
  const areaarr = district.map((item, index) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  const cityarr = city.map((item, index) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  const today = new Date().toISOString().split('T')[0];

  console.log(id);
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <SafeAreaView>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.title}>
              <Avatar.Image size={70} source={{uri: img}} />

              {/* <Button mode="contained" style={styles.button} onPress={showModal}>
              Edit
            </Button> */}
              <Button
                mode="contained"
                style={styles.button}
                onPress={() => navigation.navigate('changepass')}>
                <Icon name="key" size={20} />
              </Button>
            </View>
            <Divider />
            <View style={styles.div}>
              <Text style={styles.headding}>Registration No</Text>
              <Text style={styles.text}>{user.username + user.id}</Text>
            </View>
            <Divider />
            <View style={styles.div}>
              <Text style={styles.headding}>Name</Text>
              <Text style={styles.text}>{user.name}</Text>
            </View>
            <Divider />

            <View style={styles.div}>
              <Text style={styles.headding}>Father Name</Text>
              <Text style={styles.text}>{student.fatherName}</Text>
            </View>
            <Divider />
            <View style={styles.div}>
              <Text style={styles.headding}>Email</Text>
              <Text style={styles.text}>{student.email}</Text>
            </View>
            <Divider />

            {/* <View style={styles.div}>
            <Text style={styles.headding}>CNIC</Text>
            <Text style={styles.text}>{data.cnic}</Text>
          </View>
          <Divider /> */}
            <View style={styles.div}>
              <Text style={styles.headding}>Gender</Text>
              <Text style={styles.text}>{student.gender}</Text>
            </View>
            <Divider />

            <View style={styles.div}>
              <Text style={styles.headding}>Present Address</Text>
              <Text style={styles.text}>{student.presentAddress}</Text>
            </View>
            <Divider />

            <View style={styles.div}>
              <Text style={styles.headding}>Date of Birh</Text>
              <Text style={styles.text}>{student.dob}</Text>
            </View>
            <Divider />

            {/* <View style={styles.div}>
            <Text style={styles.headding}>Phone</Text>
            <Text style={styles.text}>{data.otherNumber}</Text>
          </View>
          <Divider /> */}

            <View style={styles.div}>
              <Text style={styles.headding}>Father Occupation</Text>
              <Text style={styles.text}>{student.fatherOccupation}</Text>
            </View>
            <Divider />

            <View style={styles.div}>
              <Text style={styles.headding}>Whatsapp</Text>
              <Text style={styles.text}>{student.whatsappNumber}</Text>
            </View>
            <Divider />

            <View style={styles.div}>
              <Text style={styles.headding}>Facebook</Text>
              <Text style={styles.text}>{student.facebookAccount}</Text>
            </View>
            <Divider />

            {/* <View style={styles.div}>
            <Text style={styles.headding}>LinkedIn</Text>
            <Text style={styles.text}>{data.linkedinAccount}</Text>
          </View>
          <Divider /> */}

            {/* <View style={styles.div}>
            <Text style={styles.headding}>Instagram</Text>
            <Text style={styles.text}>{data.instagramAccount}</Text>
          </View>
          <Divider /> */}

            <View style={styles.div}>
              <Text style={styles.headding}>Enrollment Date</Text>
              <Text style={styles.text}>{student.enrollmentDate}</Text>
            </View>

            <View style={styles.div}>
              <Text style={styles.headding}>Education</Text>
              <Text style={styles.text}>{edu.degrees}</Text>
            </View>
            <Divider />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default ShowStd;

const styles = StyleSheet.create({
  div: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headding: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  text: {
    fontSize: 20,
  },
  title: {
    padding: 20,
    fontSize: 20,
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modal: {
    height: 500,
    paddingTop: 30,
  },
  button: {
    backgroundColor: color.primary,
  },
});
