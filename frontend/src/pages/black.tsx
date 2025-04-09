import FlexBox from '@/components/FlexBox';
import TextBox from '@/components/TextBox';
import MethodButton from '@/components/MethodButton';
import CompleteButton from '@/components/CompleteButton';
import fly from '@/assets/icons/heart/fly.svg';
import eat from '@/assets/icons/heart/eat.svg';
import burn from '@/assets/icons/heart/burn.svg';
import melt from '@/assets/icons/heart/melt.svg';
import Modal from '@/components/Modal';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { ModalType } from '@/utils/type';
import { postBlack } from '@/apis/postHeart';
import { modalMap } from '@/utils/map';

export default function Black() {
    const router = useRouter();
    const [selectedMethod, setSelectedMethod] = useState<number | null>(null);
    const [content, setContent] = useState<string>('');
    const [nickname, setNickname] = useState<string>('레니');
    const [showModal, setShowModal] = useState(false);
    const [modalState, setModalState] = useState<ModalType>('cancelWrite');

    const handleChevron = () => {
        if (content !== '') {
            setModalState('cancelWrite');
            setShowModal(true);
        } else {
            router.push('/main');
        }
    };

    const handleComplete = () => {
        if (content === '') {
            setModalState('emptyContent');
        } else if (selectedMethod === null) {
            setModalState('emptyMethod');
        } else {
            setModalState('confirmWrite');
        }
        setShowModal(true);
    };

    const handleConfirm = async () => {
        if (modalState === 'cancelWrite') {
            router.push('/main');
        } else {
            try {
                await postBlack({
                    nickName: nickname,
                    content: content,
                    methodNumber: selectedMethod || 0,
                });
                router.push('/allHeart');
            } catch (error) {
                alert('문제가 발생했어요. 다시 시도해주세요.');
            }
        }
    };

    return (
        <div className="min-h-screen">
            <Header type="write" chevronOnClick={handleChevron} />
            <FlexBox direction="col" className="px-10 pb-10 gap-7">
                <div className="w-full">
                    <div className="text-lg font-medium mb-3">닉네임을 적어주세요 (선택)</div>
                    <TextBox
                        height={40}
                        className="rounded-3xl px-4 py-2"
                        placeholder="레니"
                        onChange={(e) => setNickname(e.target.value)}
                        maxLength={12}
                        type="nickname"
                    />
                </div>
                <div className="w-full">
                    <div className="text-lg font-medium mb-3">최악의 사랑을 풀어주세요</div>
                    <TextBox
                        height={270}
                        className="rounded-2xl p-4"
                        onChange={(e) => setContent(e.target.value)}
                        maxLength={500}
                    />
                </div>
                <div className="pb-1.5 w-full">
                    <div className="text-lg font-medium mb-3">어떻게 비워낼까요?</div>
                    <div className="grid grid-cols-2 gap-3.5">
                        <MethodButton
                            description="녹여서"
                            heartSrc={melt}
                            isSelected={selectedMethod === 1}
                            onClick={() => setSelectedMethod(1)}
                        />
                        <MethodButton
                            description="날려서"
                            heartSrc={fly}
                            isSelected={selectedMethod === 2}
                            onClick={() => setSelectedMethod(2)}
                        />
                        <MethodButton
                            description="태워서"
                            heartSrc={burn}
                            isSelected={selectedMethod === 3}
                            onClick={() => setSelectedMethod(3)}
                        />
                        <MethodButton
                            description="먹어서"
                            heartSrc={eat}
                            isSelected={selectedMethod === 4}
                            onClick={() => setSelectedMethod(4)}
                        />
                    </div>
                </div>
                <CompleteButton onClick={handleComplete} />
            </FlexBox>
            {showModal && (
                <Modal
                    description={modalMap[modalState].content}
                    buttonCount={modalMap[modalState].buttonCount}
                    onConfirm={handleConfirm}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}
