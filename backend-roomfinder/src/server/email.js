import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
        user: 'admin@roomfinder.website',
        pass: 'Chente2305102*',
    }
});

// async function sendEmail(email, token) {
//     const info = await transporter.sendMail({
//         from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
//         to: "bar@example.com, baz@example.com", // list of receivers
//         subject: "Hello ✔", // Subject line
//         text: "Hello world?", // plain text body
//         html: "<b>Hello world?</b>", // html body
//     });
//     console.log('Message sent: %s', info.messageId);
// }

async function main() {
    const info = await transporter.sendMail({
        from: '"Sebastián Martínez López 👻" <admin@roomfinder.website>',
        to: 'marvelsml25@gmail.com, smldeveloper02@gmail.com',
        subject: 'Hello ✔',
        text: 'Hello world?',
        html: '<b>Hello world?</b>',
    });
    console.log('Message sent: %s', info.messageId);
}

main().catch(console.error);