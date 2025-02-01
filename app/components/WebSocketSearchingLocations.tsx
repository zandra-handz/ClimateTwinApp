import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, TextInput, AppState } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';
import { useGlobalStyles } from '../context/GlobalStylesContext';
import { useUser } from '../context/UserContext';
 
import WorldMapSvg from '../assets/svgs/worldmap.svg';

import MapDots from '../animations/MapDots'; 
import Dot from '../animations/Dot';

// Create an animated TextInput component

Animated.addWhitelistedNativeProps({ text: true });
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
 

const AnimatedView = Animated.createAnimatedComponent(View);

const AnimatedDot = Animated.createAnimatedComponent(Dot);




interface WebSocketProps {
  userToken: string; // Token used for WebSocket authentication
  onMessage: (update: any) => void; // Callback for handling WebSocket messages
  onError?: (error: Event) => void; // Optional callback for WebSocket errors
  onClose?: () => void; // Optional callback when the WebSocket connection is closed
}

const useWebSocket = ({
  userToken,
  coords,
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

    const socketUrl = `wss://climatetwin.com/ws/climate-twin/?user_token=${userToken}`;
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
        coords.value = {
          latitude: update.latitude || 0,
          longitude: update.longitude || 0
        };
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
 
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });

  // // Using SharedValues for temperature and countryName
  // const temperatureValue = useSharedValue<string | null>(null);
  // const countryNameValue = useSharedValue<string | null>(null);



  const temperatureSharedValue = useSharedValue('');
  const countrySharedValue = useSharedValue('');
  const temperatureDifference = useSharedValue('');
 const coords = useSharedValue({ latitude: 0, longitude: 0 });

 const handleLayout = (event: any) => {
  const { width, height } = event.nativeEvent.layout;
  setMapDimensions({ width, height });
};



 
    const colorMap = {
      0: 'red',
      1: 'darkorange',
      2: 'darkorange',
      3: 'darkorange',
      4: 'orange',
      5: 'orange',
      6: 'orange',
      7: 'gold',
      8: 'yellow',
    }; 
  


 

  
  const animatedCountry = useAnimatedProps(() => {
    return {
      text: `${countrySharedValue.value}`, 
      defaultValue: `${countrySharedValue.value}`,
    };
  });

  
  
  const colorIndexRef = useRef(0);
  const colors = ['red', 'blue', 'green', 'orange', 'purple', 'yellow', 'cyan', 'magenta'];

  const screenWidth = 300; // Replace with your screen width
  const screenHeight = 300; // Replace with your screen height
  
  // const animatedCoords = useAnimatedProps(() => { 
  //   return {
  //     coords: coords.value
  //   };
  // });


  const animatedStyle = useAnimatedStyle(() => {
    // Normalize coordinates based on the mapContainer's dimensions
    const normalizedLeft = (coords.value.longitude + 180) * (mapDimensions.width / 360);
    const normalizedTop = (90 - coords.value.latitude) * (mapDimensions.height / 180); // Invert the vertical axis
    
    return {
      position: 'absolute',
      left: normalizedLeft,
      top: normalizedTop,
      zIndex: 2000,
      backgroundColor: themeStyles.primaryText.color, // Use the color cycle here
      width: 6, // Size of the dot
      height: 6, // Size of the dot
      borderRadius: 3, // To make it round
    };
  });
   
const animatedTemp = useAnimatedProps(() => {
  
  const difference = (temperatureDifference.value !== null && !isNaN(Number(temperatureDifference.value)))
  ? Number(temperatureDifference.value)
  : null;

  let color = null;
  if (difference && difference < 2) {
    color = 'red'; 
} else if (difference && difference <= 30) {
    const colorIndex = Math.floor(((difference - 2) / 28) * 8);
    color = colorMap[colorIndex]; 
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
    coords,
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
    <View style={{flexDirection: 'column'}}>
      
      
      <View style={[appContainerStyles.mapContainer, {overflow: 'hidden'}]} onLayout={handleLayout}>
    {/* {isValidCoords && (
          <AnimatedDot
          animatedProps={animatedDotProps} // Pass animatedProps here
          color="blue"                    // Customize the color
          size={20}                       // Customize the size
        />
        )} */}
  
  {/* <AnimatedDot style={animatedStyle} animatedProps={animatedCoords} /> */}
              
 
      
    <WorldMapSvg width={'100%'} color={'blue'}  />
            {/* Only show the Dot if the map has dimensions */}
            {mapDimensions.width > 0 && mapDimensions.height > 0 && (
         <AnimatedDot style={animatedStyle} />
        )}

    </View> 
    <View style={appContainerStyles.defaultElementRow}>
   
      <View style={styles.updatesContainer}>
        <View style={styles.infoContainer}>
        <View style={[themeStyles.primaryBackground, {borderWidth: StyleSheet.hairlineWidth, borderColor: themeStyles.primaryText.color, width: 48, height: 48, borderRadius: 48 / 2, textAlign: 'center', alignItems: 'center', justifyContent: 'center'}]}>
          
            <AnimatedTextInput
              style={[styles.tempText, themeStyles.primaryText]}
              animatedProps={animatedTemp}
              editable={false}
              defaultValue={''}
            /> 
            
        </View>
            
            <AnimatedTextInput
              style={[styles.updateText, themeStyles.primaryText]}
              animatedProps={animatedCountry}
              editable={false}
              defaultValue={''}
            /> 

        </View>
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
    fontSize: 20, 
  },
  tempText: {
    fontSize: 20, 
    fontWeight: 'bold',
  },
  coordsText: {
    fontSize: 16, 
  },
});

export default WebSocketSearchingLocations;