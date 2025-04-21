import FlexBox from '@/components/FlexBox';
import TextBox from '@/components/TextBox';
import MethodButton from '@/components/MethodButton';
import CompleteButton from '@/components/CompleteButton';
import romance from '@/assets/icons/heart/romance.svg';
import happy from '@/assets/icons/heart/happy.svg';
import refresh from '@/assets/icons/heart/refresh.svg';
import sad from '@/assets/icons/heart/sad.svg';
import Modal from '@/components/Modal';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ModalType } from '@/utils/type';
import { postWhite } from '@/apis/postHeart';
import { modalMap } from '@/utils/map';
import Header from '@/components/Header';

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
                await postWhite({
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
                    <div className="text-lg font-medium mb-3">최고의 사랑을 풀어주세요</div>
                    <TextBox
                        height={270}
                        className="rounded-2xl p-4"
                        onChange={(e) => setContent(e.target.value)}
                        maxLength={500}
                    />
                </div>
                <div className="pb-1.5 w-full">
                    <div className="text-lg font-medium mb-3">어떻게 채울까요?</div>
                    <div className="grid grid-cols-2 gap-3.5">
                        <MethodButton
                            description="낭만있게"
                            Heart={romance}
                            isSelected={selectedMethod === 1}
                            onClick={() => setSelectedMethod(1)}
                        />
                        <MethodButton
                            description="유쾌하게"
                            Heart={happy}
                            isSelected={selectedMethod === 2}
                            onClick={() => setSelectedMethod(2)}
                        />
                        <MethodButton
                            description="풋풋하게"
                            Heart={refresh}
                            isSelected={selectedMethod === 3}
                            onClick={() => setSelectedMethod(3)}
                        />
                        <MethodButton
                            description="애절하게"
                            Heart={sad}
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
