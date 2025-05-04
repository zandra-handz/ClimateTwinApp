import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import useDateTimeFunctions from "@/src/hooks/useDateTimeFunctions";

const HistoryUICard = ({ data, leftSide = false, onPress }) => {
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();
  const { formatUTCToMonthDayYear } = useDateTimeFunctions();

  const FindDateVisited = () => {
    if (data && data?.visit_created_on) {
      let date = formatUTCToMonthDayYear(data.visit_created_on);
      return (
        <Text style={[themeStyles.primaryText, styles.historyCardHeaderText]}>
          {date}
        </Text>
      );
    } else {
      return (
        <Text style={[themeStyles.primaryText, styles.historyCardHeaderText]}>
          Unknown data
        </Text>
      );
    }
  };

  const FindLocationVisited = () => { 
      return (
        <Text style={[themeStyles.primaryText, styles.historyCardText,    {
            textAlign: leftSide ? 'right' : 'left',
            flexShrink: 1, // optional: helps with long words
          }]}>
            {data && data?.location_name && data.location_name || 'Unknown location'}
          
        </Text>
      ); 
  };

 

  
  return (
    <View
      style={[
        themeStyles.primaryBackground,
        styles.container,
        // appContainerStyles.historyCardContainer,
        //   { borderColor: themeStyles.primaryBorder.color },
      ]}
    >
      <View
        style={{
          position: "absolute",
          backgroundColor: themeStyles.primaryText.color,
          top: 0,
          bottom: 0,
          width: 2,
          opacity: .5,
        }}
      ></View>
            <View
        style={{
          position: "absolute",
          backgroundColor: 'teal',
          
          bottom: '100%',
          width: 10,
          height: 10,
          borderRadius: 10 / 2,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: 'teal',
        }}
      ></View>
      <View
        style={[
            styles.row,
            {
              justifyContent: leftSide ? "flex-start" : "flex-end",
              marginRight: leftSide ? "0%" : 0,
              marginLeft: leftSide ? 0 : "105%",
              paddingRight: '54%',
              paddingLeft: 10,
            //  backgroundColor: 'blue',
            },
        ]}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: leftSide ? "flex-end" : 'flex-start',
          }}
        >
          <FindDateVisited />
        </View>
      </View>
      <View
        style={[
          styles.row,
          {
            justifyContent: leftSide ? "flex-start" : "flex-end",
            marginRight: leftSide ? "0%" : 0,
            marginLeft: leftSide ? 0 : "105%",
            paddingRight: '54%',
            paddingLeft: 10,
           // backgroundColor: 'blue',
          },
        ]}
      >
        <View
          style={{
            width: "100%", 
            flexDirection: "row",
            height: "auto",
            flexWrap: "flex",
            justifyContent: leftSide ? "flex-end" : 'flex-start',
            textAlign: leftSide ? 'right' : 'left',
          //  backgroundColor: 'blue',
            
          }}
        >
          <FindLocationVisited />
        </View>
      </View>
      {/* {Object.entries(data).map(([key, value]) => renderField(key, value))} */}
      {/* <TouchableOpacity onPress={() => onPress(data)}>
        <Text style={themeStyles.primaryText}>PRESS ME</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: "auto",
    padding: 10,
    paddingVertical: 20,
    paddingLeft: 0, //doing this in lower level wrapper
    borderRadius: 6,
    width: "100%",
    flexDirection: "column",
    flex: 1,
    zIndex: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: "row",
    width: "100%",
    height: "auto",
  },
  locationRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    height: "auto",
    flexWrap: "flex",
    width: "100%",
    paddingRight: "50%",
  },
  historyCardText: {
    fontSize: 14,
    lineHeight: 21,
  },
  historyCardHeaderText: {
    fontWeight: "bold",
    fontSize: 15,
    lineHeight: 22,
  },
});

export default HistoryUICard;
