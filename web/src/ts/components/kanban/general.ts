import { KanbanMethods } from "./types";



class KanbanBoard<T> {
	methods: KanbanMethods<T>;
	constructor(methods: KanbanMethods<T>) {
		this.methods = methods;
	}

	render(objs: T[]) {
		// group by statuses
		const statuses = this.methods.getStatuses().reduce((acc, status) => {
			acc[status] = [];
			return acc;
		}, {} as Record<string, T[]>);

		// assign objects to their respective status groups
		objs.forEach((obj) => {
			const status = this.methods.getStatusOf(obj);
			if (status) {
				statuses[status].push(obj);
			}
		});

		// create columns


	}
}

