export interface PortalSurroundings {
    name: string;
    id: number | null;
    lastAccessed: string;
    temperature: number;
    description: string;
    windSpeed: number;
    windDirection: number;
    humidity: number;
    pressure: number;
    cloudiness: number;
    sunriseTimestamp: number;
    sunsetTimestamp: number;
    latitude: number;
    longitude: number;
    windFriends: string;
    specialHarmony: boolean;
    details: string;
    experience: string;
    windSpeedInteraction: string;
    pressureInteraction: string;
    humidityInteraction: string;
    strongerWindInteraction: string;
    expired: boolean;
  }
  
  export interface HomeSurroundings {
    name: string;
    id: number | null;
    lastAccessed: string;
    temperature: number;
    description: string;
    windSpeed: number;
    windDirection: number;
    humidity: number;
    pressure: number;
    cloudiness: number;
    sunriseTimestamp: number;
    sunsetTimestamp: number;
    latitude: number;
    longitude: number;
  }
  
  export interface RuinsSurroundings {
    name: string;
    id: number | null;
    directionDegree: number;
    direction: string;
    milesAway: number;
    latitude: number;
    longitude: number;
    tags: Record<string, string>;
    windCompass: string;
    windAgreementScore: number;
    windHarmony: boolean;
    streetViewImage: string;
  }

  export interface RawTwinLocation {
    name?: string;
    id: number;
    last_accessed?: string;
    temperature: number;
    description?: string;
    wind_speed: number;
    wind_direction: number;
    humidity: number;
    pressure: number;
    cloudiness: number;
    sunrise_timestamp: number;
    sunset_timestamp: number;
    latitude: number;
    longitude: number;
    country: string;
    city_name: string;
    wind_friends: string;
    special_harmony: boolean;
    details: string;
    experience: string;
    wind_speed_interaction: string;
    pressure_interaction: string;
    humidity_interaction: string;
    stronger_wind_interaction: string;
    expired: boolean;
    home_location: RawHomeLocation;
  }
  

  export interface RawRuinsLocation {
    name?: string;
    id: number;
    origin_location: RawTwinLocation;
    direction_degree: number;
    direction: string;
    miles_away: number;
    latitude: number;
    longitude: number;
    country: string;
    state: string;
    city_name: string;
    tags: Record<string, any>;  // Adjust the type based on the expected format of `tags`
    wind_compass: string;
    wind_agreement_score: number;
    wind_harmony: boolean;
    street_view_image: string;
  }

  
  export interface RawHomeLocation {
    name?: string;
    id?: number | null;
    last_accessed?: string;
    temperature: number;
    description?: string;
    wind_speed: number;
    wind_direction: number;
    humidity: number;
    pressure: number;
    cloudiness: number;
    sunrise_timestamp: number;
    sunset_timestamp: number;
    latitude: number;
    longitude: number;
  }

  
  
  // Define the CurrentSurroundings type
  export interface CurrentSurroundings {
    id: number;
    explore_location?: RawRuinsLocation; // Use RuinsSurroundings for explore_location
    twin_location?: RawTwinLocation;  // Use PortalSurroundings for twin_location
    user: number;
    last_accessed: string;
    is_expired: boolean;
  }
  