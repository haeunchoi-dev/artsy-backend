import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

class MailSender {
  private service: string = 'gmail';
  private fromEmail: string;
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    const senderEmail = process.env.MAIL_SENDER_EMAIL;
    const senderPassword = process.env.MAIL_SENDER_PASSWORD;

    if (senderEmail === undefined || senderPassword === undefined) {
      throw new Error('mail sender info undefined');
    }

    this.fromEmail = senderEmail;
    this.transporter = nodemailer.createTransport({
      service: this.service,
      auth: {
        user: senderEmail,
        pass: senderPassword
      }
    });
  }

  private send(toEmail: string, subject: string, text: string) {
    const mailOptions = {
      from: this.fromEmail,
      // TODO
      //to: toEmail,
      to: 'qpow1018@gmail.com',
      subject: subject,
      text: text
    };

    this.transporter.sendMail(mailOptions);
  }

  public sendTempPassword(toEmail: string, password: string) {
    const subject = 'Artsy 임시 비밀번호입니다.';
    const text = `임시 비밀번호는 ${password} 입니다. 로그인 후 비밀번호를 변경해주세요.`;
    this.send(toEmail, subject, text);
  }
}

const _inst = new MailSender();
export default _inst;