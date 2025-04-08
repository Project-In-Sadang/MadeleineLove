import FlexBox from '@/components/FlexBox';
import empty from '@/assets/icons/heart/empty.svg';
import fill from '@/assets/icons/heart/fill.svg';
import two_all from '@/assets/icons/heart/two_all.svg';
import my from '@/assets/icons/heart/my.svg';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import { saveTokenFromUrl } from '@/apis/social';
import { withdrawSocial, logoutSocial } from '@/apis/social';
import Header from '@/components/Header';
import MenuButton from '@/components/MenuButton';
import MovieCarousel from '@/components/MovieCarousel';

export default function Main() {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [modalState, setModalState] = useState<'withdraw' | 'logout'>('withdraw');

    const menuData = [
        {
            iconSrc: empty,
            title: '비우기',
            onClick: () => router.push('/black'),
        },
        {
            iconSrc: fill,
            title: '채우기',
            onClick: () => router.push('/white'),
        },
        {
            iconSrc: two_all,
            title: '모든 하트',
            onClick: () => router.push('/allHeart'),
        },
        {
            iconSrc: my,
            title: '내 하트',
            onClick: () => router.push('/myHeart'),
        },
    ];

    const getModalContent = () => {
        const contentMap = {
            logout: '로그아웃하시겠습니까?',
            withdraw: '탈퇴하시겠습니까?',
        };
        return contentMap[modalState];
    };

    const handleOpenModal = (type: 'withdraw' | 'logout') => {
        setModalState(type);
        setShowModal(true);
    };

    useEffect(() => {
        saveTokenFromUrl();
    }, []);

    return (
        <FlexBox direction="col" className="justify-center h-screen w-full">
            <Header
                type="main"
                onLogout={() => handleOpenModal('logout')}
                onWithdraw={() => handleOpenModal('withdraw')}
            />
            <MovieCarousel />
            <FlexBox className="w-full px-10 h-full items-end pb-[60px] gap-3.5">
                {menuData.map((item, index) => (
                    <MenuButton key={index} iconSrc={item.iconSrc} title={item.title} onClick={item.onClick} />
                ))}
            </FlexBox>
            {showModal && (
                <Modal
                    description={getModalContent()}
                    onClose={() => {
                        setShowModal(false);
                    }}
                    onConfirm={() => {
                        modalState === 'logout' ? logoutSocial() : withdrawSocial();
                        router.push('/');
                    }}
                />
            )}
        </FlexBox>
    );
}
