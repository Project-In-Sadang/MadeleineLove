import Menu from '@/assets/icons/menu.svg';
import Chevron from '@/assets/icons/chevron.svg';
import FlexBox from '@/components/FlexBox';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
    type: 'main' | 'write' | 'view';
    onWithdraw?: () => void;
    onLogout?: () => void;
    chevronOnClick?: () => void;
}

export default function Header({ type, chevronOnClick, onLogout, onWithdraw }: HeaderProps) {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="z-50 w-full">
            <FlexBox className={`w-full p-10 ${type === 'main' ? 'justify-between' : 'justify-start gap-4'}`}>
                {type !== 'main' && (
                    <Chevron
                        onClick={() => {
                            type === 'write' ? chevronOnClick?.() : router.push('/main');
                        }}
                        className="cursor-pointer w-6 h-6"
                    />
                )}
                <div className="text-3xl text-[#593EC0]">
                    <span className="font-semibold">Mad</span>
                    <span className="font-extralight">ele</span>
                    <span className="font-semibold">in</span>
                    <span className="font-extralight">e</span>
                </div>
                {type === 'main' && (
                    <Menu
                        onClick={() => {
                            setIsMenuOpen((prev) => !prev);
                        }}
                        className="cursor-pointer w-6"
                    />
                )}
            </FlexBox>
            {isMenuOpen && (
                <FlexBox
                    direction="col"
                    className="fixed top-[75px] bg-white right-10 rounded-md p-2.5 gap-2 cursor-pointer"
                >
                    <span onClick={onLogout}>로그아웃</span>
                    <span onClick={onWithdraw}>회원 탈퇴</span>
                </FlexBox>
            )}
        </div>
    );
}
