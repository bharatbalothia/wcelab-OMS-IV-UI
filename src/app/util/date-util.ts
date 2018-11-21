
export class DateUtil {

    public static getStartOfTheWeek(theDay: Date): Date {

        const dayOfTheWeek = theDay.getDay();

        // How many milliseconds we are from start of the week at this time
        const timeOffSet: number = 1000*60*60*24*dayOfTheWeek;

        const startOfWeek = new Date(theDay.valueOf() - timeOffSet);

        startOfWeek.setHours(0, 0, 0, 0);

        return startOfWeek;

    }

}