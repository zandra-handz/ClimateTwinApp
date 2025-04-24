import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { useGlobalStyles } from "@/src/context/GlobalStylesContext";

import { useFriends } from "@/src/context/FriendsContext";
import Avatar from "../FriendsComponents/Avatar";
import useDateTimeFunctions from "@/app/hooks/useDateTimeFunctions";

import { AntDesign, Feather } from "@expo/vector-icons";



const TreasureListItem = ({
  treasure,
  avatar=null,
  size,
  onPress,
  showIsFriend = false,
}) => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { formatUTCToMonthDayYear } = useDateTimeFunctions();

 

  const findDetails = (
    <>
      <Text
        style={[
          appFontStyles.treasureCollectionDetailsText,
          themeStyles.primaryText,
        ]}
      >
        Finder traveled
      </Text>
      <Text
        style={[
          appFontStyles.treasureCollectionDetailsBoldText,
          themeStyles.primaryText,
        ]}
      >
        {" "}
        {treasure?.miles_traveled_to_collect || "0"} miles{" "}
      </Text>
      <Text
        style={[
          appFontStyles.treasureCollectionDetailsText,
          themeStyles.primaryText,
        ]}
      >
        to{" "}
      </Text>
      <Text
        style={[
          appFontStyles.treasureCollectionDetailsBoldText,
          themeStyles.primaryText,
        ]}
      >
        {treasure?.location_name || "unknown"}
      </Text>
      <Text
        style={[
          appFontStyles.treasureCollectionDetailsText,
          themeStyles.primaryText,
        ]}
      >
        {" "}
        to collect on{" "}
        {formatUTCToMonthDayYear(treasure?.created_on) || "unknown date"}.
      </Text>
    </>
  );

  const findOwnedSince = (
     <>
       <Text
         style={[
           appFontStyles.treasureCollectionDetailsText,
           themeStyles.primaryText,
         ]}
       >
         Owned since:{" "}
         {formatUTCToMonthDayYear(treasure?.owned_since) ||
           formatUTCToMonthDayYear(treasure?.created_on) ||
           "unknown date"}
         
       </Text>
     </>
   );

   const findLocation = (
    <>
      <Text
        style={[
          appFontStyles.treasureCollectionDetailsText,
          themeStyles.primaryText,
        ]}
      > {" "}
        {treasure?.location_country} 
        
      </Text>
    </>
  );

  return (
    <TouchableOpacity
      style={[
        appContainerStyles.pickerButtonContainer,
        themeStyles.darkerBackground,
        { borderColor: themeStyles.primaryText.color, height: size * 1.8 },
      ]}
      onPress={() => onPress(treasure.id, treasure.username)} // different from userlistitem
    >
      <View style={{ paddingRight: size / 3 }}>
        <Avatar image={avatar} size={size} />
      </View>

      <View style={{ flexDirection: "column", width: 300 }}>
        <Text style={[themeStyles.primaryText, appFontStyles.dCButtonText]}>
          {treasure.descriptor}
        </Text>
        <View style={{flexDirection: 'row',  alignItems: 'center', flexWrap: 'wrap', height: 'auto'}}>
    
        <Feather
        name={'map'}
        size={appContainerStyles.exploreTabBarIcon}
        color={themeStyles.primaryText.color}
        /> 
        <Text style={[themeStyles.primaryText]}>{findLocation}</Text>
        </View>
        <Text style={[themeStyles.primaryText]}>{findOwnedSince}</Text>
        {/* <Text style={[themeStyles.primaryText]}>
        {findDetails}
      </Text> */}
      </View>
      {/* {showIsFriend && (
        <View
          style={{
            position: "absolute",
            height: "100%",
            width: 110,
            right: 10,
            padding: 6,
          }}
        >
          <GiftingFunctionsButton
            cTUserId={user.id}
            cTUsername={user.username}
            size={size}
          />
        </View>
      )} */}
    </TouchableOpacity>
  );
};

export default TreasureListItem;
