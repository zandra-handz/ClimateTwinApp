import { useEffect, useState } from 'react'; 
import ScrollDetailPanel from '../ScrollDetailPanel';  
//import useGroq from '@/app/hooks/useGroq';  
import { useGroqContext } from '@/app/context/GroqContext';


const GroqHistory = ({ title, cacheKey='history', userId, opacity }) => { 
  //const { liveWeather } = useLiveWeather();
  const { groqHistory, isPending } = useGroqContext();

 
 

    const [ showSpinner, setShowSpinner ] = useState(true);
    
  


  useEffect(() => {
    if (isPending) {
      setShowSpinner(true)
    } else {
      setShowSpinner(false);
    }

  }, [isPending]);
  
 
  

  return (
<> 
  
  <ScrollDetailPanel label={title} value={groqHistory} opacity={opacity} isLoading={showSpinner} />
  
</>
  )
};

export default GroqHistory;
