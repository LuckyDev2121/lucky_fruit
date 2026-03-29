import React, { useEffect, useState } from 'react';
import { type CoinResponse, getCoinIcon } from '../api/gameCoinApi';

const CoinIcon: React.FC = () => {
    const [data, setData] = useState<CoinResponse | null>(null);

    useEffect(() => {
        const fetchCoinIcon = async () => {
            try {
                const res = await getCoinIcon();
                setData(res);
            } catch (error) {
                console.error("Error fetching coin icon:", error);
            };
        }
        fetchCoinIcon();
    }, []);

    const CoinUrl = data?.icon
        ? `https://Funint.site${data.icon}`
        : null;

    return (
        <>
            {CoinUrl && (
                <img src={CoinUrl} alt="Coin Icon" className='CL' />
            )}
        </>
    );
};

export default CoinIcon;