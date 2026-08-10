import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';

// Create custom SVG markers
const createCustomIcon = (color, iconClass = 'ri-map-pin-fill') => {
    return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
            <div style="
                background-color: ${color};
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 20px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                border: 2px solid white;
            ">
                <i class="${iconClass}"></i>
            </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
    });
};

const pickupIcon = createCustomIcon('#22c55e', 'ri-map-pin-user-fill'); // Green pin
const destinationIcon = createCustomIcon('#ef4444', 'ri-flag-fill'); // Red flag
const captainIcon = createCustomIcon('#000000', 'ri-car-fill'); // Black car icon

// Component to handle automatic bounds fitting
const MapController = ({ pickup, destination, captain, geometry }) => {
    const map = useMap();

    useEffect(() => {
        const bounds = [];
        if (pickup?.lat && pickup?.lng) bounds.push([pickup.lat, pickup.lng]);
        if (destination?.lat && destination?.lng) bounds.push([destination.lat, destination.lng]);
        if (captain?.lat && captain?.lng) bounds.push([captain.lat, captain.lng]);

        if (bounds.length > 1) {
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
        } else if (bounds.length === 1) {
            map.setView(bounds[0], 15);
        }
    }, [map, pickup, destination, captain, geometry]);

    return null;
};

const LiveMap = ({
    pickupCoords,
    destinationCoords,
    captainCoords,
    routeGeometry,
    className = 'h-full w-full',
    center = [28.6139, 77.2090], // Default center (Delhi, India)
    zoom = 13
}) => {
    // Determine effective center if markers exist
    const defaultCenter = pickupCoords?.lat ? [pickupCoords.lat, pickupCoords.lng] : center;

    return (
        <div className={`relative ${className}`}>
            <MapContainer
                center={defaultCenter}
                zoom={zoom}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {pickupCoords?.lat && (
                    <Marker position={[pickupCoords.lat, pickupCoords.lng]} icon={pickupIcon}>
                        <Popup>Pickup: {pickupCoords.address || 'Pickup Location'}</Popup>
                    </Marker>
                )}

                {destinationCoords?.lat && (
                    <Marker position={[destinationCoords.lat, destinationCoords.lng]} icon={destinationIcon}>
                        <Popup>Destination: {destinationCoords.address || 'Destination Location'}</Popup>
                    </Marker>
                )}

                {captainCoords?.lat && (
                    <Marker position={[captainCoords.lat, captainCoords.lng]} icon={captainIcon}>
                        <Popup>Captain Live Location</Popup>
                    </Marker>
                )}

                {routeGeometry && (
                    <GeoJSON
                        key={JSON.stringify(routeGeometry)}
                        data={routeGeometry}
                        style={{
                            color: '#2563eb',
                            weight: 5,
                            opacity: 0.8
                        }}
                    />
                )}

                <MapController
                    pickup={pickupCoords}
                    destination={destinationCoords}
                    captain={captainCoords}
                    geometry={routeGeometry}
                />
            </MapContainer>
        </div>
    );
};

export default LiveMap;
