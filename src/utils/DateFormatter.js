import { format } from 'date-fns';

class DateFormatter {
	format(date) {
		return format(new Date(date), 'dd-MM-yyyy');
	}
}

export default DateFormatter;
