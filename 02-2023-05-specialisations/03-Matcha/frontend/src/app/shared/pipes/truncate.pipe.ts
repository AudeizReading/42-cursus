import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'truncate',
	standalone: true,
})
export class TruncatePipe implements PipeTransform {
	public transform(value: string, size: number): unknown {
		return value && value.length > size ? value.slice(0, size) + '...' : value;
	}
}
