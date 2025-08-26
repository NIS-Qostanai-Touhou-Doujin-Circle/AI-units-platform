import { ClientAction, ClientActionMap } from "./types";

export default function getExampleClientHistory(): ClientAction<keyof ClientActionMap>[] {
	return [
		{ timestamp: new Date(), type: "created", payload: {} },
		{
			timestamp: new Date(),
			type: "meeting",
			payload: { meetingId: "65536" },
		},
		{
			timestamp: new Date(),
			type: "meeting",
			payload: { meetingId: "69696" },
		},
		{
			timestamp: new Date(),
			type: "meeting",
			payload: { meetingId: "77777" },
		},
		{
			timestamp: new Date(),
			type: "contractEstablished",
			payload: { contractId: "42" },
		},
		{
			timestamp: new Date(),
			type: "deleted",
			payload: { reason: "Много качал права чота" },
		},
	];
}
