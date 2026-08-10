import React from 'react';

const CaptainDetails = ({ captain, isOnline, onStatusChange, location, disabled = false }) => {
    const fullName = captain?.fullName
        ? `${captain.fullName.firstName} ${captain.fullName.lastName || ''}`.trim()
        : 'Captain';
    const vehicle = captain?.vehicle;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Driver dashboard</p>
                    <h2 className="truncate text-xl font-bold text-gray-900">{fullName}</h2>
                    <p className="truncate text-sm text-gray-600">
                        {vehicle ? `${vehicle.color} ${vehicle.vehicleType} · ${vehicle.plate}` : 'Vehicle details loading…'}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => onStatusChange(!isOnline)}
                    disabled={disabled}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold text-white transition-colors disabled:cursor-wait disabled:opacity-60 ${isOnline ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-700 hover:bg-gray-800'}`}
                >
                    <i className={`mr-1 ${isOnline ? 'ri-checkbox-circle-line' : 'ri-close-circle-line'}`}></i>
                    {disabled ? 'Saving…' : isOnline ? 'Online' : 'Go online'}
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-2xl bg-gray-100 p-3 text-sm">
                <div>
                    <p className="text-xs text-gray-500">Availability</p>
                    <p className={`font-bold ${isOnline ? 'text-emerald-600' : 'text-gray-700'}`}>{isOnline ? 'Receiving rides worldwide' : 'Offline'}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Live location</p>
                    <p className="font-bold text-gray-800">{location ? 'Sharing' : 'Permission needed'}</p>
                </div>
            </div>
            {!isOnline && <p className="text-xs text-gray-500">Go online to receive matching ride requests in demo mode.</p>}
        </div>
    );
};

export default CaptainDetails;
