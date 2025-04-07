import FlexBox from '@/components/FlexBox';
import Image from 'next/image';

interface WelcomeProps {
    iconSrc: string;
    description: string;
    className?: string;
    iconSz: number;
    onClick: () => void;
}

export default function WelcomeButton({
    iconSrc,
    className = 'bg-white text-black',
    onClick,
    description,
    iconSz,
}: WelcomeProps) {
    return (
        <button onClick={onClick} className="w-full">
            <FlexBox
                className={`py-3.5 w-full gap-4 justify-center items-center
                    text-base rounded-md font-semibold
                    ${className}`}
            >
                <Image src={iconSrc} alt="welcomeicon" width={iconSz} height={iconSz} />
                {description}
            </FlexBox>
        </button>
    );
}
