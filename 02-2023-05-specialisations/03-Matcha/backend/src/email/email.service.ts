import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Mustache from 'mustache';
import * as nodemailer from 'nodemailer';
import { UserService } from '$user/user.service';
import * as fs from 'fs';
import { TokenService } from '$token/token.service';

@Injectable()
export class EmailService {
	private static instance: nodemailer.Transporter = undefined;

	constructor(private readonly configService: ConfigService) {
		if (EmailService.instance == undefined) {
			EmailService.instance = nodemailer.createTransport({
				service: this.configService.get('mail.service'),
				auth: {
					user: this.configService.get('mail.email'),
					pass: this.configService.get('mail.password'),
				},
			});
		}
	}

	private loadTemplate(name: string): string {
		return fs
			.readFileSync(process.cwd() + `/template/${name}.mustache`)
			.toString();
	}

	private checkSendTemplate(user: UserService, token: TokenService): void {
		if (!(user instanceof UserService) || !(token instanceof TokenService))
			throw new Error('User of Token is not valid');
	}

	async sendWelcomeMail(
		user: UserService,
		token: TokenService,
	): Promise<void> {
		this.checkSendTemplate(user, token);
		if (token.getReason() != 'validEmail') throw new Error('Bad Reason');
		const options = {
			subject: 'Welcome to matcha',
			username: user.getUsername(),
			websiteName: 'Matcha',
			validateUrl: `${this.configService.get('frontendEmailValidateURL')}${token.getToken()}`,
		};
		const html = Mustache.render(this.loadTemplate('welcome'), options);
		await this.sendMail(user.getEmail(), options.subject, html);
	}

	async sendRecoveryPasswordMail(
		user: UserService,
		token: TokenService,
	): Promise<void> {
		this.checkSendTemplate(user, token);
		if (token.getReason() != 'recoveryPassword')
			throw new Error('Bad Reason');
		const options = {
			subject: 'Recovery password in Matcha',
			websiteName: 'Matcha',
			username: user.getUsername(),
			recoveryUrl: `${this.configService.get('frontendEmailRecoveryURL')}${token.getToken()}`,
			fontTitle: `${this.configService.get('frontendFontTitleURL')}`,
			fontBody: `${this.configService.get('frontendFontBodyURL')}`,
			fontEmphase: `${this.configService.get('frontendFontEmphaseURL')}`,
		};
		const html = Mustache.render(
			this.loadTemplate('recoveryPassword'),
			options,
		);
		await this.sendMail(user.getEmail(), options.subject, html);
	}

	private async sendMail(
		to: string,
		subject: string,
		content: string,
	): Promise<void> {
		/* istanbul ignore next */
		if (this.configService.get<boolean>('test') == undefined) {
			throw new InternalServerErrorException();
		}
		if (
			this.configService.get<boolean>('test') ||
			process.env.NODE_ENV == 'test'
		) {
			console.log('to: ', to);
			console.log('subject: ', subject);
			console.log('content: ', content);
			return;
		}
		/* istanbul ignore next */
		const mail = {
			from: this.configService.get('mail.email'),
			to,
			subject,
			html: content,
		};
		/* istanbul ignore next */
		await EmailService.instance.sendMail(mail);
	}
}
