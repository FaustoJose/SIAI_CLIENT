import React, { useEffect, useState } from 'react';
import { API_URL } from '../URL';
import axios from 'axios';

const ImageComponent01 = ({ endPointName,imgName }) => {
    const [imgSrc, setImgSrc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const endPoint = endPointName;
    const apiUrl = API_URL;

    useEffect(() => {
        const fetchImg = async () => {
            try {
                const response = await fetch(`${apiUrl}${endPoint}${imgName}`)
                const blob = await response.blob();
                const imgSrc = URL.createObjectURL(blob);
                setImgSrc(imgSrc);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        if (imgName) {
            fetchImg();
        }
    }, [imgName]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading image</div>;

    return (
        <div className='text-center'>
            <img src={imgSrc} alt={imgName} style={{
            borderRadius: '250px',
            width: '100%',
            maxWidth: '50%',
            height: '100%',
          }} />
        </div>
    );
};

export default ImageComponent01;