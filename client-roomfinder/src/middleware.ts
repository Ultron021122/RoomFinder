export { default } from "next-auth/middleware";

export const config = {
    matcher: [
        "/arrendadores",
        "/dashboard/:path*",
        "/admin",
        '/message',
    ]
};
