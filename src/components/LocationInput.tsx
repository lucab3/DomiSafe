'use client';

import { useState } from 'react';
import AutocompleteInput from './AutocompleteInput';
import { PlaceSuggestion } from '@/utils/googleMaps';

interface LocationInputProps {
  onLocationSelect?: (location: { address: string; lat: number; lng: number }) => void;
  placeholder?: string;
  className?: string;
}

export default function LocationInput({ 
  onLocationSelect, 
  placeholder = "Buscar dirección...",
  className = ""
}: LocationInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handlePlaceSelect = (place: PlaceSuggestion, coordinates: { lat: number; lng: number }) => {
    if (onLocationSelect) {
      onLocationSelect({
        address: place.description,
        lat: coordinates.lat,
        lng: coordinates.lng
      });
    }
  };

  return (
    <AutocompleteInput
      value={inputValue}
      onChange={setInputValue}
      onPlaceSelect={handlePlaceSelect}
      placeholder={placeholder}
      className={className}
    />
  );
}