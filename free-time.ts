import {calendar_v3} from "googleapis"
import {format, toZonedTime} from "date-fns-tz"
import {parseISO} from "date-fns"

// Function to extract time zone from ISO string
const getTimeZoneFromISO = (isoString: string): string => {
	const regex = /([+-]\d{2}:\d{2}|Z)$/
	const match = isoString.match(regex)

	if (match) {
		return match[0] === "Z" ? "UTC" : match[0]
	}

	// Handle case where there is no time zone info in the string
	return "UTC" // Default to UTC if no time zone is specified
}

// Function to convert ISO string to specified time zone
const convertToTimeZone = (isoString: string, targetTimeZone: string): string => {
	const date = parseISO(isoString)
	const zonedDate = toZonedTime(date, targetTimeZone)
	const formattedDate = format(zonedDate, "yyyy-MM-dd'T'HH:mm:ssXXX", {
		timeZone: targetTimeZone
	})

	return formattedDate
}

export const getFreeTimes = ({
	events,
	startDate,
	endDate,
	userDate
}: {
	events: calendar_v3.Schema$Event[][]
	startDate: string
	endDate: string
	userDate: string
}) => {
	// Remove workingLocation events from the list
	const eventsCleaned = events.map((events) => {
		return events
			.filter((event) => {
				// Exclude events that are working locations
				if (event.eventType === "workingLocation") return false

				// Check for events that has Recurrency with UNTIL date, and remove them if the UNTIL date is before now
				if (event.recurrence) {
					const untilDate = event.recurrence[0].split(";").find((rec) => rec.includes("UNTIL"))
					if (untilDate) {
						// Looks like : 20230619T215959Z
						const dateFormattedToISO = untilDate.split("=")[1].replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, "$1-$2-$3T$4:$5:$6Z")
						console.log("UNTIL date formatted to ISO:", dateFormattedToISO)
						const untilDateValue = new Date(dateFormattedToISO)
						console.log("UNTIL date value:", untilDateValue)
						if (untilDateValue < new Date(startDate)) return false
					}
				}

				return true
			})
			.map((event) => {
				// Map to the good day if the event is recurring
				if (event.recurrence) {
					const recurrenceRule = event.recurrence[0]
					const freq = recurrenceRule.match(/FREQ=(DAILY|WEEKLY|MONTHLY|YEARLY)/)
					if (freq && freq[1]) {
						const eventStartDate = new Date(event.start?.dateTime!)
						const eventEndDate = new Date(event.end?.dateTime!)
						switch (freq[1]) {
							case "DAILY":
							case "WEEKLY":
							case "MONTHLY":
							case "YEARLY":
								eventStartDate.setFullYear(new Date(startDate).getFullYear())
								eventStartDate.setMonth(new Date(startDate).getMonth())
								eventStartDate.setDate(new Date(startDate).getDate())
								eventEndDate.setFullYear(new Date(startDate).getFullYear())
								eventEndDate.setMonth(new Date(startDate).getMonth())
								eventEndDate.setDate(new Date(startDate).getDate())
								event!.start!.dateTime = eventStartDate.toISOString()
								event.end!.dateTime = eventEndDate.toISOString()
								break
							default:
								break
						}
					}
				}
				// Put everthing in the same timezone
				const eventStart = convertToTimeZone(event.start?.dateTime!, getTimeZoneFromISO(userDate))
				const eventEnd = convertToTimeZone(event.end?.dateTime!, getTimeZoneFromISO(userDate))
				event.start!.dateTime = eventStart
				event.end!.dateTime = eventEnd
				return event
			})
			.sort((eventA, eventB) => {
				const startA = new Date(eventA.start?.dateTime!)
				const startB = new Date(eventB.start?.dateTime!)
				return startA.getHours() * 60 + startA.getMinutes() - (startB.getHours() * 60 + startB.getMinutes())
			})
	})

	// console.log("events cleaned", eventsCleaned);

	// Get free time based of start of day until end of day based on the events

	const freeTime = eventsCleaned.map((events) => {
		const busy = events.map((event) => {
			const start = event.start?.dateTime!
			const end = event.end?.dateTime!
			return {start, end}
		})

		const available = busy.reduce((acc, slot, index) => {
			if (index === 0) {
				return [
					{
						start: startDate,
						end: slot.start
					}
				]
			}

			return [
				...acc,
				{
					start: busy[index - 1].end,
					end: slot.start
				}
			]
		}, [] as {start: string; end: string}[])

		// Add the last slot
		if (busy.length) {
			available.push({
				start: busy[busy.length - 1].end,
				end: endDate
			})
		}

		// Filter the available time to remove the one that have a start time after the end time
		const availableFiltered = available.filter((slot) => {
			return new Date(slot.start) < new Date(slot.end)
		})

		return availableFiltered
	})

	return freeTime
}
