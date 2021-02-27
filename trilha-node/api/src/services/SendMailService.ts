import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer, { Transporter } from 'nodemailer';

class SendMailService {
  private client: Transporter;

  async createClient() {
    const account = await nodemailer.createTestAccount();
    this.client = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });
  }

  async execute(to: string, subject: string, variables: object, filePath: string) {
    if (!this.client) {
      await this.createClient();
    }

    const fileContent = fs.readFileSync(filePath).toString('utf-8');

    const mailTemplateParse = handlebars.compile(fileContent);

    const html = mailTemplateParse(variables);

    const message = await this.client.sendMail({
      to,
      subject,
      html,
      from: 'NPS <noreply@nps.com.br',
    });

    return nodemailer.getTestMessageUrl(message);
  }
}

export default new SendMailService();
