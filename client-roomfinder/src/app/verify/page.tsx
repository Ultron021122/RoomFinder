import { patterns } from '@/utils/constants';
import router from 'next/router';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verificación',
};

export default function VerifyPage({ searchParams }: { searchParams: { [token: string]: string } }) {
    const { token } = searchParams;
    if (!patterns.uuidv4.test(token)) {
        return <div>Error: Invalid token format!</div>;
    }

    return (
        <div>
            <h1>Verifying...</h1>
            <p>Token: {token}</p>
        </div>
    )
}