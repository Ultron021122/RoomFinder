import { Metadata } from 'next';
import VerifyComponent from '@/components/Users/verify';

export const metadata: Metadata = {
  title: 'Verificación',
};

export default function VerifyPage({ searchParams }: { searchParams: { [token: string]: string } }) {
    const { ui, token } = searchParams;
    const usuarioidValue = ui ? ui : '';
    const tokenValue = token ? token : '';
    return (
        <>
            <VerifyComponent usuarioid={parseInt(usuarioidValue, 10)} token={tokenValue} />
        </>
    )
}