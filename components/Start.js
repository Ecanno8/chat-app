import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ImageBackground, StyleSheet, KeyboardAvoidingView, Alert, Platform } from 'react-native';
import { getAuth, signInAnonymously } from "firebase/auth";

const Start = ({ navigation }) => {
    const auth = getAuth();
    const [name, setName] = useState('');
    const [background, setBackground] = useState('');
    const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

    // handle the sign-in anonymously process for the user.
    const signInUser = () => {
        signInAnonymously(auth)
            .then((result) => {
                navigation.navigate("Chat", {
                    name: name,
                    background: background,
                    userID: result.user.uid,
                });
                Alert.alert("Signed in Successfully!");
            })
            .catch((error) => {
                Alert.alert("Unable to sign in, try later again.");
            });
    };
    return (
        <View style={styles.container}>
            <ImageBackground source={require("../assets/BackgroundImage.png")} style={styles.bgImage} resizeMode="cover">
                <Text style={styles.appTitle}>Welcome!</Text>
                <View style={styles.box}>
                    <TextInput
                        accessibilityLabel="Username input"
                        accessibilityRole="text"
                        style={styles.textInput}
                        value={name}
                        onChangeText={setName}
                        placeholder='Type your username here'
                    />
                    <Text style={styles.chooseBackgroundColor}>Choose Background Color</Text>
                    {/* Choose background color of chat */}
                    <View style={styles.colorButtonsBox}>
                        {colors.map((color, index) => (
                            <TouchableOpacity
                                accessibilityLabel="Color Button"
                                accessibilityHint="Lets you choose a backgroundcolor for your chat."
                                accessibilityRole="button"
                                key={index}
                                style={[styles.colorButton, { backgroundColor: color }, background === color && styles.selected]}
                                onPress={() => setBackground(color)}
                            />
                        ))}
                    </View>
                    {/* Start Chat */}
                    <TouchableOpacity style={styles.button} onPress={signInUser}>
                        <Text style={styles.textButton}>Start Chatting</Text>
                    </TouchableOpacity>
                </View>
                {Platform.OS === "android" ? (
                    <KeyboardAvoidingView behavior="height" />
                ) : null}
            </ImageBackground >
        </View >
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "center",
        justifyContent: 'space-evenly',

    },
    bgImage: {
        flex: 1,
        alignItems: 'center',

    },
    appTitle: {
        fontSize: 45,
        fontWeight: '600',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#ffffff',
        margin: 20
    },
    box: {
        backgroundColor: '#ffffff',
        width: '88%',
        height: '44%',
        alignItems: 'center',
        marginBottom: 30,
        justifyContent: 'center',
    },
    textInput: {
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        width: '88%',
        opacity: 50,
        padding: 15,
        borderWidth: 1,
        marginTop: 30,
        marginBottom: 15,
        top: 25,
        borderColor: "#757083"
    },
    chooseBackgroundColor: {
        flex: 1,
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        marginTop: 20,
    },
    colorButtonsBox: {
        flexDirection: 'row',
        width: '80%',
        justifyContent: "space-between",
        top: 5,
        bottom: 5
    },
    colorButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        margin: 10
    },
    selected: {
        borderColor: 'black',
        borderWidth: 1
    },
    button: {
        backgroundColor: '#757083',
        padding: 15,
        margin: 20,
        alignItems: 'center',
        width: '88%'
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff'
    }
});

export default Start;