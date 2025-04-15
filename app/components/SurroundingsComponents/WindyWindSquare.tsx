import React, { useState, useLayoutEffect } from 'react'; 
import WindyMap from '../WindyMap';
import ComponentSpinner from '../Scaffolding/ComponentSpinner';
import { useGlobalStyles } from '@/src/context/GlobalStylesContext';

interface WindyWindSquareProps {
  lat: number;   
  lon: number;   
  zoom?: number;  // optional because defaults to 8 below
  size?: number;  // optional because defaults to 100 below
}

const WindyWindSquare: React.FC<WindyWindSquareProps> = ({ lat, lon, zoom = 8, size = 100 }) => {
 
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