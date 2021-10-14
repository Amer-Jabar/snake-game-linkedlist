import { useEffect, useState } from 'react';

const useInterval = (callback, delay) => {

    useEffect(() => {}, [delay]);

    useEffect(() => {
        let id = setInterval(() => callback, delay);
        return () => clearInterval(id);
    }, [callback]);


}

export default useInterval;