import React, { useState, useLayoutEffect } from 'react';
import { View, StyleSheet } from 'react-native'; 
import ArrowPixellySvg from '../../assets/svgs/arrow-pixelly.svg';
import WindyMap from '../WindyMap';
import ComponentSpinner from '../Scaffolding/ComponentSpinner';
import { useGlobalStyles } from '@/app/context/GlobalStylesContext';



const WindyWindSquare = ({ lat, lon, zoom=8, size=100 }) => {
    const [isLoading, setIsLoading] = useState(true);
    const { themeStyles } = useGlobalStyles();

    useLayoutEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000); // 3 seconds
  
      return () => clearTimeout(timer);
    }, []);
 

  return ( 
    <>
    {isLoading && <ComponentSpinner showSpinner={true} spinnerSize={50} backgroundColor={themeStyles.darkestBackground.backgroundColor} />}
      <WindyMap lat={lat} lon={lon} zoom={zoom} />
      
    </>
    
  );
};
 

export default WindyWindSquare;