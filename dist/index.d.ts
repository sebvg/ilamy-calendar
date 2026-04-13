import { Frequency, Weekday } from "rrule";
import { RRule } from "rrule";
import { Options } from "rrule";
import { Dayjs } from "dayjs";
/**
* Re-rrule.js Options with practical TypeScript interface.
* Makes all properties optional except freq and dtstart (which are required by RFC 5545).
* This allows clean object creation without needing explicit null values.
*
* @see https://tools.ietf.org/html/rfc5545 - RFC 5545 iCalendar specification
* @see https://github.com/jakubroztocil/rrule - rrule.js library documentation
*/
type RRuleOptions = {
	/**
	* The frequency of the event. Must be one of the following: DAILY, WEEKLY, MONTHLY, etc.
	*/
	freq: Options["freq"];
	/**
	* The start date of the recurrence rule. This defines when the recurrence pattern begins.
	* Required for proper RRULE functionality according to RFC 5545.
	* @important Same as the event start date.
	*/
	dtstart: Date;
} & Partial<Omit<Options, "freq" | "dtstart">>;
/**
* Core calendar event interface representing a single calendar event.
* This is the primary data structure for calendar events.
*/
interface CalendarEvent {
	/** Unique identifier for the event */
	id: string | number;
	/** Display title of the event */
	title: string;
	/** Start date and time of the event */
	start: Dayjs;
	/** End date and time of the event */
	end: Dayjs;
	/**
	* Color for the event (supports CSS color values, hex, rgb, hsl, or CSS class names)
	* @example "#3b82f6", "blue-500", "rgb(59, 130, 246)"
	*/
	color?: string;
	/**
	* Background color for the event (supports CSS color values, hex, rgb, hsl, or CSS class names)
	* @example "#dbeafe", "blue-100", "rgba(59, 130, 246, 0.1)"
	*/
	backgroundColor?: string;
	/** Optional description or notes for the event */
	description?: string;
	/** Optional location where the event takes place */
	location?: string;
	/**
	* Whether this is an all-day event
	* @default false
	*/
	allDay?: boolean;
	/**
	* Recurrence rule for recurring events (RFC 5545 standard)
	*
	* Uses TypeScript interface for better readability, type safety, and IDE support
	* compared to RRULE string format. Converted to rrule.js format internally.
	*
	* @example { freq: 'WEEKLY', interval: 1, byweekday: ['MO', 'WE', 'FR'] }
	* @example { freq: 'DAILY', interval: 1, count: 10 }
	* @example { freq: 'MONTHLY', interval: 1, until: new Date('2025-12-31') }
	*/
	rrule?: RRuleOptions;
	/**
	* Exception dates (EXDATE) - dates to exclude from recurrence
	* Uses ISO string format for storage and transmission
	* @example ['2025-01-15T09:00:00.000Z', '2025-01-22T09:00:00.000Z']
	*/
	exdates?: string[];
	/**
	* Recurrence ID (RECURRENCE-ID) - identifies modified instances
	* Points to the original occurrence date this event modifies
	* Used for events that are modifications of recurring instances
	*/
	recurrenceId?: string;
	/**
	* UID for iCalendar compatibility
	* Unique identifier across calendar systems
	*/
	uid?: string;
	/** Single resource assignment */
	resourceId?: string | number;
	/** Multiple resource assignment (cross-resource events) */
	resourceIds?: (string | number)[];
	/**
	* Custom data associated with the event
	* Use this to store additional metadata specific to your application
	* @example { meetingType: 'standup', attendees: ['john', 'jane'] }
	*/
	data?: Record<string, any>;
}
/**
* Supported days of the week for calendar configuration.
* Used for setting the first day of the week and other week-related settings.
*/
type WeekDays = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";
/**
* Configuration for business hours.
* Defines the working hours to be highlighted on the calendar.
*/
interface BusinessHours {
	/**
	* Days of the week to apply business hours to.
	* @default ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
	*/
	daysOfWeek?: WeekDays[];
	/**
	* Start time for business hours in 24-hour format (0-24).
	* @default 9
	*/
	startTime?: number;
	/**
	* End time for business hours in 24-hour format (0-24).
	* @default 17
	*/
	endTime?: number;
}
interface EventFormProps {
	open?: boolean;
	selectedEvent?: CalendarEvent | null;
	onAdd?: (event: CalendarEvent) => void;
	onUpdate?: (event: CalendarEvent) => void;
	onDelete?: (event: CalendarEvent) => void;
	onClose: () => void;
}
import React4 from "react";
import React3 from "react";
/**
* Public-facing resource calendar event interface with flexible date types.
* Similar to IlamyCalendarPropEvent but with resource assignment fields.
* Dates can be provided as Dayjs, Date, or string and will be normalized internally.
*
* @interface IlamyResourceCalendarPropEvent
* @extends {IlamyCalendarPropEvent}
*/
interface IlamyResourceCalendarPropEvent extends IlamyCalendarPropEvent {
	/** Single resource assignment */
	resourceId?: string | number;
	/** Multiple resource assignment (cross-resource events) */
	resourceIds?: (string | number)[];
}
interface IlamyResourceCalendarProps extends Omit<IlamyCalendarProps, "events"> {
	/** Array of events to display */
	events?: IlamyResourceCalendarPropEvent[];
	/** Array of resources */
	resources?: Resource[];
	/** Custom render function for resources */
	renderResource?: (resource: Resource) => React.ReactNode;
	/**
	* Orientation of the resource view.
	* - "horizontal": Resources are rows, time is columns (default)
	* - "vertical": Resources are columns, time is rows
	*/
	orientation?: "horizontal" | "vertical";
	/**
	* Granularity of time slots in the week view.
	* - "hourly": Time slots are 1 hour (default)
	* - "daily": Time slots are 1 day
	*/
	weekViewGranularity?: "hourly" | "daily";
}
/**
* Resource interface representing a calendar resource (person, room, equipment, etc.)
*/
interface Resource {
	/** Unique identifier for the resource */
	id: string | number;
	/** Display title of the resource */
	title: string;
	/**
	* Color for the resource (supports CSS color values, hex, rgb, hsl, or CSS class names)
	* @example "#3b82f6", "blue-500", "rgb(59, 130, 246)"
	*/
	color?: string;
	/**
	* Background color for the resource (supports CSS color values, hex, rgb, hsl, or CSS class names)
	* @example "#dbeafe", "blue-100", "rgba(59, 130, 246, 0.1)"
	*/
	backgroundColor?: string;
	/** Optional position for resource display */
	position?: number;
	/**
	* Configuration for resource-specific business hours.
	* If provided, these will be used instead of the global business hours for this resource.
	*/
	businessHours?: BusinessHours | BusinessHours[];
	/**
	* Custom data associated with the resource
	* Use this to store additional metadata specific to your application
	* @example { avatar: 'https://example.com/avatar.png', role: 'admin' }
	*/
	data?: Record<string, any>;
}
interface Translations {
	today: string;
	create: string;
	new: string;
	update: string;
	delete: string;
	cancel: string;
	export: string;
	event: string;
	events: string;
	newEvent: string;
	title: string;
	description: string;
	location: string;
	allDay: string;
	startDate: string;
	endDate: string;
	startTime: string;
	endTime: string;
	color: string;
	createEvent: string;
	editEvent: string;
	addNewEvent: string;
	editEventDetails: string;
	eventTitlePlaceholder: string;
	eventDescriptionPlaceholder: string;
	eventLocationPlaceholder: string;
	repeat: string;
	repeats: string;
	customRecurrence: string;
	daily: string;
	weekly: string;
	monthly: string;
	yearly: string;
	interval: string;
	repeatOn: string;
	never: string;
	count: string;
	every: string;
	ends: string;
	after: string;
	occurrences: string;
	on: string;
	editRecurringEvent: string;
	deleteRecurringEvent: string;
	editRecurringEventQuestion: string;
	deleteRecurringEventQuestion: string;
	thisEvent: string;
	thisEventDescription: string;
	thisAndFollowingEvents: string;
	thisAndFollowingEventsDescription: string;
	allEvents: string;
	allEventsDescription: string;
	onlyChangeThis: string;
	changeThisAndFuture: string;
	changeEntireSeries: string;
	onlyDeleteThis: string;
	deleteThisAndFuture: string;
	deleteEntireSeries: string;
	month: string;
	week: string;
	day: string;
	year: string;
	more: string;
	resources: string;
	resource: string;
	time: string;
	date: string;
	noResourcesVisible: string;
	addResourcesOrShowExisting: string;
	sunday: string;
	monday: string;
	tuesday: string;
	wednesday: string;
	thursday: string;
	friday: string;
	saturday: string;
	sun: string;
	mon: string;
	tue: string;
	wed: string;
	thu: string;
	fri: string;
	sat: string;
	january: string;
	february: string;
	march: string;
	april: string;
	may: string;
	june: string;
	july: string;
	august: string;
	september: string;
	october: string;
	november: string;
	december: string;
}
type TranslationKey = keyof Translations;
type TranslatorFunction = (key: TranslationKey | string) => string;
/**
* Available calendar view types.
*/
type CalendarView = "month" | "week" | "day" | "year";
/**
* Time format options for displaying times in the calendar.
*/
type TimeFormat = "12-hour" | "24-hour";
/**
* Custom class names for calendar styling.
* Allows users to override default styles for various calendar elements.
*/
interface CalendarClassesOverride {
	/**
	* Class name for disabled cells (non-business hours).
	* Replaces the DISABLED_CELL_CLASSNAME constant.
	* @default "bg-secondary text-muted-foreground pointer-events-none"
	* @example "bg-gray-100 text-gray-400 cursor-not-allowed"
	*/
	disabledCell?: string;
}
/**
* This interface extends the base CalendarEvent but allows more flexible date types
* for the start and end properties. The component will automatically convert these
* to dayjs objects internally for consistent date handling.
*
* @interface IlamyCalendarPropEvent
* @extends {Omit<CalendarEvent, 'start' | 'end'>}
*/
interface IlamyCalendarPropEvent extends Omit<CalendarEvent, "start" | "end"> {
	start: Dayjs | Date | string;
	end: Dayjs | Date | string;
}
/**
* Information passed to the onCellClick callback.
* Uses named properties for extensibility.
*/
interface DateRange {
	start: Dayjs;
	end: Dayjs;
}
interface CellClickInfo {
	/** Start date/time of the clicked cell */
	start: Dayjs;
	/** End date/time of the clicked cell */
	end: Dayjs;
	/** Resource ID if clicking on a resource calendar cell (optional) */
	resourceId?: string | number;
	/** Whether the clicked cell is an all-day cell (optional) */
	allDay?: boolean;
}
/**
* Props passed to the custom render function for the current time indicator.
* Allows users to customize how the current time indicator is displayed.
*/
interface RenderCurrentTimeIndicatorProps {
	/** The current time as a dayjs object */
	currentTime: Dayjs;
	/** The start of the visible time range */
	rangeStart: Dayjs;
	/** The end of the visible time range */
	rangeEnd: Dayjs;
	/** Progress percentage (0-100) representing position in the range */
	progress: number;
	/**
	* The resource associated with this column (if in a resource-based view).
	* Pass this to conditionally render custom indicators for specific resources.
	*/
	resource?: Resource;
	/** The current calendar view (e.g. 'day', 'week') */
	view: CalendarView;
}
interface IlamyCalendarProps {
	/**
	* Array of events to display in the calendar.
	*/
	events?: IlamyCalendarPropEvent[];
	/**
	* The first day of the week to display in the calendar.
	* Can be 'sunday', 'monday', etc. Defaults to 'sunday'.
	*/
	firstDayOfWeek?: WeekDays;
	/**
	* The initial view to display when the calendar loads.
	* Defaults to 'month'.
	*/
	initialView?: CalendarView;
	/**
	* The initial date to display when the calendar loads.
	* If not provided, the calendar will default to today's date.
	*/
	initialDate?: Dayjs | Date | string;
	/**
	* Custom render function for calendar events.
	* If provided, it will override the default event rendering.
	*/
	renderEvent?: (event: CalendarEvent) => React3.ReactNode;
	/**
	* Callback when an event is clicked.
	* Provides the clicked event object.
	*/
	onEventClick?: (event: CalendarEvent) => void;
	/**
	* Callback when a calendar cell is clicked.
	* Provides cell information including start/end dates and optional resourceId.
	*/
	onCellClick?: (info: CellClickInfo) => void;
	/**
	* Callback when the calendar view changes (month, week, day, year).
	* Useful for syncing with external state or analytics.
	*/
	onViewChange?: (view: CalendarView) => void;
	/**
	* Callback when a new event is added to the calendar.
	* Provides the newly created event object.
	*/
	onEventAdd?: (event: CalendarEvent) => void;
	/**
	* Callback when an existing event is updated.
	* Provides the updated event object.
	*/
	onEventUpdate?: (event: CalendarEvent) => void;
	/**
	* Callback when an event is deleted from the calendar.
	* Provides the deleted event object.
	*/
	onEventDelete?: (event: CalendarEvent) => void;
	/**
	* Callback when the current date changes (navigation).
	* Provides the new current date and the current visible range.
	*/
	onDateChange?: (date: Dayjs, range: DateRange) => void;
	/**
	* Locale to use for formatting dates and times.
	* If not provided, the default locale will be used.
	*/
	locale?: string;
	/**
	* Translations object for internationalization.
	* Provide either this OR translator function, not both.
	*/
	translations?: Translations;
	/**
	* Translator function for internationalization.
	* Provide either this OR translations object, not both.
	*/
	translator?: TranslatorFunction;
	/**
	* Timezone to use for displaying dates and times.
	* If not provided, the local timezone will be used.
	*/
	timezone?: string;
	/**
	* Whether to disable click events on calendar cells.
	* Useful for read-only views or when cell clicks are not needed.
	*/
	disableCellClick?: boolean;
	/**
	* Whether to disable click events on calendar events.
	* Useful for read-only views or when event clicks are not needed.
	*/
	disableEventClick?: boolean;
	/**
	* Whether to disable drag-and-drop functionality for calendar events.
	* Useful for read-only views or when drag-and-drop is not needed.
	*/
	disableDragAndDrop?: boolean;
	/**
	* Maximum number of events to display per day in month view.
	* Additional events will be hidden and can be viewed via a "more" link.
	* Defaults to 3 if not specified.
	*/
	dayMaxEvents?: number;
	/**
	* Vertical spacing between stacked events in pixels.
	* Controls the gap between events when multiple events are displayed in the same view.
	* Defaults to 1 pixel if not specified.
	* Recommended range: 1-8 pixels for optimal readability.
	*/
	eventSpacing?: number;
	/**
	* Height of event bars in horizontal grid views (month view, resource month, resource week horizontal) in pixels.
	* Increase this to show more content per event (e.g., title + time on separate lines).
	* Does not affect day/week views, which use percentage-based heights that scale with event duration.
	* Defaults to 24 pixels if not specified.
	*/
	eventHeight?: number;
	/**
	* Whether to stick the view header to the top of the calendar.
	* Useful for keeping the header visible while scrolling.
	*/
	stickyViewHeader?: boolean;
	/**
	* Custom class name for the view header.
	* Useful for applying custom styles or themes.
	*/
	viewHeaderClassName?: string;
	/**
	* Custom header component to replace the default calendar header.
	* Useful for adding custom branding or additional controls.
	*/
	headerComponent?: React3.ReactNode;
	/**
	* Custom class name for the calendar header.
	* Useful for applying custom styles to the header.
	*/
	headerClassName?: string;
	/**
	* Configuration for business hours.
	* Defines the working hours to be highlighted on the calendar.
	* Can be a single BusinessHours object (applies to all specified days)
	* or an array of BusinessHours objects (for different hours on different days).
	*/
	businessHours?: BusinessHours | BusinessHours[];
	/**
	* Custom render function for the event form.
	* If provided, it will override the default event form component.
	* The function receives EventFormProps and should return a React node.
	*/
	renderEventForm?: (props: EventFormProps) => React3.ReactNode;
	/**
	* Time format for displaying times in the calendar.
	* - "12-hour": Times displayed as "1:00 PM" (default)
	* - "24-hour": Times displayed as "13:00"
	*/
	timeFormat?: TimeFormat;
	/**
	* Whether to hide non-business hours in Day and Week views.
	* Requires businessHours to be configured.
	* @default false
	*/
	hideNonBusinessHours?: boolean;
	/**
	* Custom class names for overriding default calendar element styles.
	* Allows fine-grained control over the appearance of different calendar elements.
	* @example { disabledCell: "bg-gray-100 text-gray-400" }
	*/
	classesOverride?: CalendarClassesOverride;
	/**
	* Custom render function for the current time indicator.
	* If provided, replaces the default red line indicator.
	* Useful for adding custom time labels or styling.
	*
	* @example
	* ```tsx
	* renderCurrentTimeIndicator={({ currentTime, progress, resource, view }) => {
	*   // Only show the time badge for the first resource in Day view (to avoid repetition)
	*   const isPrimary = !resource || resource.id === 'room-a'
	*   const showBadge = view === 'day' ? isPrimary : true
	*
	*   return (
	*     <div style={{ top: `${progress}%` }} className="absolute left-0 right-0">
	*       <div className="h-0.5 bg-red-500" />
	*       {showBadge && (
	*         <span className="absolute left-0 bg-red-500 text-white text-[10px] px-1 rounded-r-sm">
	*           {currentTime.format('h:mm A')}
	*         </span>
	*       )}
	*     </div>
	*   )
	* }}
	* ```
	*/
	renderCurrentTimeIndicator?: (props: RenderCurrentTimeIndicatorProps) => React3.ReactNode;
	/**
	* Days of the week to hide from the week view.
	* Hidden days won't render as columns, giving remaining days more space.
	* Only applies to vertical week views (regular and resource vertical).
	* Does not affect month, day, year, or resource horizontal week views.
	* @default []
	* @example ['saturday', 'sunday'] // Hide weekends
	*/
	hiddenDays?: WeekDays[];
	/**
	* Custom render function for the hour labels in the gutter/header.
	* Receives a Dayjs object for the hour and should return a React node.
	*/
	renderHour?: (date: Dayjs) => React3.ReactNode;
}
declare const IlamyCalendar: React4.FC<IlamyCalendarProps>;
declare const isRecurringEvent: (event: CalendarEvent) => boolean;
interface GenerateRecurringEventsProps {
	event: CalendarEvent;
	currentEvents: CalendarEvent[];
	startDate: Dayjs;
	endDate: Dayjs;
}
declare const generateRecurringEvents: ({ event, currentEvents, startDate, endDate }: GenerateRecurringEventsProps) => CalendarEvent[];
import React5 from "react";
declare const IlamyResourceCalendar: React5.FC<IlamyResourceCalendarProps>;
/**
* Publicly exposed calendar context properties.
*/
interface UseIlamyCalendarContextReturn {
	readonly currentDate: Dayjs;
	readonly view: CalendarView;
	readonly events: CalendarEvent[];
	readonly isEventFormOpen: boolean;
	readonly selectedEvent: CalendarEvent | null;
	readonly selectedDate: Dayjs | null;
	readonly firstDayOfWeek: number;
	readonly resources: Resource[];
	readonly setCurrentDate: (date: Dayjs) => void;
	readonly selectDate: (date: Dayjs) => void;
	readonly setView: (view: CalendarView) => void;
	readonly nextPeriod: () => void;
	readonly prevPeriod: () => void;
	readonly today: () => void;
	readonly addEvent: (event: CalendarEvent) => void;
	readonly updateEvent: (eventId: string | number, event: Partial<CalendarEvent>) => void;
	readonly deleteEvent: (eventId: string | number) => void;
	readonly openEventForm: (eventData?: Partial<CalendarEvent>) => void;
	readonly closeEventForm: () => void;
	readonly getEventsForResource: (resourceId: string | number) => CalendarEvent[];
	readonly businessHours?: BusinessHours | BusinessHours[];
}
/**
* Public hook exported for library users.
* Returns a limited set of commonly used properties and methods.
*/
declare function useIlamyCalendarContext(): UseIlamyCalendarContextReturn;
declare const defaultTranslations: Translations;
export { useIlamyCalendarContext, isRecurringEvent, generateRecurringEvents, defaultTranslations, Weekday, WeekDays, UseIlamyCalendarContextReturn, TranslatorFunction, Translations, TranslationKey, TimeFormat, Resource, RenderCurrentTimeIndicatorProps, RRuleOptions, RRule, IlamyResourceCalendarProps, IlamyResourceCalendar, IlamyCalendarProps, IlamyCalendar, Frequency, EventFormProps, CellClickInfo, CalendarView, CalendarEvent, BusinessHours };
