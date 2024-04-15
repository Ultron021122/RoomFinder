export default function VerifyPage({
    params: { token },
}: {
    params: { token: string }
}) {
    if (typeof token !== 'string') {
        return <div>Error: Token must be a string!</div>
    }

    const uuidv4Pattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

    if (!uuidv4Pattern.test(token)) {
        return <div>Error: Invalid token format!</div>;
    }

    return (
        <div>
            <h1>Verifying...</h1>
            <p>Token: {token}</p>
        </div>
    )
}