import { format, parse } from 'date-fns';

class DateFormatter {
	format(date) {
		return date ? format(new Date(date), 'dd-MM-yyyy') : '';
	}

	formatForInput(displayDate) {
		if (!displayDate) return '';
		// Parse dd-MM-yyyy to Date object then format to yyyy-MM-dd
		const parsedDate = parse(displayDate, 'dd-MM-yyyy', new Date());
		return format(parsedDate, 'yyyy-MM-dd');
	}

	formatFromInput(inputDate) {
		if (!inputDate) return '';
		// Parse yyyy-MM-dd to Date object then format to dd-MM-yyyy
		return format(new Date(inputDate), 'dd-MM-yyyy');
	}
}

export default DateFormatter;
