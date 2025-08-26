import { ClientAction, ClientActionMap } from "./types";

export default function getExampleClientHistory(): ClientAction<keyof ClientActionMap>[] {
	return [
		{ timestamp: new Date('2025-01-06T12:34:56'), type: "created", payload: {} },
		{
			timestamp: new Date('2025-01-06T15:00:00'),
			type: "meeting",
			payload: { meetingId: "65536" },
		},
		{
			timestamp: new Date('2025-01-08T17:30:00'),
			type: "meeting",
			payload: { meetingId: "69696" },
		},
		{
			timestamp: new Date('2025-01-09T09:00:00'),
			type: "meeting",
			payload: { meetingId: "77777" },
		},
		{
			timestamp: new Date('2025-01-10T10:13:01'),
			type: "contractEstablished",
			payload: { contractId: "42" },
		},
		{
			timestamp: new Date('2025-02-03T11:10:20'),
			type: "deleted",
			payload: { reason: "Много качал права чота" },
		},
	];
}
