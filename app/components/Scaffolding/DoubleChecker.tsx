import React from "react";
import {
  View,
  Modal, 
  Text, 
  TouchableOpacity,
} from "react-native";
import { useGlobalStyles } from "@/src/context/GlobalStylesContext";

const DoubleChecker = ({
  isVisible = false,
  toggleVisible,
  singleQuestionText = "single question goes here",
  optionalText = '',
  noButtonText = "go back",
  yesButtonText = "yes",
  onPress = () => console.log("No onpress integrated for double checker"),
}) => {
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={appContainerStyles.dCBackgroundContainer}>
        <View
          style={[
            appContainerStyles.doubleCheckerContainer,
            themeStyles.darkestBackground,
            { borderColor: "teal" },
          ]}
        >
          <View style={appContainerStyles.doubleCheckerQuestionContainer}>
            <Text numberOfLines={1} style={[appFontStyles.dCQuestionText, themeStyles.primaryText]}>
              {singleQuestionText}
            </Text>
            <Text style={[appFontStyles.dCOptionalText, themeStyles.primaryText]}>
              {optionalText && optionalText}
            </Text> 
          </View> 

          <View style={appContainerStyles.doubleCheckerButtonRow}>
            <TouchableOpacity
              style={[
                appContainerStyles.dCNoButton,
                themeStyles.darkestBackground,
                { borderColor: "transparent" },
              ]}
              onPress={toggleVisible}
            >
              <Text style={[appFontStyles.dCButtonText, themeStyles.primaryText]}>{noButtonText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                appContainerStyles.dCYesButton,
                themeStyles.darkestBackground,
                { borderColor: "transparent" },
              ]}
              onPress={onPress}
            >
              <Text style={[appFontStyles.dCButtonText, themeStyles.primaryText]}>{yesButtonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DoubleChecker;
