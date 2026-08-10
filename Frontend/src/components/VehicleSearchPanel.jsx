import React from 'react';

const VehicleSearchPanel = ({ setvehiclePanel, setconfirmRidePanel, fares = {}, selectVehicle }) => {
    const vehicles = [
        {
            type: 'car',
            name: 'UberGo',
            capacity: 4,
            eta: '2 mins away',
            desc: 'Affordable, compact ride',
            fare: fares.car || 193,
            img: 'https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8yOWZiYjhiMC03NWIxLTRlMmEtODUzMy0zYTM2NGU3MDQyZmEucG5n'
        },
        {
            type: 'motorcycle',
            name: 'Moto',
            capacity: 1,
            eta: '3 mins away',
            desc: 'Affordable, moto ride',
            fare: fares.motorcycle || 65,
            img: 'https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=552/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy9lZjA5NThiZC1kNDMwLTQ1ZWYtYmU2Yi0zYmZiY2JmMDYyZjYucG5n'
        },
        {
            type: 'auto',
            name: 'UberAuto',
            capacity: 2,
            eta: '5 mins away',
            desc: 'Affordable, Indian ride',
            fare: fares.auto || 118,
            img: 'https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=0/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy80ZTcxOGQ1Yy1lNDMxLTU5YzUtYWNiNS1hYzQwYzI2YzI0ZGYud2VicA=='
        }
    ];

    return (
        <div>
            <h5
                onClick={() => {
                    setvehiclePanel(false);
                }}
                className="text-center text-3xl cursor-pointer"
            >
                <i className="ri-arrow-down-wide-line"></i>
            </h5>
            <h3 className="text-2xl px-3 font-semibold mb-3">Choose a vehicle</h3>

            {vehicles.map((v) => (
                <div
                    key={v.type}
                    onClick={() => {
                        if (selectVehicle) selectVehicle(v.type);
                        setconfirmRidePanel(true);
                        setvehiclePanel(false);
                    }}
                    className="flex justify-between items-center border hover:border-black active:border-black bg-gray-100 rounded-xl px-3 mx-1 my-3 py-3 cursor-pointer transition-all"
                >
                    <img className="h-14 w-20 object-contain" src={v.img} alt={v.name} />
                    <div className="w-1/2 ml-2">
                        <h4 className="font-medium text-base flex items-center gap-2">
                            {v.name}{' '}
                            <span className="text-xs text-gray-600 flex items-center gap-0.5">
                                <i className="ri-user-3-fill"></i>
                                {v.capacity}
                            </span>
                        </h4>
                        <h5 className="font-medium text-xs text-green-600">{v.eta}</h5>
                        <p className="font-normal text-gray-500 text-xs">{v.desc}</p>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">₹{v.fare}</h2>
                </div>
            ))}
        </div>
    );
};

export default VehicleSearchPanel;