import React from "react";
import { View } from "react-native";
import { useSurroundings } from "../../context/CurrentSurroundingsContext";
import SingleDetailPanel from "@/app/components/SingleDetailPanel";
import WindFriendsView from "@/app/components/SurroundingsComponents/WindFriendsView";
import MagnifiedNavButton from "../MagnifiedNavButton";
import { useGlobalStyles } from "@/app/context/GlobalStylesContext";
import { useInteractiveElements } from "@/app/context/InteractiveElementsContext";
import WindyWindFriendsView from "./WindyWindFriendsView";

const PortalSurroundingsView = ({ height, triggerParentAutoScroll }) => {
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const { portalSurroundings, ruinsSurroundings, homeSurroundings, handlePickNewSurroundings } = useSurroundings();
  const { triggerItemChoicesRefetch } = useInteractiveElements();
  const isDisabled = !!ruinsSurroundings?.id;

  const handleExploreLocation = async () => {
    const formattedData =  {
      explore_type: 'twin_location',
      id: portalSurroundings?.id,
    } 
    await handlePickNewSurroundings(formattedData);
    //triggerParentAutoScroll();
    //triggerItemChoicesRefetch();
 
  };

  const overlayColor = `${themeStyles.primaryBackground.backgroundColor}CC`; //99 is slightly lighter


  return (
    <View style={{ flex: 1, height, position: "relative" }}>
      <View style={{ height: 90, width: "100%" }} />

      {/* Main content container */}
      <View
        style={{
         // backgroundColor: "gray",
          borderRadius: 20,
          width: "100%",
          //padding: 10,
          zIndex: 1, // Ensures this section is below the overlay
        }}
      >
        {/* <WindFriendsView
          name={portalSurroundings.name}
          description={portalSurroundings.description}
          windSpeed={portalSurroundings.windSpeed}
          windDirection={portalSurroundings.windDirection}
          windFriends={portalSurroundings.windFriends}
          homeDescription={homeSurroundings.description}
          homeWindSpeed={homeSurroundings.windSpeed}
          homeWindDirection={homeSurroundings.windDirection}
        /> */}

      <WindyWindFriendsView
          name={portalSurroundings.name}
          description={portalSurroundings.description}
          windSpeed={portalSurroundings.windSpeed}
          windDirection={portalSurroundings.windDirection}
          windFriends={portalSurroundings.windFriends}
          homeDescription={homeSurroundings.description}
          homeWindSpeed={homeSurroundings.windSpeed}
          homeWindDirection={homeSurroundings.windDirection}

          homeLat={homeSurroundings.latitude}
          homeLon={homeSurroundings.longitude}
          //homeZoom set inside
          portalLat={portalSurroundings.latitude}
          portalLon={portalSurroundings.longitude}
          //portalZoom set inside
          
        />

        {/* <SingleDetailPanel label="Details" value={portalSurroundings.details} />
         <SingleDetailPanel
          label={"Experience"}
          value={portalSurroundings.experience}
        />  
        <SingleDetailPanel label="Wind speed interaction" value={portalSurroundings.windSpeedInteraction} />
      */}
     
        {isDisabled && (
        <View style={[appContainerStyles.dimmer, {backgroundColor: overlayColor}]}  >

          <MagnifiedNavButton message={"Go back to portal location"} onPress={handleExploreLocation}/>
          {/* <View
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              padding: 20,
              borderRadius: 10,
            }}
          >
            <SingleDetailPanel label="This section is disabled" value="Due to ruins surroundings" />
          </View> */}
        </View>
      )}
     
      </View>

      {/* Overlay to disable interactions */}

    </View>
  );
};

export default PortalSurroundingsView;



// import React from "react";
// import { View } from "react-native";
// import { useSurroundings } from "../../context/CurrentSurroundingsContext";
// import SingleDetailPanel from "@/app/components/SingleDetailPanel";

// import WindFriendsView from "@/app/components/SurroundingsComponents/WindFriendsView";

// const PortalSurroundingsView = ({ height }) => {
//   const { portalSurroundings, ruinsSurroundings, homeSurroundings } = useSurroundings();

//   return (
//     <View style={{ flex: 1, height: height, zIndex: 1 }}>
//       <View style={{ height: 90, width: "100%" }}></View>
//       <View style={{backgroundColor: 'gray', borderRadius: 20, width: '100%'}}>
        

//       <>
//         <WindFriendsView
//           name={portalSurroundings.name}
//           description={portalSurroundings.description}
//           windSpeed={portalSurroundings.windSpeed}
//           windDirection={portalSurroundings.windDirection}
//           windFriends={portalSurroundings.windFriends}
//           homeDescription={homeSurroundings.description}
//           homeWindSpeed={homeSurroundings.windSpeed}
//           homeWindDirection={homeSurroundings.windDirection}
//           disabled={!!ruinsSurroundings?.id}
//         />

//         {/* <SingleDetailPanel
//           label={"Experience"}
//           value={portalSurroundings.experience}
//         /> */}

//         <SingleDetailPanel
//           label={"Details"}
//           value={portalSurroundings.details}
//         />

//         <SingleDetailPanel
//           label={"Wind speed interaction"}
//           value={portalSurroundings.windSpeedInteraction}
//         />

//         {/* <SingleDetailPanel
//           label={"Pressure interaction"}
//           value={portalSurroundings.pressureInteraction}
//         />
//         <SingleDetailPanel
//           label={"Humidity interaction"}
//           value={portalSurroundings.humidityInteraction}
//         /> */}
//       </>
      
//       </View>
//       </View> 
//   );
// };

// export default PortalSurroundingsView;
