import React from 'react';
import 'remixicon/fonts/remixicon.css';

const LocationSearchPanel = ({ suggestions = [], onSelectSuggestion, loading = false }) => {
    return (
        <div className="p-3 overflow-y-auto max-h-full">
            {loading && (
                <div className="flex items-center justify-center p-4 text-gray-500 gap-2">
                    <i className="ri-loader-4-line animate-spin text-xl"></i>
                    <span>Searching locations...</span>
                </div>
            )}

            {!loading && suggestions.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                    <p className="text-sm">Type an address above to search locations.</p>
                </div>
            )}

            {!loading && suggestions.map((elem, idx) => {
                const addressText = typeof elem === 'string' ? elem : elem.address;
                const placeName = typeof elem === 'string' ? null : elem.name;
                const placeType = typeof elem === 'string' ? null : elem.type;
                return (
                    <div
                        onClick={() => onSelectSuggestion(elem)}
                        key={idx}
                        className="flex justify-start items-center cursor-pointer hover:bg-gray-100 active:border border-black rounded-2xl gap-3 p-3 mx-1 mb-2 transition-colors"
                    >
                        <h2 className="px-3 py-2 text-xl bg-gray-200 rounded-full text-black flex items-center justify-center">
                            <i className="ri-map-pin-line"></i>
                        </h2>
                        <div className="min-w-0">
                            {placeName && <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">{placeName}</h4>}
                            <p className="text-xs text-gray-600 line-clamp-2">{addressText}</p>
                            {placeType && <span className="text-[10px] uppercase tracking-wide text-blue-600">{placeType}</span>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default LocationSearchPanel;
