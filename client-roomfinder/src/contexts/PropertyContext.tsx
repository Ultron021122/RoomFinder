import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Properties, PropertyType, UserProfile } from '@/utils/interfaces';
import { useSession } from 'next-auth/react';

interface PropertyContextProps {
  properties: Properties[];
  propertyTypes: PropertyType[];
  isLoading: boolean;
  error: string | null;
  refetchProperties: () => void;
  refetchPropertyTypes: () => void;
}

const PropertyContext = createContext<PropertyContextProps | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useSession();
  const userProfileData = session?.user as UserProfile;
  const [properties, setProperties] = useState<Properties[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    if (!userProfileData?.usuarioid) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/properties/owner/${userProfileData.usuarioid}`);
      setProperties(response.data.data);
    } catch (error: any) {
      setError(error.response?.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPropertyTypes = async () => {
    setError(null);
    try {
      const response = await axios.get(`/api/typeproperty`);
      setPropertyTypes(response.data.data);
    } catch (error: any) {
      setError(error.response?.data.message);
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchPropertyTypes();
  }, [userProfileData]);

  return (
    <PropertyContext.Provider
      value={{
        properties,
        propertyTypes,
        isLoading,
        error,
        refetchProperties: fetchProperties,
        refetchPropertyTypes: fetchPropertyTypes,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const usePropertyContext = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('usePropertyContext must be used within a PropertyProvider');
  }
  return context;
};