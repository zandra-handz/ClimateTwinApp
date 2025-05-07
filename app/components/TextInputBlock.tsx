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
const TextInputBlock = forwardRef(
  //width and height are original settings being used in location notes
  (
    {
      title = "title",
      mountingText = "",
      onTextChange,
      helperText,
      height = '60%',
      autoFocus = true, 
      multiline = true,
      onSubmitEditing,
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
          appContainerStyles.textInputAndTextBlockContainer,
          themeStyles.primaryBackground,
          { width: '100%', height: height, borderColor: themeStyles.primaryText.color },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            height: "auto",
            alignItems: 'center',
          }}
        >
          <View style={{flexDirection: 'row', height: '100%', alignItems: 'center'}}>
          <Text style={[styles.title, themeStyles.primaryText]}>
            {title}
          </Text>
          </View>

          {/* <EditPencilOutlineSvg height={30} width={30} color={iconColor} /> */}
        </View>
        <View style={{ flex: 1 }}>

        {/* {helperText && (
            <Text style={[styles.helperText, themeStyles.primaryText]}>
              {helperText}
            </Text>
          )} */}
          <TextInput
            ref={textInputRef}
            autoFocus={autoFocus}
            style={[
              styles.textInput,
              themeStyles.primaryText, 
            ]}
            value={editedMessage}
            onChangeText={handleTextInputChange} // Update local state
            multiline={multiline}
            onSubmitEditing={onSubmitEditing}
          />
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    padding: "4%",
  },
  container: {
    borderRadius: 10,
    alignSelf: "center",
    padding: 20, 
    width: '100%',
  },
  title: {
    fontSize: 16,
    lineHeight: 34,
    fontWeight: 'bold',
  //  textTransform: "uppercase",
  },
  helperText: {
    fontSize: 16,
    lineHeight: 20,
    opacity: .5,
    //marginLeft: '6%'
    //textTransform: "uppercase",
  },
  textInput: {
    textAlignVertical: "top",
    borderRadius: 20,
    paddingVertical: 10,
    flex: 1,
    lineHeight: 26,
    fontSize: 15,
  },
});

export default TextInputBlock;