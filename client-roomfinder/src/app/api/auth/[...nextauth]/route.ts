import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface SessionInterface {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    usuarioid: number;
    vchname: string;
    vchpaternalsurname: string;
    vchmaternalsurname: string;
    vchemail: string;
    vchpassword: string;
    dtbirthdate: string;
    bnstatus: boolean;
    vchimage: string;
    roleid: number;
    created_at: string;
    sessionid: number;
}

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            id: "credentials",
            credentials: {
                vchemail: { label: "Email", type: "text", placeholder: "jsmith" },
                vchpassword: { label: "Password", type: "password" }
                // ,recaptchaToken: { label: "reCAPTCHA", type: "text" }
            },
            async authorize(credentials) {
                try {
                    // const recaptcha = credentials?.recaptchaToken;
                    // console.log(recaptcha)
                    // const captchaRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
                    //     method: "POST",
                    //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    //     body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptcha}`
                    // });

                    // const data = await captchaRes.json();
                    // if (!data.success || data.score < 0.5) {
                    //     throw new Error("reCAPTCHA fallido. Inténtalo de nuevo.");
                    // }

                    const login = await fetch(`${process.env.REST_URL}/users/login`, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${process.env.REST_SECRET}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(credentials),
                    })
                    if (login.status === 401 || login.status === 403 || login.status === 404) {
                        const error = await login.json();
                        throw new Error(error.message);
                    };
                    if (login.ok === false) {
                        throw new Error("Internal Server Error");
                    }
                    return login.json();
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
        async jwt({ token, user, trigger, session }) {
            if (trigger === "update") {
                return { ...token, user: { ...session.user } };
            }
            if (user) {
                token.user = user;
                token.role = (user as any).roleid;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token.user as SessionInterface;
            return session;
        },
    },
    events: {
        signOut: async (message) => {
            const sessionid = message.token?.user as SessionInterface;
            try {
                await fetch(`${process.env.REST_URL}/users/logout/`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${process.env.REST_SECRET}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ sessionid: sessionid.sessionid }),
                });
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message);
                } else {
                    throw new Error("Algo salió mal. Por favor, inténtelo de nuevo");
                }
            }
        },
    },
});

export { handler as GET, handler as POST };
