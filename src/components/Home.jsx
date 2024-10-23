import ImageExample from '../assets/image-6.jpg';
import SelectImageArea from './libaryGoogleLens/SelectImageArea';
import SkeletonLoader from './SkeletonScan';
import CircleSearch from '../components/Circle to search/CircleSearch';
import { useEffect, useState } from 'react';

const HomePage = () => {
    const [scrolltop, setScrolltop] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.pageYOffset;
            setScrolltop(scrollY);
        };

   
        window.addEventListener('scroll', handleScroll);

      
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    useEffect(() => {
        // const windowWidth = document.documentElement.scrollWidth;
        // const windowHeight = document.documentElement.scrollHeight;
        // console.log("Ukuran halaman:");
        // console.log("Lebar:", windowWidth, "px");
        // console.log("Tinggi:", windowHeight, "px");
    }, [scrolltop]);

    return (
        <div>
            <CircleSearch>
                <SelectImageArea />
                <SkeletonLoader />
                <div>
                    <img src={ImageExample} alt="" />
                </div>
                <div>
                    <img src={ImageExample} alt="" />
                </div>
                <div>
                    <h1>Apakah ini dapat</h1>
                    <img src={ImageExample} alt="" />
                </div>


            </CircleSearch>
        </div>
    );
};

export default HomePage;
