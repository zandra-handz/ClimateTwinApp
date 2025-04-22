import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useGlobalStyles } from "../../src/context/GlobalStylesContext";
// Forwarding ref to the parent to expose the TextInput value
const TextInputBlockForModal = forwardRef(
  //width and height are original settings being used in location notes
  (
    {
      title = "",
      mountingText = "",
      onTextChange,
      helperText,
      autoFocus = true,
      width = "90%",
      height = "60%",
      multiline = true,
      onSubmitEditing,
      timedAutoFocus,
    },
    ref
  ) => {
    const { themeStyles, appContainerStyles } = useGlobalStyles();
    const [editedMessage, setEditedMessage] = useState(mountingText); // Use the starting text passed as prop
    const textInputRef = useRef();

    useLayoutEffect(() => {
      if (textInputRef.current) {
        textInputRef.current.setNativeProps({ text: mountingText });
        setEditedMessage(mountingText);
      }
    }, []);


    // useEffect(() => {
    //   if (timedAutoFocus && textInputRef.current) {
    //     console.log("focusing in textinputbloc");
    
    //     const timeout = setTimeout(() => {
    //       textInputRef.current?.focus();
    //     }, 100); // small delay for safety
    
    //     return () => clearTimeout(timeout);
    //   }
    // }, [timedAutoFocus]);
    

    // Expose the current value of the TextInput via the ref
    useImperativeHandle(ref, () => ({
      setText: (text) => {
        if (textInputRef.current) {
          textInputRef.current.setNativeProps({ text });
          setEditedMessage(text);
        }
      },
      clearText: () => {
        if (textInputRef.current) {
          textInputRef.current.clear();
          setEditedMessage("");
        }
      },
      focusText: () => {
        if (textInputRef.current) {
          textInputRef.current.focus();
          //  setEditedMessage("");
        }
      },
      getText: () => editedMessage,
    }));

    useLayoutEffect(() => {
      setEditedMessage(mountingText); // Reset to starting text if it changes
    }, [mountingText]);

    const handleTextInputChange = (text) => {
      // console.log(text);
      setEditedMessage(text);
      onTextChange(text);
    };

    return (
      <View
        style={[
          appContainerStyles.goToItemButtonContainer,
          themeStyles.primaryBackground,
          { borderColor: themeStyles.primaryText.color },
          // { width: width, height: height },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            height: "auto",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              height: "100%",
              alignItems: "center",
            }}
          >
            {title && (
              <Text style={[styles.title, themeStyles.primaryText]}>
                {title}
              </Text>
            )}
          </View>
        </View>
        <View style={{ flex: 1, width: "100%" }}>
          {/* {helperText && (
              <Text style={[styles.helperText, themeStyles.primaryText]}>
                {helperText}
              </Text>
            )} */}
            {timedAutoFocus && (
              
          <TextInput
            ref={textInputRef}
            autoFocus={true}
            style={[
              themeStyles.primaryText,
              // themeStyles.darkerBackground,
              {
                textAlignVertical: "top",
                borderRadius: 10,
                paddingVertical: 10,
                flex: 1,
                width: "100%",
              },
            ]}
            value={editedMessage}
            onChangeText={handleTextInputChange} // Update local state
            multiline={multiline}
            onSubmitEditing={onSubmitEditing}
          />
          
        )}
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  title: {
    fontSize: 15,
    lineHeight: 21,
    textTransform: "uppercase",
  },
  helperText: {
    fontSize: 16,
    lineHeight: 20,
    opacity: 0.5,
    //marginLeft: '6%'
    //textTransform: "uppercase",
  },
});

export default TextInputBlockForModal;
