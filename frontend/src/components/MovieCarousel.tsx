import { useState, useEffect } from 'react';
import Image from 'next/image';
import one_movie from '@/assets/images/one_movie.png';
import two_movie from '@/assets/images/two_movie.png';
import three_movie from '@/assets/images/three_movie.png';
import FlexBox from '@/components/FlexBox';

export default function MovieCarousel() {
    const images = [one_movie, two_movie, three_movie];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <FlexBox className="justify-center fixed mb-[50px]">
            <span className="text-white font-semibold text-2xl mb-[350px]">Recommended Movie</span>
            {images.map((image, index) => {
                const position = (index - currentIndex + images.length) % images.length;
                return (
                    <div
                        key={index}
                        className="fixed duration-500 transition-transform"
                        style={{
                            transform: `translateX(${(position - 1) * 50}%)`,
                            zIndex: position === 1 ? 20 : 10,
                        }}
                    >
                        <Image
                            src={image}
                            alt="movieimage"
                            className={`rounded-lg ${position === 1 ? 'w-[180px]' : 'w-[160px] opacity-50'}`}
                        />
                    </div>
                );
            })}
        </FlexBox>
    );
}
