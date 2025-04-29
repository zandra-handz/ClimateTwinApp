import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useGlobalStyles } from "@/src/context/GlobalStylesContext";
 
import Avatar from "../FriendsComponents/Avatar";
import useDateTimeFunctions from "@/src/hooks/useDateTimeFunctions";
import GiftingFunctionsButton from "./GiftingFunctionsButton";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useUser } from "@/src/context/UserContext";



const TreasureSearchableListItem = ({
  treasure,
  avatar=null,
  size,
  onPress, 
  recGiftRequests,
  sentGiftRequests,
}) => {
  const { user } = useUser();
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


      const findCurrentOwner = (
       <>
       {treasure?.user === user?.id && (
                <Text
                style={[
                  appFontStyles.treasureCollectionDetailsText,
                  themeStyles.primaryText,
                ]}
              >
                Current keeper:{" "}
                You
                
              </Text>

       ) }
       {treasure?.user !== user?.id && (
         <Text
           style={[
             appFontStyles.treasureCollectionDetailsText,
             themeStyles.primaryText,
           ]}
         >
           Current keeper:{" "}
           {(treasure?.user_username) || 
             "unknown" }
           
         </Text>
      )}
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
      onPress={() => onPress(treasure?.id, treasure.descriptor)} // different from userlistitem
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
        <Text style={[themeStyles.primaryText]}>{findCurrentOwner}</Text>
        {/* <Text style={[themeStyles.primaryText]}>
        {findDetails}
      </Text> */}
      </View>
      {/* {showIsFriend && ( */}
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
         
            cTUserId={user?.id}
            cTUsername={user?.username}
            treasureId={treasure.id}
            treasureName={treasure.descriptor}
            size={size}
            recGiftRequests={recGiftRequests}
            sentGiftRequests={sentGiftRequests}
          />
        </View>
      {/* )} */}
    </TouchableOpacity>
  );
};

export default TreasureSearchableListItem;
