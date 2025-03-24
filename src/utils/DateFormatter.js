import { format, parse, formatDistanceToNow, isValid } from 'date-fns';

class DateFormatter {
	static format(date) {
		return date ? format(new Date(date), 'dd-MM-yyyy') : '';
	}

	static formatForInput(displayDate) {
		if (!displayDate) return '';
		// Parse dd-MM-yyyy to Date object then format to yyyy-MM-dd
		const parsedDate = parse(displayDate, 'dd-MM-yyyy', new Date());
		return format(parsedDate, 'yyyy-MM-dd');
	}

	static formatFromInput(inputDate) {
		if (!inputDate) return '';
		// Parse yyyy-MM-dd to Date object then format to dd-MM-yyyy
		return format(new Date(inputDate), 'dd-MM-yyyy');
	}

	static getTimeRemaining(targetDate) {
		if (!targetDate) return 'No deadline';

		const target = parse(`${targetDate}`, 'dd-MM-yyyy HH:mm', new Date());

		const now = new Date();

		if (target < now) {
			return 'Overdue';
		}

		return `Due ${formatDistanceToNow(target, { addSuffix: true })}`;
	}
}

export const formatDate = DateFormatter.format;
export const formatForInput = DateFormatter.formatForInput;
export const formatFromInput = DateFormatter.formatFromInput;
export const getTimeRemaining = DateFormatter.getTimeRemaining;
