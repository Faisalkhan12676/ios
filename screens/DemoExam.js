import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Alert,
    Modal,
    AppState,
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
  import {useNavigation} from '@react-navigation/native';
  import axios from 'axios';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import {BASE_URL} from '../config';
  import firestore from '@react-native-firebase/firestore';
  import NetInfo from '@react-native-community/netinfo';
  import {firebase} from '@react-native-firebase/messaging';
  import {SafeAreaView} from 'react-native-safe-area-context';
  
  const DemoExam = () => {
    const navigation = useNavigation();
    const exam = [
      {
        id: 48,
        question:
          'Most of the programming tools use the __________ statement to make decisions',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'while',
            isChecked: false,
          },
          {
            option: 'for',
            isChecked: false,
          },
          {
            option: 'do-while',
            isChecked: false,
          },
          {
            option: 'if',
            isChecked: false,
          },
        ],
      },
      {
        id: 22,
        question:
          '_____________ Systems are networked appliances and they contain one or more than one of hard drives.',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'SAN',
            isChecked: false,
          },
          {
            option: 'NAS',
            isChecked: false,
          },
          {
            option: 'NFS',
            isChecked: false,
          },
          {
            option: 'SBM',
            isChecked: false,
          },
        ],
      },
      {
        id: 15,
        question:
          'A __________ connection use a telephone line to connect to the internet..',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'wired',
            isChecked: false,
          },
          {
            option: 'dail-up',
            isChecked: false,
          },
          {
            option: 'internet',
            isChecked: false,
          },
          {
            option: 'ISP',
            isChecked: false,
          },
        ],
      },
      {
        id: 31,
        question:
          'Which of the following uses pointer to variables rather than variable names',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'scanf()',
            isChecked: false,
          },
          {
            option: 'printf()',
            isChecked: false,
          },
          {
            option: 'getc()',
            isChecked: false,
          },
          {
            option: 'putc()',
            isChecked: false,
          },
        ],
      },
      {
        id: 2,
        question: 'Which one is the oldest browser among the follwing',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'Mozilla Firefox',
            isChecked: false,
          },
          {
            option: 'Opera',
            isChecked: false,
          },
          {
            option: 'Internet Explorer',
            isChecked: false,
          },
          {
            option: 'Netscape Navigator',
            isChecked: false,
          },
        ],
      },
      {
        id: 40,
        question:
          'If enough memory space does not exist, malloc() returns a _________',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'zero',
            isChecked: false,
          },
          {
            option: '1',
            isChecked: false,
          },
          {
            option: '-1',
            isChecked: false,
          },
          {
            option: 'null',
            isChecked: false,
          },
        ],
      },
      {
        id: 30,
        question: 'Three sections of the for loop must be separated by _________',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'colon (:)',
            isChecked: false,
          },
          {
            option: 'semicolon (;)',
            isChecked: false,
          },
          {
            option: 'comma (,)',
            isChecked: false,
          },
          {
            option: 'None of these',
            isChecked: false,
          },
        ],
      },
      {
        id: 27,
        question:
          'Two variables can have identical ________________ in a program.',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'name',
            isChecked: false,
          },
          {
            option: 'value',
            isChecked: false,
          },
          {
            option: 'pointer',
            isChecked: false,
          },
          {
            option: 'None of these',
            isChecked: false,
          },
        ],
      },
      {
        id: 3,
        question:
          'The web browser locates the web page on the internet with the help of the _________..',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'ARAPNET',
            isChecked: false,
          },
          {
            option: 'URL',
            isChecked: false,
          },
          {
            option: 'HTML',
            isChecked: false,
          },
          {
            option: 'ISP',
            isChecked: false,
          },
        ],
      },
      {
        id: 11,
        question:
          "Chrome automatically_____if a website is not in user's preferred language.",
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'Allows',
            isChecked: false,
          },
          {
            option: 'Detects',
            isChecked: false,
          },
          {
            option: 'Search',
            isChecked: false,
          },
          {
            option: 'Alert',
            isChecked: false,
          },
        ],
      },
      {
        id: 39,
        question:
          'with calloc() the values stored in the allocated memory space is _______',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'zero',
            isChecked: false,
          },
          {
            option: 'one',
            isChecked: false,
          },
          {
            option: 'null',
            isChecked: false,
          },
          {
            option: 'None of these',
            isChecked: false,
          },
        ],
      },
      {
        id: 6,
        question:
          "A web browsers is an _________________ that runs on a user's computer..",
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'system',
            isChecked: false,
          },
          {
            option: 'operater',
            isChecked: false,
          },
          {
            option: 'application',
            isChecked: false,
          },
          {
            option: 'software',
            isChecked: false,
          },
        ],
      },
      {
        id: 32,
        question: 'Format Command for a string',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: '%c',
            isChecked: false,
          },
          {
            option: '%ch',
            isChecked: false,
          },
          {
            option: '%s',
            isChecked: false,
          },
          {
            option: 'None of these',
            isChecked: false,
          },
        ],
      },
      {
        id: 42,
        question: 'A local veriable is also called',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'global',
            isChecked: false,
          },
          {
            option: 'automatic',
            isChecked: false,
          },
          {
            option: 'temp',
            isChecked: false,
          },
          {
            option: 'both a and c',
            isChecked: false,
          },
        ],
      },
      {
        id: 50,
        question:
          'Which of the following are generally used to execute a series of instructions',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'compile',
            isChecked: false,
          },
          {
            option: 'functions',
            isChecked: false,
          },
          {
            option: 'debug',
            isChecked: false,
          },
          {
            option: 'None of these',
            isChecked: false,
          },
        ],
      },
      {
        id: 20,
        question:
          'The process by which the OS loads and starts when the computer is turned on is called _____________ or ___________',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'Bootup or booting',
            isChecked: false,
          },
          {
            option: 'Booting or bootup',
            isChecked: false,
          },
          {
            option: 'Boot or booting',
            isChecked: false,
          },
          {
            option: 'Booting or boot',
            isChecked: false,
          },
        ],
      },
      {
        id: 25,
        question:
          'A small,  light and version of laptop is called a ____________',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'Full-size laptop',
            isChecked: false,
          },
          {
            option: 'Netbook',
            isChecked: false,
          },
          {
            option: 'Ultrabook',
            isChecked: false,
          },
          {
            option: 'Tablet-pc',
            isChecked: false,
          },
        ],
      },
      {
        id: 28,
        question: 'An index holds integer values starting with ________',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: '0',
            isChecked: false,
          },
          {
            option: '1',
            isChecked: false,
          },
          {
            option: '-1',
            isChecked: false,
          },
          {
            option: 'None of these',
            isChecked: false,
          },
        ],
      },
      {
        id: 16,
        question:
          'They ________ are communication pathways that carry data between different functional units',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'Central processing unit',
            isChecked: false,
          },
          {
            option: 'Control unit',
            isChecked: false,
          },
          {
            option: 'Set of register',
            isChecked: false,
          },
          {
            option: 'Buses',
            isChecked: false,
          },
        ],
      },
      {
        id: 23,
        question:
          'Most storage area networks switch utilizes the fiber channel to transfer small ___________________ commands over the network.',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'Tape libraries',
            isChecked: false,
          },
          {
            option: 'Disk arrays',
            isChecked: false,
          },
          {
            option: 'Computer system interface (SCSI)',
            isChecked: false,
          },
          {
            option: 'Optical jukeboxes',
            isChecked: false,
          },
        ],
      },
      {
        id: 24,
        question:
          'Anti-theft features ___________ suspicious activity are notification messages send over the internet.',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'Rapid start',
            isChecked: false,
          },
          {
            option: 'Hibernate',
            isChecked: false,
          },
          {
            option: 'Detects',
            isChecked: false,
          },
          {
            option: 'Connect',
            isChecked: false,
          },
        ],
      },
      {
        id: 46,
        question: 'The diagrammatic representation of an algorithm is called:',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'Pseudo Code',
            isChecked: false,
          },
          {
            option: 'ER Diagram',
            isChecked: false,
          },
          {
            option: 'Data Flow Diagram',
            isChecked: false,
          },
          {
            option: 'None of these',
            isChecked: false,
          },
        ],
      },
      {
        id: 12,
        question:
          "_______is a large rectangular board inside the computer's cabinet?",
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'RAM',
            isChecked: false,
          },
          {
            option: 'ROM',
            isChecked: false,
          },
          {
            option: 'Motherboard',
            isChecked: false,
          },
          {
            option: 'Keyboard',
            isChecked: false,
          },
        ],
      },
      {
        id: 35,
        question: 'Which of the following are the tools that manipulate data',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'Operators',
            isChecked: false,
          },
          {
            option: 'Operands',
            isChecked: false,
          },
          {
            option: 'Expressions',
            isChecked: false,
          },
          {
            option: 'None of the above',
            isChecked: false,
          },
        ],
      },
      {
        id: 36,
        question:
          'Which of the following is a storage area, either in the memory or on the controller card for the device',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'hard disk',
            isChecked: false,
          },
          {
            option: 'buffer',
            isChecked: false,
          },
          {
            option: 'virtual',
            isChecked: false,
          },
          {
            option: 'None of these',
            isChecked: false,
          },
        ],
      },
      {
        id: 47,
        question:
          'An array name is truly a pointer to which element in that array',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'first',
            isChecked: false,
          },
          {
            option: 'second',
            isChecked: false,
          },
          {
            option: 'last',
            isChecked: false,
          },
          {
            option: 'None of these',
            isChecked: false,
          },
        ],
      },
      {
        id: 7,
        question:
          'Which of the following is a program that contains lines of codes or instructions.',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'Hardware',
            isChecked: false,
          },
          {
            option: 'System software',
            isChecked: false,
          },
          {
            option: 'Software',
            isChecked: false,
          },
          {
            option: 'Application software',
            isChecked: false,
          },
        ],
      },
      {
        id: 8,
        question:
          'The usb speakers permit around _______watts of output power and are powered ranging from 5 volts to 500 milliamps which is provided by the USB port.',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: '3.5',
            isChecked: false,
          },
          {
            option: '9.5',
            isChecked: false,
          },
          {
            option: '8.5',
            isChecked: false,
          },
          {
            option: '2.5',
            isChecked: false,
          },
        ],
      },
      {
        id: 21,
        question:
          'A ____________ digit is the smallest unit of data that can be stored on a machine.',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'Binary or bit',
            isChecked: false,
          },
          {
            option: 'Bit',
            isChecked: false,
          },
          {
            option: 'Bit or binary',
            isChecked: false,
          },
          {
            option: 'Binary',
            isChecked: false,
          },
        ],
      },
      {
        id: 17,
        question: 'The microprocessor , alternatively called the ____________.',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'Control unit (CU)',
            isChecked: false,
          },
          {
            option: 'Arithmetic logic unit (ALU)',
            isChecked: false,
          },
          {
            option: 'Central processing unit (CPU)',
            isChecked: false,
          },
          {
            option: 'System unit (SU)',
            isChecked: false,
          },
        ],
      },
      {
        id: 4,
        question:
          'Which type of computer used for professional tasks that require high performance.',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'Workstation',
            isChecked: false,
          },
          {
            option: 'Data',
            isChecked: false,
          },
          {
            option: 'Operating system (OS)',
            isChecked: false,
          },
          {
            option: 'Mobile',
            isChecked: false,
          },
        ],
      },
      {
        id: 33,
        question: 'The control string must always be enclosed within ___________',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: "single  quotes(' ')",
            isChecked: false,
          },
          {
            option: 'round brackets ( )',
            isChecked: false,
          },
          {
            option: 'double quotes',
            isChecked: false,
          },
          {
            option: 'None of these',
            isChecked: false,
          },
        ],
      },
      {
        id: 34,
        question:
          'Which expression is one in which the operands of an operator belong to different data types.',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'single',
            isChecked: false,
          },
          {
            option: 'operands',
            isChecked: false,
          },
          {
            option: 'different',
            isChecked: false,
          },
          {
            option: 'mix mode',
            isChecked: false,
          },
        ],
      },
      {
        id: 18,
        question:
          'Rapid start allows ___________ books to restart from hibernate and connect to the internet fast',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'Ultra books',
            isChecked: false,
          },
          {
            option: 'Notebooks',
            isChecked: false,
          },
          {
            option: 'Probook',
            isChecked: false,
          },
          {
            option: 'Netbook',
            isChecked: false,
          },
        ],
      },
      {
        id: 38,
        question:
          'Which statement immediately transfers the control from the function back to the calling program',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'goto',
            isChecked: false,
          },
          {
            option: 'back',
            isChecked: false,
          },
          {
            option: 'return',
            isChecked: false,
          },
          {
            option: 'None of these',
            isChecked: false,
          },
        ],
      },
      {
        id: 26,
        question:
          'A function can be invoked or called from the main program by using its _________',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'header files',
            isChecked: false,
          },
          {
            option: 'macros',
            isChecked: false,
          },
          {
            option: 'name',
            isChecked: false,
          },
          {
            option: 'None of these',
            isChecked: false,
          },
        ],
      },
      {
        id: 29,
        question:
          'How many types of statements are there in C that perform an unconditional branch',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'two',
            isChecked: false,
          },
          {
            option: 'four',
            isChecked: false,
          },
          {
            option: 'six',
            isChecked: false,
          },
          {
            option: 'eight',
            isChecked: false,
          },
        ],
      },
      {
        id: 9,
        question:
          'A Device that controls the movement of the pointer on a display screen.',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'Monitor',
            isChecked: false,
          },
          {
            option: 'Keyboard',
            isChecked: false,
          },
          {
            option: 'Mouse',
            isChecked: false,
          },
          {
            option: 'Scanner',
            isChecked: false,
          },
        ],
      },
      {
        id: 14,
        question:
          'A wireless connection uses a ________ frequency bands to connect to the the internet..',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'radio',
            isChecked: false,
          },
          {
            option: 'telephone',
            isChecked: false,
          },
          {
            option: 'network',
            isChecked: false,
          },
          {
            option: 'mobile',
            isChecked: false,
          },
        ],
      },
      {
        id: 5,
        question:
          'A search engine is a ______________ that scans the internet for web page..',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'program',
            isChecked: false,
          },
          {
            option: 'software',
            isChecked: false,
          },
          {
            option: 'connection',
            isChecked: false,
          },
          {
            option: 'network',
            isChecked: false,
          },
        ],
      },
      {
        id: 19,
        question:
          'The ____________ unit takes in data from the user in an organized manner.',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'Input',
            isChecked: false,
          },
          {
            option: 'Output',
            isChecked: false,
          },
          {
            option: 'Control',
            isChecked: false,
          },
          {
            option: 'Processing',
            isChecked: false,
          },
        ],
      },
      {
        id: 13,
        question:
          'A large amount of numerical data in a ____________ structure by providing complex mathematical and statistical function.',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'Word processing',
            isChecked: false,
          },
          {
            option: 'Presentation',
            isChecked: false,
          },
          {
            option: 'Grid-based software',
            isChecked: false,
          },
          {
            option: 'Email software',
            isChecked: false,
          },
        ],
      },
      {
        id: 43,
        question:
          'Arguments appearing in the parentheses of any function are also termed as __________',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'variables',
            isChecked: false,
          },
          {
            option: 'values',
            isChecked: false,
          },
          {
            option: 'formal perimeters',
            isChecked: false,
          },
          {
            option: 'None of these',
            isChecked: false,
          },
        ],
      },
      {
        id: 49,
        question:
          'A pointer provides ________ way of accessing the value of a data item',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'direct',
            isChecked: false,
          },
          {
            option: 'indirect',
            isChecked: false,
          },
          {
            option: 'both A & B',
            isChecked: false,
          },
          {
            option: 'None of these',
            isChecked: false,
          },
        ],
      },
      {
        id: 45,
        question:
          'The values within the __________ are assign to the elements of the array.',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'curly braces',
            isChecked: false,
          },
          {
            option: 'square braces',
            isChecked: false,
          },
          {
            option: 'round',
            isChecked: false,
          },
          {
            option: 'None of these',
            isChecked: false,
          },
        ],
      },
      {
        id: 44,
        question:
          'In the case of global and static variables, the storage is fixed throughout the program’s ___________________',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'compile time',
            isChecked: false,
          },
          {
            option: 'run time',
            isChecked: false,
          },
          {
            option: 'debuging time',
            isChecked: false,
          },
          {
            option: 'None of these',
            isChecked: false,
          },
        ],
      },
      {
        id: 10,
        question:
          'A wired connection to the internet makes use of a ____________ transmission medium to connect to the internet..',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'host',
            isChecked: false,
          },
          {
            option: 'physical',
            isChecked: false,
          },
          {
            option: 'comunication',
            isChecked: false,
          },
          {
            option: 'digital',
            isChecked: false,
          },
        ],
      },
      {
        id: 37,
        question:
          'Modern day languages enable us to use symbolic names known as ___________ to store values in memory',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'functions',
            isChecked: false,
          },
          {
            option: 'constants',
            isChecked: false,
          },
          {
            option: 'variables',
            isChecked: false,
          },
          {
            option: 'identifiers',
            isChecked: false,
          },
        ],
      },
      {
        id: 41,
        question:
          'When more than one logical operator is used in a statement  which will be evaluated first.',
        questionType: 'Radio',
        examTypeId: 1,
        option: [
          {
            option: 'AND',
            isChecked: false,
          },
          {
            option: 'OR',
            isChecked: false,
          },
          {
            option: 'both A & B',
            isChecked: false,
          },
          {
            option: 'NOT',
            isChecked: false,
          },
        ],
      },
      {
        id: 1,
        question:
          'Internet is a __________ network of interconnected networks of computers..',
        questionType: '',
        examTypeId: null,
        option: [
          {
            option: 'global',
            isChecked: false,
          },
          {
            option: 'wireless',
            isChecked: false,
          },
          {
            option: 'wired',
            isChecked: false,
          },
          {
            option: 'resourse',
            isChecked: false,
          },
        ],
      },
    ];
  
    const [modalVisible, setModalVisible] = useState(false);
    const [state, setState] = useState(exam);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [backdisbaled, setBackDisabled] = useState(true);
    const [radiox, setRadiox] = useState(false);
    const [isloading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
  
    const getExam = () => {
      AsyncStorage.getItem('@EXAMDATA')
        .then(value => {
          let examData = JSON.parse(value);
  
          console.log('--------tommy');
  
          console.log(examData.exam, 'EXAM LOCAL');
          setState(exam);
  
          console.log('--------shown using state');
  
          setIsLoading(false);
        })
        .catch(err => {
          console.log(err);
        });
    };
  
    const StudentDetail = () => {
      AsyncStorage.getItem('@studentData')
        .then(value => {
          let studentData = JSON.parse(value);
          const {student, user} = studentData;
          setData(user);
        })
        .catch(err => {
          console.log(err);
        });
    };
  
    useEffect(() => {
      //   getExam();
      StudentDetail();
    }, []);
  
    const handlepress = () => {
      //SHOW MODAL
  
      const finalarr = state.filter(item => {
        return item.option.filter(item => {
          return item.isChecked === true;
        });
      });
  
      // finalarr.map(item => {
      //   item.userid = data.id;
      //   item.gender = student.gender
      // });
      Alert.alert(
          'Bano Qabil',
          'Demo Exam Has Been Finished.',
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable: false},
        );
  
      navigation.navigate('TabNavigator');
    };
    return (
      <>
        {/* --------------------------------------------------------------------------------- */}
        <SafeAreaView>
          {isloading ? (
            <>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator size="large" color={color.primary} />
                <Text>Loading...</Text>
              </View>
            </>
          ) : (
            <>
              <View
                style={{
                  height: 70,
                  width: '100%',
                  backgroundColor: color.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: color.light,
                  }}>
                  DEMO EXAM
                </Text>
              </View>
  
              <Card>
                <Card.Content>
                  <View>
                    {/* <CountDown
                    until={60 * 10 + 30}
                    size={25}
                    onFinish={() => {
                      Alert.alert('Time Up', 'You have been submitted the exam');
                      handlepress();
                    }}
                    digitStyle={{backgroundColor: '#FFF'}}
                    digitTxtStyle={{color: '#1CC625'}}
                    timeToShow={['M', 'S']}
                    timeLabels={{m: 'Minutes', s: 'Seconds'}}
                  /> */}
                    <Text
                      style={{
                        fontSize: 18,
                        textAlign: 'center',
                        color: 'red',
                      }}>
                      Time Remaining
                    </Text>
                  </View>
                  <Text
                    style={{color: '#adb5bd', fontSize: 16, marginVertical: 3}}>
                    Student Name: {data.name}
                  </Text>
                  <Text
                    style={{color: '#adb5bd', fontSize: 16, marginVertical: 3}}>
                    Enrollment No: {data.username + data.id}
                  </Text>
                  <Text
                    style={{color: '#adb5bd', fontSize: 16, marginVertical: 3}}>
                    No Of Questions: {state.length}
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
                                    state[currentQuestion].option.map(
                                      (item, i) => {
                                        item.isChecked = false;
                                      },
                                    );
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
                      color={color.primary}
                      mode="contained"
                      disabled={currentQuestion === 0 ? true : false}
                      onPress={() => {
                        setCurrentQuestion(currentQuestion - 1);
                      }}>
                      PREVIOUS
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
                      }}>
                      Are you sure you want to submit?
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
                          handlepress();
                        }}>
                        YES
                      </Button>
                    </View>
                  </View>
                </View>
              </Modal>
            </>
          )}
        </SafeAreaView>
        {/* ---------------------------------------------------------------------------------------- */}
      </>
    );
  };
  
  export default DemoExam;
  
  const styles = StyleSheet.create({});
  