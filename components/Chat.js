import React, { useEffect, useState } from 'react';
import { View, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { addDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ route, navigation, db, isConnected }) => {
    const { userID } = route.params;
    const { name, background } = route.params;
    const [messages, setMessages] = useState([]);

    // Function to customize the appearance of chat bubbles
    const renderBubble = (props) => {
        return <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: '#2a9d8f',
                },
                left: {
                    backgroundColor: '#fff'
                }
            }}
        />
    }

    const renderInputToolbar = (props) => {
        if (isConnected) return <InputToolbar {...props} />;
        else return null;
    };

    // Effect to set the navigation options (e.g., title)
    useEffect(() => {
        navigation.setOptions({ title: name });
    }, []);

    // Effect to fetch and set messages from Firestore
    useEffect(() => {
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

        let unsubMessages;

        if (isConnected) {
            unsubMessages = onSnapshot(q, (documentsSnapshot) => {
                let newMessages = [];
                documentsSnapshot.forEach((doc) => {
                    newMessages.push({
                        id: doc.id,
                        ...doc.data(),
                        createdAt: new Date(doc.data().createdAt.toMillis()),
                    });
                });
                cacheMessages(newMessages);
                setMessages(newMessages);
            });
        } else {
            loadCachedMessages();
        }

        return () => {
            if (unsubMessages) unsubMessages();
        };
    }, [isConnected]);

    const cacheMessages = async (messagesToCache) => {
        try {
            await AsyncStorage.setItem("message", JSON.stringify(messagesToCache));
        } catch (error) {
            console.log(error.message);
        }
    };

    const loadCachedMessages = async () => {
        const cachedMessages = (await AsyncStorage.getItem("messages")) || [];
        setMessages(JSON.parse(cachedMessages));
    };

    // Function to handle sending new messages
    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0]);
    };

    return (
        <View style={[styles.container, { backgroundColor: background }]}>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                onSend={messages => onSend(messages)}
                user={{
                    _id: userID,
                    name: name,
                }}
            />
            {/* so that the keyboard does not overlap the input  */}
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
            {Platform.OS === "ios" ? (
                <KeyboardAvoidingView behavior="padding" />
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default Chat;
