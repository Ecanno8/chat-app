import React, { useEffect, useState } from 'react';
import { View, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { addDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore";

const Chat = ({ route, navigation, db }) => {
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

    // Effect to set the navigation options (e.g., title)
    useEffect(() => {
        navigation.setOptions({ title: name });
    }, []);

    // Effect to fetch and set messages from Firestore
    useEffect(() => {
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

        const unsubMessages = onSnapshot(q, (documentsSnapshot) => {
            let newMessages = [];
            documentsSnapshot.forEach((doc) => {
                newMessages.push({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: new Date(doc.data().createdAt.toMillis()),
                });
            });
            setMessages(newMessages);
        });

        return () => {
            if (unsubMessages) unsubMessages();
        };
    }, []);

    // Function to handle sending new messages
    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0]);
    };

    return (
        <View style={[styles.container, { backgroundColor: background }]}>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                onSend={messages => onSend(messages)}
                user={{
                    _id: userID,
                    name: name,
                }}
            />
            {/* so that the keyboard does not overlap the input  */}
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default Chat;
