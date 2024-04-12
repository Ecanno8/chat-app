// import the screens
import Start from './components/Start';
import Chat from './components/Chat';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { LogBox } from 'react-native';


// Create the navigator
const Stack = createNativeStackNavigator();



const App = () => {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDrOVQHhFy_FXINFRaHT-xMWbP7YO9uT0k",
    authDomain: "chatapp-3ac7c.firebaseapp.com",
    projectId: "chatapp-3ac7c",
    storageBucket: "chatapp-3ac7c.appspot.com",
    messagingSenderId: "843241382557",
    appId: "1:843241382557:web:47536dfbcb376e1d2c2a74"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const db = getFirestore(app);

  LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen
          name="Chat"
          options={({ route }) => ({ title: route.params.name })}
        >
          {(props) => <Chat {...props} db={db} />}
        </Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;