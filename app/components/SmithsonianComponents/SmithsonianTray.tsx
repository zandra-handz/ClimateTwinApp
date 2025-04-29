import { View, Text } from "react-native";
import React, {
  useEffect,
  useState, 
} from "react";
import SmithsonianImageCard from "./SmithsonianImageCard";
import useSmithsonian from "@/app/DELETE/useSmithsonian";
import { useGlobalStyles } from "@/src/context/GlobalStylesContext"; 

const SmithsonianTray = ({ queryString, base, photoNumber }) => {
  const { smithsonian, isPending, isFetching, smithsonianMutation } = useSmithsonian({
    queryString,
    base,
  });
  const { handleAvgPhotoColor, avgPhotoColor } = useGlobalStyles();
  const [indexNumber, setindexNumber] = useState(0);
 

  const debug = true;
 

 

  useEffect(() => {
    if (smithsonian && !isPending && !isFetching) {
      //&& debug) {
      console.log("setting pic color in smithsoniantray");

      handleAvgPhotoColor(smithsonian?.photos?.[photoNumber]?.color || null); //this checks if same value and won't set again if it is.
    }
  }, [smithsonian, isFetching, isPending, avgPhotoColor]); //added avgPhotoColor to make this reset when reponened to same item since other components null this

  useEffect(() => {
    if (queryString && debug) {
      console.log("smithsonianTRAY DEBUG: queryString:", queryString);
    }
  }, [queryString]);

  return (
    <View
      style={{
        width: "100%",

        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "center",
        height: "auto",
      }}
    >
<SmithsonianImageCard
  value={smithsonian?.photos?.[photoNumber]?.urls?.regular || null} // Keep accessing "urls.regular"
  accessibilityLabel={smithsonian?.photos?.[photoNumber]?.alt_description || "No label available"} // Use "alt_description"
  avgColor={smithsonian?.photos?.[photoNumber]?.color || null} // Use "color" instead of "avg_color"
/>

    </View>
  );
};

export default SmithsonianTray;
