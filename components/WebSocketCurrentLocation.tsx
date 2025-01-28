import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useUser } from '../app/context/UserContext';

interface WebSocketProps {
  userToken: string; // Token used for WebSocket authentication
  onMessage: (update: any) => void; // Callback for handling WebSocket messages
  onError?: (error: Event) => void; // Optional callback for WebSocket errors
  onClose?: () => void; // Optional callback when the WebSocket connection is closed
}

const useWebSocket = ({
  userToken,
  onMessage,
  onError,
  onClose,
}: WebSocketProps) => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socketUrl = `wss://climatetwin-lzyyd.ondigitalocean.app/ws/climate-twin/current/?user_token=${userToken}`;
    
    console.log('WebSocket connection URL:', socketUrl); // Log the WebSocket URL and token

    const socket = new WebSocket(socketUrl);
    socketRef.current = socket;

    // Open WebSocket connection
    socket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    // Handle incoming messages
    socket.onmessage = (event: WebSocketMessageEvent) => {
      const update = JSON.parse(event.data);
      onMessage(update); // Calling the provided onMessage callback prop
    };

    // Handle WebSocket errors
    socket.onerror = (event: Event) => {
      console.error('WebSocket error:', event);
      if (onError) {
        onError(event);
      }
    };

    // Handle WebSocket close
    socket.onclose = () => {
      console.log('WebSocket connection closed');
      if (onClose) {
        onClose();
      }
    };

    // Cleanup function to close WebSocket when component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [userToken, onMessage, onError, onClose]);

  return {
    sendMessage: (message: any) => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        console.log('Sending message to WebSocket:', message); // Log the message
        socketRef.current.send(JSON.stringify(message));
      } else {
        console.warn('WebSocket is not open');
      }
    },
  };
};

const WebSocketCurrentLocation: React.FC<{ userToken: string }> = ({ userToken }) => {
    const { user } = useUser();
  const [update, setUpdate] = useState<string | null>(null); // State to store the current update

  // WebSocket hook
  const { sendMessage } = useWebSocket({
    userToken,
    onMessage: (newUpdate) => {
      console.log('Received update:', newUpdate);
      setUpdate(newUpdate.name); // Replace the previous update with the new one
    },
    onError: (error) => {
      console.error('WebSocket encountered an error:', error);
    },
    onClose: () => {
      console.log('WebSocket connection closed');
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{`Welcome back, ${user.user.username}`}</Text>
      <ScrollView contentContainerStyle={styles.updatesContainer}>
        {update ? (
          <View style={styles.updateCard}>
            <Text style={styles.updateText}>{update}</Text> {/* Display the update name */}
          </View>
        ) : (
          <Text style={styles.updateText}></Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  updatesContainer: {
    flexGrow: 1,
  },
  updateCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  updateText: {
    fontSize: 14,
    color: '#333',
  },
});

export default WebSocketCurrentLocation;
