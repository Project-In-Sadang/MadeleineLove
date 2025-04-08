import Image from 'next/image';
import FlexBox from '@/components/FlexBox';

interface MenuButtonProps {
    onClick: () => void;
    iconSrc: string; 
    title: string;
}

export default function MenuButton({ onClick, iconSrc, title }: MenuButtonProps) {
    return (
        <button onClick={onClick} className="w-full">
            <FlexBox
                direction="col"
                className="w-full font-medium shadow-[10px_10px_20px_0px_rgba(0,0,0,0.25)]
                 bg-[#eae5ff] rounded-[10px] gap-1 py-4 whitespace-nowrap"
            >
                <Image src={iconSrc} alt="menuicon" width={30} height={30} />
                {title}
            </FlexBox>
        </button>
    );
}
