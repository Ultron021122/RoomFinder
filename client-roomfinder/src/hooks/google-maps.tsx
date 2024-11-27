// components/GoogleMapsScript.tsx
'use client';
import { useEffect } from 'react';

interface GoogleMapsScriptProps {
  apiKey: string;
  onLoaded?: () => void;
}

const GoogleMapsScript: React.FC<GoogleMapsScriptProps> = ({ apiKey, onLoaded }) => {
  useEffect(() => {
    // Cargar el script de Google Maps solo si no ha sido cargado
    if (typeof window !== 'undefined' && !window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&async=true`;
      script.async = true;
      script.onload = () => {
        console.log('Google Maps script loaded successfully.');
        if (onLoaded) {
          onLoaded(); // Llamamos al callback cuando la API se haya cargado
        }
      };
      script.onerror = (e) => {
        console.error('Error loading Google Maps script:', e);
      };
      document.head.appendChild(script);
    }
  }, [apiKey, onLoaded]); // Reejecutar si el API key cambia

  return null;
};

export default GoogleMapsScript;
