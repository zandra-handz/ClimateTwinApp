import React from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';


//this key is just a test key
export const WINDY_API_KEY = Constants.expoConfig?.extra?.WINDY_API_KEY;

//put above leaflet script
{/* <link rel="stylesheet" href="https://unpkg.com/leaflet@1.4.0/dist/leaflet.css" /> */}

const WindyMap = ({lat = 37.7749, lon = -122.4194, zoom = 8 }) => { //12 is max zoom-in
  const windyHTML = `
  <!DOCTYPE html> 
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Windy Debug</title>
  <!-- Windy REQUIRES Leaflet 1.4.0 --> 
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.4.0/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.4.0/dist/leaflet.js"></script>
  <!-- MUST load libBoot.js AFTER Leaflet -->
  <script src="https://api.windy.com/assets/map-forecast/libBoot.js"></script>
    
  </head>
<body style="margin:0;">
  <div id="windy" style="width:100%;height:100vh;"></div>
  <script>
    // Debugging setup
    function log(message) {
      const debug = document.getElementById('debug') || document.createElement('div');
      debug.id = 'debug';
      debug.style.position = 'fixed';
      debug.style.background = 'white';
      debug.style.padding = '10px';
      debug.style.zIndex = '9999';
      debug.innerHTML += message + '<br>';
      document.body.appendChild(debug);
    }

    function initWindy() { 
      
      if (typeof windyInit !== 'function') { 
        return;
      }

  windyInit({
    key: '${WINDY_API_KEY}',
    lat: ${lat},
    lon: ${lon},
    zoom: ${zoom},
    verbose: true
  }, windyAPI => { 
    windyAPI.overlay('temp'); 

      });
    }

    // Start initialization after everything loads
    if (document.readyState === 'complete') {
      initWindy();
    } else {
      window.addEventListener('load', initWindy);
      setTimeout(() => {
        if (typeof windyInit === 'undefined') { 
        }
      }, 3000);
    }
  </script>
</body>
</html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        style={styles.webview}
        originWhitelist={['*']}
        source={{ html: windyHTML }}
        //source={{ uri: 'https://expo.dev' }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mixedContentMode="always"
        startInLoadingState={true}
        onError={(error) => console.error('WebView error:', error)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
   // marginTop: Constants.statusBarHeight,
  },
  webview: {
    flex: 1,
  },
});

export default WindyMap;