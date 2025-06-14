import { View, Text  } from "react-native";
import React, { useState } from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import useDateTimeFunctions from "../../../src/hooks/useDateTimeFunctions";
import CuteDetailBox from "../CuteDetailBox";
import GoToItemButton from "../GoToItemButton"; 
import { useTreasures } from "@/src/context/TreasuresContext";
 
import { useFriends } from "@/src/context/FriendsContext";
import { router } from "expo-router"; 
 

const TreasuresUICard = ({ data, onOpenTreasurePress, isFullView, recGiftRequests, sentGiftRequests  }) => {
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();
  const { formatUTCToMonthDayYear } = useDateTimeFunctions();
  const { friendsAndRequests } = useFriends();
  const [isDoubleCheckerVisible, setDoubleCheckerVisible] = useState(false);
  const { handleGiftTreasureBackToFinder } = useTreasures();

  const handleToggleDoubleChecker = () => {
    setDoubleCheckerVisible((prev) => !prev);
  };

  const handleGiftTreasureBack = () => {
    handleGiftTreasureBackToFinder(data?.id);
    handleToggleDoubleChecker();
    router.back();
  };


  
  const handleDeleteTreasure = () => {
    console.log(`handleDeleteTreasure function has yet to be written`);
  };

  const renderFriendName = (id) => {
    if (friendsAndRequests?.friends) {
      const friend = friendsAndRequests?.friends?.find((friend) => friend.id === id);
      return friend?.username || null;
    } else {
      return null;
    }
  };

  const handlePress = () => {
    if (onOpenTreasurePress) {
      onOpenTreasurePress(data.id, data.descriptor);
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
        {data?.miles_traveled_to_collect || "0"} miles{" "}
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
        {data?.location_name || "unknown"}
      </Text>
      <Text
        style={[
          appFontStyles.treasureCollectionDetailsText,
          themeStyles.primaryText,
        ]}
      >
        {" "}
        to collect on{" "}
        {formatUTCToMonthDayYear(data?.created_on) || "unknown date"}.
      </Text>
    </>
  );

  const ownershipDetails = (
    <>
      <Text
        style={[
          appFontStyles.treasureCollectionDetailsText,
          themeStyles.primaryText,
        ]}
      >
        This was given to you by {renderFriendName(data.giver)} on{" "}
        {formatUTCToMonthDayYear(data?.owned_since) ||
          formatUTCToMonthDayYear(data?.created_on) ||
          "unknown date"}
        !
      </Text>
    </>
  );

  const originalOwnerDetails = (
    <>
      <Text
        style={[
          appFontStyles.treasureCollectionDetailsText,
          themeStyles.primaryText,
        ]}
      >
        You have owned this since{" "}
        {formatUTCToMonthDayYear(data?.owned_since) ||
          formatUTCToMonthDayYear(data?.created_on) ||
          "unknown date"}
        .
      </Text>
    </>
  );

  return (
    <>

      {/* {isDoubleCheckerVisible && (
        <DoubleChecker
          isVisible={isDoubleCheckerVisible}
          toggleVisible={handleToggleDoubleChecker}
          singleQuestionText={`Send ${
            data?.descriptor || ""
          } back to original finder :)?`}
          optionalText="(They can accept or decline.)"
          noButtonText="Back"
          yesButtonText="Yes"
          onPress={handleGiftTreasureBack}
        />
      )} */}

      {/* {isDoubleCheckerVisible && (
        <DoubleChecker
          isVisible={isDoubleCheckerVisible}
          toggleVisible={handleToggleDoubleChecker}
          singleQuestionText={`Delete ${data?.descriptor || ""}?`}
          optionalText="(You must be the original finder of this treasure to delete it.)"
          noButtonText="Back"
          yesButtonText="Yes"
          onPress={handleDeleteTreasure}
        />
      )} */} 
        <View
          style={[
            themeStyles.primaryBackground,
            appContainerStyles.treasureCardContainer,
            { borderColor: themeStyles.primaryBorder.color },
          ]}
        >
          {!isFullView && (
            
          <View style={appContainerStyles.treasureHeaderRow}>
            <Text
              style={[
                appFontStyles.treasureHeaderText,
                themeStyles.primaryText,
              ]}
            >
              {data?.descriptor || "unnamed Item"}
            </Text>
          </View>
          
        )}
          {isFullView && (
            <View
              style={[
                appContainerStyles.treasureDescriptionContainer,
                themeStyles.darkestBackground,
                {marginVertical: 4}
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
                {marginVertical: 4}
              ]}
            >
              <Text
                style={[
                  appFontStyles.treasureDescriptionText,
                  themeStyles.primaryText,
                ]}
              >
                <Text style={{ fontWeight: "bold" }}>Original user: </Text>
                {data?.original_user || "No original user"}
              </Text>
            </View>
          )}
          {isFullView && (
            <View
              style={[
                appContainerStyles.treasureDescriptionContainer,
                themeStyles.darkestBackground,
                {marginVertical: 4}
              ]}
            >
              <Text
                style={[
                  appFontStyles.treasureDescriptionText,
                  themeStyles.primaryText,
                ]}
              >
                <Text style={{ fontWeight: "bold" }}>Finder: </Text>
                {data?.finder || "No finder found!"}
              </Text>
            </View>
          )}
          {isFullView && (
            <View
              style={[
                appContainerStyles.treasureDescriptionContainer,
                themeStyles.darkestBackground,
                {marginVertical: 4}
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

            {data && data.giver && isFullView && (
              <CuteDetailBox
                iconOne={"gift"}
                iconTwo={"heart"}
                message={ownershipDetails}
                backgroundColor={themeStyles.primaryBackground.backgroundColor}
              />
            )}
            {data && !data.giver && isFullView && (
              <CuteDetailBox
                iconTwo={"map"}
                message={originalOwnerDetails}
                backgroundColor={themeStyles.primaryBackground.backgroundColor}
              />
            )}
          </View>

          {onOpenTreasurePress && (
            <GoToItemButton
              onPress={() => handlePress()}
              label={"Go to treasure"}
            />
          )}

          {isFullView && (
            <View style={{height: 80}}></View>
          )}
          {/* {isFullView && (
            // <DeleteItemButton
            //   onPress={() => handleToggleDoubleChecker()}
            //   label={"Delete"}
            // />
            <View style={appContainerStyles}>

            <ReturnItemButton onPress={() => handleToggleDoubleChecker()} />
              </View>
          )} */}
        </View> 
    </>
  );
};

export default TreasuresUICard;
