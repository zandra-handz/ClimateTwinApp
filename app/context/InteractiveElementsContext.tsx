import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useUser } from './UserContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getItemChoices } from '../apicalls';  

interface Choice {
  id: number;
  explore_location: number;
  last_accessed: string;
  twin_location: number;
  created_on: string;
  user: number;
}

interface ItemChoicesResponse {
  choices: Record<string, Choice>; // choices is now an object with key-value pairs
}

interface InteractiveElementsContextType {
  itemChoices: [string, Choice][]; // itemChoices is now an array of key-value pairs
  triggerItemChoicesRefetch: () => void;
}

const InteractiveElementsContext = createContext<InteractiveElementsContextType | undefined>(undefined);

export const useInteractiveElements = (): InteractiveElementsContextType => {
  const context = useContext(InteractiveElementsContext);
  if (!context) {
    throw new Error('useInteractiveElements must be used within an InteractiveElementsProvider');
  }
  return context;
};

interface InteractiveElementsProviderProps {
  children: ReactNode;
}

export const InteractiveElementsProvider: React.FC<InteractiveElementsProviderProps> = ({ children }) => {
  const { user } = useUser(); 
  const queryClient = useQueryClient();

  const { data: itemChoicesResponse, isLoading, isError } = useQuery<ItemChoicesResponse | null>({
    queryKey: ['itemChoices'],
    queryFn: getItemChoices,
    enabled: !!user && !!user.authenticated,
    onError: (err) => {
      console.error('Error fetching location data:', err);
    },
    onSuccess: (data) => {
      if (data) {
        console.log('getItemChoices success:', data);
      }
    },
  });

  // Convert itemChoices.choices (object) into an array of key-value pairs
  const itemChoices = itemChoicesResponse?.choices
    ? Object.entries(itemChoicesResponse.choices) // Convert object to array of key-value pairs
    : [];

    const triggerItemChoicesRefetch = () => {
      queryClient.invalidateQueries({ queryKey: ['itemChoices'] });
    };

  return (
    <InteractiveElementsContext.Provider 
      value={{ itemChoices, triggerItemChoicesRefetch }}
    >
      {children}
    </InteractiveElementsContext.Provider>
  );
};
