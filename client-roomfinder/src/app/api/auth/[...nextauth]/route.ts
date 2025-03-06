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
    recomendacion?: any; // 🔹 Agregamos la recomendación opcionalmente
}

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            id: "credentials",
            credentials: {
                vchemail: { label: "Email", type: "text" },
                vchpassword: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const login = await fetch(`${process.env.REST_URL}/users/login`, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${process.env.REST_SECRET}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(credentials),
                    });

                    if (!login.ok) {
                        const error = await login.json();
                        throw new Error(error.message);
                    }

                    const user = await login.json();

                    // 🔹 Llamar a la API de recomendación después del login
                    try {
                        const recomendacionRes = await fetch(`http://localhost:8080/recommend/${user.usuarioid}`);
                        if (recomendacionRes.ok) {
                            user.recomendacion = await recomendacionRes.json();
                        }
                    } catch (error) {
                        console.error("Error obteniendo recomendación:", error);
                        user.recomendacion = null;
                    }

                    return user;
                } catch (error) {
                    throw new Error(error instanceof Error ? error.message : "Error desconocido");
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
        maxAge: 3600,
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            console.log("Usuario recibido en JWT:", user);
            if (trigger === "update") {
                return { ...token, user: { ...session.user } };
            }
            if (user) token.user = user;
            console.log("Token final en JWT:", token);
            return token;
        },
        async session({ session, token }) {
            if (token.user) {
                session.user = token.user as SessionInterface;
            }
            console.log("✅ Sesión en servidor con recomendación:", session);
            return session;
        },
    },
    events: {
        signOut: async (message) => {
            const sessionid = (message.token?.user as SessionInterface)?.sessionid;
            if (!sessionid) return;
            try {
                await fetch(`${process.env.REST_URL}/users/logout/`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${process.env.REST_SECRET}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ sessionid }),
                });
            } catch (error) {
                console.error("Error al cerrar sesión:", error);
            }
        },
    },
});

export { handler as GET, handler as POST };
