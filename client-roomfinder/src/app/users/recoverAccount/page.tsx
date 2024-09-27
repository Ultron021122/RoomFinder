import RecoverComponent from '@/components/Users/recoverAccount';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Recuperación de cuenta',
};

export default function RecoverAccount() {
    return (
        <>
            <RecoverComponent />
        </>
    )
}


/*
export default function RecoverAccount({ searchParams }: { searchParams: { [token: string]: string } }) {
    const { token } = searchParams;
    const tokenValue = token ? token : '';

    return (
        <>
            <RecoverComponent token={tokenValue} />
        </>
    )
}
    */