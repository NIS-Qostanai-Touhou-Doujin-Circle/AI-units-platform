export interface ClientActionMap {
	created: {};
	deleted: { reason: string };
	contractEstablished: { contractId: string };
	meeting: { meetingId: string };
}

export type ClientAction<K extends keyof ClientActionMap> = {
	type: K;
	payload: ClientActionMap[K];
	timestamp: Date;
};
