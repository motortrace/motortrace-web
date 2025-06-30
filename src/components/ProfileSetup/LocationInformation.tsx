import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import "./LocationInformation.scss"

const LocationInformation: React.FC = () => {

    const mapRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const mapInstance = useRef<google.maps.Map | null>(null);
    const markerInstance = useRef<google.maps.Marker | null>(null);
    const geocoder = useRef<google.maps.Geocoder | null>(null);
    const autocomplete = useRef<google.maps.places.Autocomplete | null>(null);
    useEffect(() => {
        if (!mapRef.current || !inputRef.current || !window.google) return;

        const defaultLocation = { lat: 6.9271, lng: 79.8612 }; // Colombo

        mapInstance.current = new google.maps.Map(mapRef.current, {
            center: defaultLocation,
            zoom: 12,
        });

        geocoder.current = new google.maps.Geocoder();

        autocomplete.current = new google.maps.places.Autocomplete(inputRef.current, {
            componentRestrictions: { country: 'LK' },
        });

        // Prevent form submission on Enter key
        inputRef.current.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
            }
        });

        // Geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    mapInstance.current?.setCenter(userLocation);
                    mapInstance.current?.setZoom(15);
                    placeMarker(userLocation);
                    reverseGeocode(userLocation);
                },
                () => console.warn("User denied Geolocation, using default location.")
            );
        }

        // Autocomplete selection
        autocomplete.current.addListener('place_changed', () => {
            const place = autocomplete.current?.getPlace();
            if (place && place.geometry && place.geometry.location) {
                const location = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                };
                mapInstance.current?.setCenter(location);
                mapInstance.current?.setZoom(15);
                placeMarker(location);
            }
        });

        // Click on map to set marker
        mapInstance.current.addListener('click', (event: google.maps.MapMouseEvent) => {
            if (event.latLng) {
                const clickedLocation = {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng(),
                };
                placeMarker(clickedLocation);
                reverseGeocode(clickedLocation);
            }
        });

    }, []);

    const placeMarker = (location: { lat: number; lng: number }) => {
        if (!mapInstance.current) return;

        if (markerInstance.current) {
            markerInstance.current.setMap(null);
        }

        markerInstance.current = new google.maps.Marker({
            position: location,
            map: mapInstance.current,
        });
    };

    const reverseGeocode = (location: { lat: number; lng: number }) => {
        if (!geocoder.current || !inputRef.current) return;

        geocoder.current.geocode({ location }, (results, status) => {
            if (status === "OK" && results && results[0]) {
                inputRef.current!.value = results[0].formatted_address;
            } else {
                console.error("Geocoder failed due to: " + status);
            }
        });
    };

    return (
        <div className="location-info">
            <div className="basic-info__header">
                <MapPin size={24} />
                <h3 className="basic-info__title">
                    Location Information
                </h3>
            </div>
            
            <div id="location-form">
                <label htmlFor="location-input">Enter Location:</label>
                <input
                    type="text"
                    id="location-input"
                    name="eventLocation"
                    placeholder="e.g., Colombo, Sri Lanka"
                    className="w-full border p-2 rounded"
                    ref={inputRef}
                />
            </div>
            <div
                id="map-container"
                ref={mapRef}
                style={{ height: '400px', width: '100%', marginTop: '10px' }}
            ></div>
        </div>
    );
}

export default LocationInformation
