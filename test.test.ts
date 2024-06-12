import {getFreeTimes} from "./free-time"

describe("Calculate free time", () => {
	it("should calculate free time", () => {
		const events = [
			[
				{
					start: {
						date: "2023-01-04"
					},
					end: {
						date: "2023-01-05"
					},
					recurrence: ["RRULE:FREQ=WEEKLY;BYDAY=WE"],
					transparency: "transparent",
					iCalUID: "8o8elu75tthjmhvkbo6cak3in8@google.com",
					eventType: "workingLocation"
				},
				{
					etag: '"3413157673754000"',
					start: {
						dateTime: "2023-11-06T16:55:00+01:00",
						timeZone: "Europe/Paris"
					},
					end: {
						dateTime: "2023-11-06T17:00:00+01:00",
						timeZone: "Europe/Paris"
					},
					recurrence: ["RRULE:FREQ=WEEKLY;WKST=SU;BYDAY=MO,TH,TU,WE"],
					iCalUID: "jhmg15gpdnpdsfrte5shq325cj@google.com",
					sequence: 2,
					eventType: "focusTime"
				},
				{
					id: "35rhgefn1jpkhunm1cq760ph13",
					start: {
						dateTime: "2024-06-12T09:00:00+02:00",
						timeZone: "Europe/Paris"
					},
					end: {
						dateTime: "2024-06-12T12:30:00+02:00",
						timeZone: "Europe/Paris"
					},
					iCalUID: "35rhgefn1jpkhunm1cq760ph13@google.com",
					eventType: "default"
				},
				{
					id: "6a62ik3sm7bqi3a54o682n1vts",
					start: {
						dateTime: "2024-06-12T14:00:00+02:00",
						timeZone: "Europe/Paris"
					},
					end: {
						dateTime: "2024-06-12T14:30:00+02:00",
						timeZone: "Europe/Paris"
					},
					iCalUID: "6a62ik3sm7bqi3a54o682n1vts@google.com",
					eventType: "default"
				}
			],
			[
				{
					id: "3rlttdets2qpr2djmo0fi3pufo",
					start: {
						dateTime: "2023-06-12T17:00:00+02:00",
						timeZone: "Europe/Paris"
					},
					end: {
						dateTime: "2023-06-12T17:15:00+02:00",
						timeZone: "Europe/Paris"
					},
					recurrence: ["RRULE:FREQ=WEEKLY;BYDAY=FR,MO,TH,TU,WE"],
					iCalUID: "3rlttdets2qpr2djmo0fi3pufo@google.com",
					eventType: "default"
				},
				{
					id: "shdjqv26npnkk1q4g30stfpnpo",
					start: {
						date: "2024-01-31"
					},
					end: {
						date: "2024-02-01"
					},
					recurrence: ["RRULE:FREQ=WEEKLY;BYDAY=WE"],
					iCalUID: "shdjqv26npnkk1q4g30stfpnpo@google.com",
					eventType: "workingLocation"
				},
				{
					id: "54qqss2gslrqu0cgps7kmhsv3l",
					start: {
						dateTime: "2024-06-12T12:00:00+02:00",
						timeZone: "Europe/Lisbon"
					},
					end: {
						dateTime: "2024-06-12T12:30:00+02:00",
						timeZone: "Europe/Lisbon"
					},
					iCalUID: "54qqss2gslrqu0cgps7kmhsv3l@google.com",
					eventType: "default"
				},
				{
					id: "35rhgefn1jpkhunm1cq760ph13",
					start: {
						dateTime: "2024-06-12T09:00:00+02:00",
						timeZone: "Europe/Paris"
					},
					end: {
						dateTime: "2024-06-12T12:30:00+02:00",
						timeZone: "Europe/Paris"
					},
					iCalUID: "35rhgefn1jpkhunm1cq760ph13@google.com",
					eventType: "default"
				},
				{
					id: "4q0i945k3mfrdk7tq1u0aiomif",
					start: {
						dateTime: "2024-06-12T14:00:00+02:00",
						timeZone: "Europe/Paris"
					},
					end: {
						dateTime: "2024-06-12T14:30:00+02:00",
						timeZone: "Europe/Paris"
					},
					iCalUID: "4q0i945k3mfrdk7tq1u0aiomif@google.com",
					eventType: "default"
				}
			]
		]

		const userDate = "2024-06-10T11:18:00+02:00"

		const startDate = "2024-06-12T00:00:00+02:00"
		const endDate = "2024-06-13T00:00:00+02:00"

		const freeTime = getFreeTimes({events, endDate, startDate, userDate})

		const expected = [
			[
				{
					start: "2024-06-12T00:00:00+02:00",
					end: "2024-06-12T09:00:00+02:00"
				},
				{
					start: "2024-06-12T12:30:00+02:00",
					end: "2024-06-12T14:00:00+02:00"
				},
				{
					start: "2024-06-12T14:30:00+02:00",
					end: "2024-06-12T16:55:00+02:00"
				},
				{
					start: "2024-06-12T17:00:00+02:00",
					end: "2024-06-13T00:00:00+02:00"
				}
			],
			[
				{
					start: "2024-06-12T00:00:00+02:00",
					end: "2024-06-12T09:00:00+02:00"
				},
				{
					start: "2024-06-12T12:30:00+02:00",
					end: "2024-06-12T14:00:00+02:00"
				},
				{
					start: "2024-06-12T14:30:00+02:00",
					end: "2024-06-12T17:00:00+02:00"
				},
				{
					start: "2024-06-12T17:15:00+02:00",
					end: "2024-06-13T00:00:00+02:00"
				}
			]
		]

		expect(freeTime).toEqual(expected)
	})
})
