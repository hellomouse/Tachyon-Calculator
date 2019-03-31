'use strict';

let arr = [
    {
        'name': 'Sun',
        'distanceMin': '0',
        'distanceMax': '0',
        'mass': '1.989 x 1030 kg',
        'surfaceTemp': '5778 K',
        'volume': '1.41e18 km^3',
        'symbol': '☉'
    },
    {
        'name': 'Mercury',
        'distanceMin': ' 46,001,200 km',
        'distanceMax': '69,816,900 km',
        'mass': '3.3011e23 kg',
        'surfaceTemp': '440 K',
        'volume': '6.083e10 km^3',
        'symbol': '☿'
    },
    {
        'name': 'Venus',
        'distanceMin': '107,477,000 km',
        'distanceMax': '108,939,000 km',
        'mass': '4.8675e24 kg',
        'surfaceTemp': '737 K',
        'volume': '9.2843e11 km^3',
        'symbol': '♀︎'
    },
    {
        'name': 'Earth',
        'distanceMin': '147,095,000 km',
        'distanceMax': '152,100,000 km',
        'mass': '5.97237e24 kg',
        'surfaceTemp': '288 K',
        'volume': '1.08321e12 km^3',
        'symbol': '⊕'
    },
    {
        'name': 'Mars',
        'distanceMin': '206,669,000 km',
        'distanceMax': '249,209,300 km',
        'mass': '6.4171e23 kg',
        'surfaceTemp': '208 K',
        'volume': '1.6318e11 km^3',
        'symbol': '♂︎'
    },
    {
        'name': 'Jupiter',
        'distanceMin': '740,573,600 km',
        'distanceMax': '816,520,800 km',
        'mass': '1.8986e2⁷ kg',
        'surfaceTemp': '163 K',
        'volume': '1.43128e15 km^3',
        'symbol': '♃'
    },
    {
        'name': 'Saturn',
        'distanceMin': '1,353,572,956 km',
        'distanceMax': '1,513,325,783 km',
        'mass': '5.6846e2⁶ kg',
        'surfaceTemp': '133 K',
        'volume': '8.2713e14 km^3',
        'symbol': '♄'
    },
    {
        'name': 'Uranus',
        'distanceMin': '2,748,938,461 km',
        'distanceMax': '3,004,419,704 km',
        'mass': '8.68e25 kg',
        'surfaceTemp': '78 K',
        'volume': '6.833e13 km^3',
        'symbol': '♅'
    },
    {
        'name': 'Neptune',
        'distanceMin': '4,452,940,833 km',
        'distanceMax': '4,553,946,490 km',
        'mass': '1.0243e2⁶ kg',
        'surfaceTemp': '73 K',
        'volume': '6.254e13 km^3',
        'symbol': '♆'
    },
    {
        'name': 'Pluto',
        'distanceMin': '4.436774e9 km',
        'distanceMax': '7.37593e9 km',
        'mass': '1.303e22 kg',
        'surfaceTemp': '44 K',
        'volume': '7.057e9 km^3',
        'symbol': '♇'
    }
];
arr.forEach(x => x.meanDistance = (+x.distanceMin.replace('km', '').replace(/,/g, '') 
    + +x.distanceMax.replace('km', '').replace(/,/g, '')) / 2 + ' km');
module.exports = arr;