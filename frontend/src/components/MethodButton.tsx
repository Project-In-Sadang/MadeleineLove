import Image from 'next/image';
import FlexBox from '@/components/FlexBox';

interface MethodButtonProps {
    heartSrc: string;
    description: string;
    isSelected: boolean;
    onClick: () => void;
}

export default function MethodButton({ heartSrc, description, isSelected, onClick }: MethodButtonProps) {
    return (
        <button onClick={onClick} className="w-full">
            <FlexBox
                className={`text-lg justify-center font-medium py-4 gap-3
            shadow-[-3px_-3px_15px_#62467d_inset,-5px_-5px_7px_rgba(0,_0,_0,_0.15)_inset]
            ${isSelected ? 'bg-[#D2CDE9]' : 'bg-white'} rounded-xl
            transition-colors duration-300`}
            >
                <Image src={heartSrc} alt={'heart'} width={30} height={30} />
                {description}
            </FlexBox>
        </button>
    );
}
