import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'capitalize',
	standalone: true,
})
export class CapitalizePipe implements PipeTransform {
	public transform(value: string): string {
		return value && value.length > 0 ? value.charAt(0).toUpperCase() + value.slice(1) : value;
	}
}
