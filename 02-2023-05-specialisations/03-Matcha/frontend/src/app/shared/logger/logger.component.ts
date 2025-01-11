import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggerService } from './logger.service';
import { Log } from './log';

@Component({
	selector: 'app-logger',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './logger.component.html',
	styleUrl: './logger.component.scss',
})
export class LoggerComponent implements OnInit {
	public logs: Log[] = [];
	public isHidden: boolean = false;
	public constructor(public loggerService: LoggerService) {}

	public ngOnInit(): void {
		this.logs = this.loggerService.getAll();
	}

	public clear(): void {
		this.loggerService.clear();
		this.logs = this.loggerService.getAll();
	}

	public hide(): void {
		this.isHidden = !this.isHidden;
	}
}
