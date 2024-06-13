import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            id: "credentials",
            credentials: {
                vchemail: { label: "Email", type: "text", placeholder: "jsmith" },
                vchpassword: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const userFound = await fetch(`${process.env.REST_URL}/users/login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(credentials),
                    })

                    if (userFound.status === 400) {
                        const error = await userFound.json();
                        throw new Error(error?.message);
                    };
                    if (userFound.status === 401) {
                        throw new Error("Credenciales incorrectas. Por favor, inténtelo de nuevo.");
                    }
                    return userFound.json();
                } catch (error) {
                    if (error instanceof Error) {
                        throw new Error(error.message);
                    } else {
                        throw new Error("Algo salió mal. Por favor, inténtelo de nuevo");
                    }
                }
            },
        }),
    ],
    pages: {
        signIn: "/users/login",
        signOut: "/",
    },
    session: {
        strategy: "jwt",
        maxAge: 3600, // 1 hour (in seconds)
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.user = user;
            return token;
        },
        async session({ session, token }) {
            session.user = token.user as any;
            return session;
        },
    },
});

export { handler as GET, handler as POST };
