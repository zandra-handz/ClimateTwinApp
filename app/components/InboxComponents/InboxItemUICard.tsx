import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import useDateTimeFunctions from "../../hooks/useDateTimeFunctions";
import CuteDetailBox from "../CuteDetailBox";
import SingleDetailPanel from "../SingleDetailPanel";
import GoToItemButton from "../GoToItemButton";
 
const InboxItemUICard = ({ data, onOpenInboxItemPress, isFullView }) => {
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();
  const { formatUTCToMonthDayYear } = useDateTimeFunctions();

  const contentType = data?.content_type.split('|')[1] || 'Unknown message type';
  const friendName = data?.sender?.username || 'unknown user';

  const findDetails = (
    <>
      <Text
        style={[
          appFontStyles.treasureCollectionDetailsText,
          themeStyles.primaryText,
        ]}
      >
        Sent {formatUTCToMonthDayYear(data?.created_on) || "unknown date"}
      </Text> 
    </>
  );
 
  const handlePress = () => {
    if (onOpenInboxItemPress) {
      onOpenInboxItemPress(data.id, data.message, contentType, friendName);

    }
  };

 
  // Recursively renders object fields
  const renderField = (key, value, level = 0) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return (
        <View key={key} style={{ marginLeft: level * 10 }}>
          <Text
            style={[
              themeStyles.primaryText,
              { fontWeight: "bold", flexWrap: "wrap", flexShrink: 1 },
            ]}
          >
            {key}:
          </Text>
          {Object.entries(value).map(([subKey, subValue]) =>
            renderField(subKey, subValue, level + 1)
          )}
        </View>
      );
    }

    return (
      <View
        key={key}
        style={{
          flexDirection: "row",
          marginVertical: 4,
          marginLeft: level * 10,
          flexWrap: "wrap",
        }}
      >
        <Text
          style={[
            themeStyles.primaryText,
            { fontWeight: "bold", flexWrap: "wrap", flexShrink: 1 },
          ]}
        >
          {key}:
        </Text>
        <Text
          style={[
            themeStyles.primaryText,
            { marginLeft: 8, flexWrap: "wrap", flexShrink: 1, flex: 1 },
          ]}
        >
          {value?.toString()}
        </Text>
      </View>
    );
  };

  return (
    <>
      {data?.pending != true && (
        <View
          style={[
            themeStyles.darkerBackground,
            appContainerStyles.treasureCardContainer,
            { borderColor: themeStyles.primaryBorder.color },
          ]}
        >
          <View style={appContainerStyles.treasureHeaderRow}>
            <Text
              style={[
                appFontStyles.treasureHeaderText,
                themeStyles.primaryText,
              ]}
            >
              {contentType}{" "}from{" "}{friendName || 'Unknown'}
            </Text>
            <Text               style={[
                appFontStyles.treasureHeaderText,
                themeStyles.primaryText,
              ]}>
             {" "}{"("}{data?.is_read ? 'Read' : 'New!'}{")"}
            </Text>
          </View>
          {isFullView && (
            
          <View
            style={[
              appContainerStyles.treasureDescriptionContainer,
              themeStyles.darkestBackground,
            ]}
          >
            <Text
              style={[
                appFontStyles.treasureDescriptionText,
                themeStyles.primaryText,
              ]}
            >
              <Text style={{ fontWeight: "bold" }}>Description: </Text>
              {data?.description || "No description given"}
            </Text>
          </View>
          
        )}
        {isFullView && (
          
          <View
            style={[
              appContainerStyles.treasureDescriptionContainer,
              themeStyles.darkestBackground,
            ]}
          >
            <Text
              style={[
                appFontStyles.treasureDescriptionText,
                themeStyles.primaryText,
              ]}
            >
              <Text style={{ fontWeight: "bold" }}>Additional data: </Text>
              {data?.add_data || "None recorded"}
            </Text>
          </View>
          
        )}
          <View style={[appContainerStyles.treasureCollectionDetailsSubheader]}>
            <CuteDetailBox
              iconOne={"heart"}
              iconTwo={"map"}
              message={findDetails}
            /> 

{/*         
          {data && data.giver && isFullView && (
               <CuteDetailBox
                iconOne={"gift"}
                iconTwo={"heart"}
                message={ownershipDetails}
                backgroundColor={themeStyles.primaryBackground.backgroundColor}
              />
          
          )} 
           */}
          </View> 

         {onOpenInboxItemPress && (
          
          <GoToItemButton onPress={() => handlePress()} label={'Go to message'}/>
          
         )}
        </View>
      )}
    </>
  );
};

export default InboxItemUICard;
