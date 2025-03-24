import FlexBox from '@/components/layout/FlexBox';
import letter from '@/public/icon/heart/letter.svg';
import Image from 'next/image';
import WelcomeButton from '@/components/button/WelcomeButton';
import naver from '@/public/icon/naver.svg';
import kakao from '@/public/icon/kakao.svg';
import first_all from '@/public/icon/heart/first_all.svg';
import google from '@/public/icon/google.svg';
import { useRouter } from 'next/navigation';
import { redirectToSocial } from '@/api/social';

export default function Welcome() {
    const router = useRouter();
    return (
        <FlexBox direction="col" className="justify-center w-full h-screen gap-7">
            <Image src={letter} alt="welcomeheart" width={150} height={150} />
            <div className="text-4xl text-center text-[#593EC0]">
                <span className="font-semibold">Mad</span>
                <span className="font-extralight">ele</span>
                <span className="font-semibold">in</span>
                <span className="font-extralight">e</span>
                <br />
                <span className="font-semibold">Story</span>
            </div>
            <FlexBox direction="col" className="gap-4 pt-6 w-full px-[65px]">
                <WelcomeButton
                    iconSrc={google}
                    description="Google Login"
                    iconSz={19}
                    onClick={() => redirectToSocial('google')}
                />
                <WelcomeButton
                    iconSrc={kakao}
                    description={'카카오 로그인'}
                    iconSz={23}
                    onClick={() => redirectToSocial('kakao')}
                />
                <WelcomeButton
                    iconSrc={naver}
                    description={'네이버 로그인'}
                    iconSz={17}
                    onClick={() => redirectToSocial('naver')}
                />
                <WelcomeButton
                    iconSrc={first_all}
                    description={'하트 구경하기'}
                    className="bg-[#866BDE] text-white"
                    onClick={() => {
                        router.push('/main');
                    }}
                    iconSz={28}
                />
            </FlexBox>
        </FlexBox>
    );
}
