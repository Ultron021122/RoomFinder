import { patterns } from '@/utils/constants';
import router from 'next/router';
import { Metadata } from 'next';
import VerifyComponent from '@/components/Users/verify';

export const metadata: Metadata = {
  title: 'Verificación',
};

export default function VerifyPage({ searchParams }: { searchParams: { [token: string]: string } }) {
    const { token } = searchParams;
    const tokenValue = token ? token : '';

    return (
        <>
            <VerifyComponent token={tokenValue} />
        </>
    )
}