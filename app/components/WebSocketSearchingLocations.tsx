import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TextInput, AppState } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';
import { useGlobalStyles } from '../context/GlobalStylesContext';
import { useUser } from '../context/UserContext';

// Create an animated TextInput component

Animated.addWhitelistedNativeProps({ text: true });
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);




interface WebSocketProps {
  userToken: string; // Token used for WebSocket authentication
  onMessage: (update: any) => void; // Callback for handling WebSocket messages
  onError?: (error: Event) => void; // Optional callback for WebSocket errors
  onClose?: () => void; // Optional callback when the WebSocket connection is closed
}

const useWebSocket = ({
  userToken,
  temperatureSharedValue,
  countrySharedValue,
  temperatureDifference,
  onMessage,
  onError,
  onClose,
}: WebSocketProps) => {
  const socketRef = useRef<WebSocket | null>(null);


  



  useEffect(() => {
    if (socketRef.current) {
     // console.log("WebSocket already initialized, skipping new connection.");
      return;
    }

    const socketUrl = `wss://climatetwin-lzyyd.ondigitalocean.app/ws/climate-twin/?user_token=${userToken}`;
    const socket = new WebSocket(socketUrl);
    socketRef.current = socket;

    socket.onopen = () => {
     console.log('Location search WebSocket connection opened');
    };

    socket.onmessage = (event) => {
      try {
        const update = JSON.parse(event.data);
      // console.log('WebSocket message received:', update); // Log the raw WebSocket message
        temperatureSharedValue.value = update.temperature || '';
        countrySharedValue.value = update.country_name || '';
        temperatureDifference.value = update.temp_difference || '';
       // console.log(temperatureSharedValue);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.onerror = (event) => {
      console.error("WebSocket error:", event);
      if (onError) onError(event);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
      socketRef.current = null; // Reset the ref so it can reconnect if needed
      if (onClose) onClose();
    };

    

    return () => {
      if (socketRef.current) {
        console.log("Closing WebSocket connection");
        socketRef.current.close();
      }
    };
  }, [userToken]); // Reconnect if userToken changes


  

  return {
    sendMessage: (message: any) => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify(message));
      }
    },
  };
};



const WebSocketSearchingLocations: React.FC<{ userToken: string }> = ({ userToken }) => {
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const { user } = useUser();
 

  // // Using SharedValues for temperature and countryName
  // const temperatureValue = useSharedValue<string | null>(null);
  // const countryNameValue = useSharedValue<string | null>(null);



  const temperatureSharedValue = useSharedValue('');
  const countrySharedValue = useSharedValue('');
  const temperatureDifference = useSharedValue('');


 
    const colorMap = {
      0: 'red',
      1: 'darkorange',
      2: 'orange',
      3: 'orangegold',
      4: 'darkgreen',
      5: 'blue',
      6: 'darkblue',
      7: 'purple',
      8: 'purple',
    }; 
  


 

  
  const animatedCountry = useAnimatedProps(() => {
    return {
      text: `${countrySharedValue.value}`, 
      defaultValue: `${countrySharedValue.value}`,
    };
  });

 
  
const animatedTemp = useAnimatedProps(() => {
  
  const difference = (temperatureDifference.value !== null && !isNaN(Number(temperatureDifference.value)))
  ? Number(temperatureDifference.value)
  : null;

  let color = null;

  if (difference && difference <= 30) {
    const colorIndex = Math.floor(((difference - 2) / 28) * 8);
    color = colorMap[colorIndex];
  } else if (difference && difference < 2) {
    color = 'red'; 
  } else {
    color = themeStyles.primaryText.color;
  } 

  return {
    text: `${temperatureSharedValue.value}`,
    defaultValue: `${temperatureSharedValue.value}`,
    color: color,
  };
});

  // WebSocket hook
  useWebSocket({
    userToken,
    temperatureSharedValue,
    countrySharedValue, 
    temperatureDifference,
    onMessage: (newUpdate) => { 
     // console.log("Received update:", newUpdate); 
    },
    onError: (error) => {
      console.error("Current Location WebSocket encountered an error:", error);
    },
    onClose: () => {
      console.log("Current Location WebSocket connection closed");
    },
  }); 
  

  return (
    <View style={appContainerStyles.defaultElementRow}>
      <View style={styles.updatesContainer}>
        <View style={styles.infoContainer}>
        =
            <AnimatedTextInput
              style={[styles.updateText, themeStyles.primaryText]}
              animatedProps={animatedTemp}
              editable={false}
              defaultValue={''}
            /> 
            <AnimatedTextInput
              style={[styles.updateText, themeStyles.primaryText]}
              animatedProps={animatedCountry}
              editable={false}
              defaultValue={''}
            /> 
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  updatesContainer: {
    flex: 1,
  },
  infoContainer: {
    flexDirection: 'column',
    width: '100%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  updateText: {
    fontSize: 26, 
  },
});

export default WebSocketSearchingLocations;