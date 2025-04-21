import React, {
  createContext,
  useContext,
  useRef,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useUser } from "./UserContext";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { go, getRemainingGoes, expireSurroundings } from "../calls/apicalls";

import { useSurroundingsWS } from "./SurroundingsWSContext";
import { useAppMessage } from "./AppMessageContext";

import useExploreRoute from "../../app/hooks/useExploreRoute";
interface ActiveSearchContextType {
  isSearchingForTwin: boolean;
  isSearchingForRuins: boolean;
  isHome: boolean;
  isExploring: boolean;
  triggerActiveSearch: () => void;
}

const ActiveSearchContext = createContext<ActiveSearchContextType | undefined>(
  undefined
);

export const useActiveSearch = (): ActiveSearchContextType => {
  const context = useContext(ActiveSearchContext);
  if (!context) {
    throw new Error(
      "useActiveSearch must be used within an ActiveSearchProvider"
    );
  }
  return context;
};

interface ActiveSearchProviderProps {
  children: ReactNode;
}

export const ActiveSearchProvider: React.FC<ActiveSearchProviderProps> = ({
  children,
}) => {
  const { user, isAuthenticated, isInitializing } = useUser();
  const { showAppMessage } = useAppMessage();
  const queryClient = useQueryClient();
  const timeoutRef = useRef(null);
  const [isSearchingForRuins, setIsSearchingForRuins] =
    useState<boolean>(false);
  const [isSearchingForTwin, setIsSearchingForTwin] = useState<boolean>(false);
  const [isExploring, setIsExploring] = useState<boolean>(false);
  const [isHome, setIsHome] = useState<boolean>(false);
  const { locationUpdateWSIsOpen, lastLocationId, lastState } = useSurroundingsWS();

  useEffect(() => {
    if (!isAuthenticated) {
      // console.log(
      //   "isAuthenticated === false --> resetting ActiveSearch context"
      // );
      setIsSearchingForTwin(false);
      setIsSearchingForRuins(false);
      setIsExploring(false);
      setIsHome(false);
    }
  }, [isAuthenticated]);

  useExploreRoute(lastState, isAuthenticated);

  const {
    data: remainingGoes,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["remainingGoes", user?.id],
    queryFn: () => getRemainingGoes(),
    enabled: !!isAuthenticated && !isInitializing && !!lastState,
    onSuccess: (data) => {},
  });

  const refetchRemainingGoes = () => {
    queryClient.invalidateQueries({ queryKey: ["remainingGoes", user?.id] });
    queryClient.refetchQueries({ queryKey: ["remainingGoes", user?.id] });
  };

  const handleGo = (address) => {
    // Make sure `user?.user?.address` is valid before calling the mutation
    if (address) {
      sendGoRequestMutation.mutate(address);
    } else {
      console.error("User address is unavailable");
    }
  };

  const sendGoRequestMutation = useMutation({
    mutationFn: (address) => go(address),
    onMutate: () => {
      // setIsSearchingForTwin(true); //Extra, might set it slightly earlier than we get the info from the socket
    },
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        sendGoRequestMutation.reset();
      }, 2000);
    },
    onSuccess: (data) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        sendGoRequestMutation.reset();
      }, 2000);
    },
  });

  const handleGoHome = () => {
    sendGoHomeMutation.mutate();
  };

  const sendGoHomeMutation = useMutation({
    mutationFn: expireSurroundings,
    onMutate: () => {
      console.log("go home mutation activated");
    },
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        sendGoHomeMutation.reset();
      }, 2000);
    },
    onSuccess: (data) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        sendGoHomeMutation.reset();
      }, 2000);
    },
  });

  useEffect(() => {
    if (isExploring) {
      refetchRemainingGoes();
    }
  }, [isExploring]);

  useEffect(() => {
    if (lastState) {
      if (lastState === "searching for twin") {
        setIsHome(false);
        setIsSearchingForTwin(true);
        setIsSearchingForRuins(false);
        setIsExploring(false);
        showAppMessage(true, null, "Searching for portal!");
      } else if (lastState === "searching for ruins") {
        setIsSearchingForTwin(false);
        setIsSearchingForRuins(true);
        setIsHome(false);
        setIsExploring(false);
        // showAppMessage(true, null, "Searching for ruins!");
      } else if (lastState === "home") {
        setIsSearchingForTwin(false);
        setIsSearchingForRuins(false);
        setIsHome(true);
        setIsExploring(false);
        // showAppMessage(true, null, "You are home");
      } else if (lastState === "exploring") {
        setIsSearchingForTwin(false);
        setIsSearchingForRuins(false);
        setIsHome(false);
        setIsExploring(true);
        // showAppMessage(true, null, "You are exploring!");
      }
    }
  }, [lastState]);

  return (
    <ActiveSearchContext.Provider
      value={{
        isHome,
        isSearchingForTwin,
        isSearchingForRuins,
        isExploring,
        handleGo,
        locationUpdateWSIsOpen,
        remainingGoes,
        handleGoHome,
      }}
    >
      {children}
    </ActiveSearchContext.Provider>
  );
};
