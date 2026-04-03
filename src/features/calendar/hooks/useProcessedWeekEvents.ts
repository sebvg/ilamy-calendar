import { useMemo } from 'react'
import { useSmartCalendarContext } from '@/hooks/use-smart-calendar-context'
import type { Dayjs } from '@/lib/configs/dayjs-config'
import { getPositionedEvents } from '@/lib/utils/position-week-events'

interface UseProcessedWeekEventsProps {
	days: Dayjs[]
	allDay?: boolean
	dayNumberHeight?: number
	resourceId?: string | number
	gridType?: 'day' | 'hour'
}

export const useProcessedWeekEvents = ({
	days,
	allDay,
	dayNumberHeight,
	resourceId,
	gridType,
}: UseProcessedWeekEventsProps) => {
	const {
		getEventsForDateRange,
		dayMaxEvents,
		eventSpacing,
		getEventsForResource,
	} = useSmartCalendarContext()

	const first = days.at(0)
	const last = days.at(-1)
	const weekStart = first?.startOf('day')
	const weekEnd = last?.endOf('day')

	const events = useMemo(() => {
		if (!weekStart || !weekEnd) return []
		let weekEvents = getEventsForDateRange(weekStart, weekEnd)
		if (resourceId) {
			const resourceEvents = getEventsForResource(resourceId)
			weekEvents = weekEvents.filter((event) =>
				resourceEvents.some((e) => String(e.id) === String(event.id))
			)
		}

		if (allDay) {
			weekEvents = weekEvents.filter((e) => !!e.allDay === allDay)
		}

		return weekEvents
	}, [
		getEventsForDateRange,
		getEventsForResource,
		weekStart,
		weekEnd,
		resourceId,
		allDay,
	])

	// Get all events that intersect with this week
	const positionedEvents = useMemo(() => {
		return getPositionedEvents({
			days,
			events,
			dayMaxEvents,
			dayNumberHeight,
			eventSpacing,
			gridType,
		})
	}, [days, dayMaxEvents, dayNumberHeight, eventSpacing, events, gridType])

	return positionedEvents
}
