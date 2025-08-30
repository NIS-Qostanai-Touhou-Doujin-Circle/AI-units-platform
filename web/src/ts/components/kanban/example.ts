import { Project } from "./types";

export function getMockProject(): Project {
	const user1 = {
		id: 1,
		name: "Олег Смирнов",
		image_url: "/static/assets/img/image.png",
	};

	return {
		id: 1,
		name: "Строительство дома",
		root_task: {
			id: 10,
			name: "Построить дом",
			created_at: new Date(),
			content: `Нужно столько всякой фигни сделать, столько челов задействовать, чтобы все это реализовать. капец просто.`,
			previous_task_id: null,
			parent_task_id: null,
			task_status: "todo",
			assignments: [
				{
					user: user1,
					can_edit: true,
				},
			],
			subtasks: {
				loaded: true,
				tasks: [
					{
						id: 14,
						name: "Планирование",
						created_at: new Date(),
						previous_task_id: null,
						parent_task_id: 10,
						task_status: "todo",
						assignments: [],
						subtasks: {
							loaded: true,
							tasks: [
								{
									id: 134,
									name: "Опрос клиента",
									created_at: new Date(),
									previous_task_id: null,
									parent_task_id: 14,
									task_status: "todo",
									assignments: [],
									subtasks: { loaded: true, tasks: [] },
								},
								{
									id: 154,
									name: "Эскиз",
									created_at: new Date(),
									previous_task_id: 134,
									parent_task_id: 14,
									task_status: "todo",
									assignments: [],
									subtasks: { loaded: true, tasks: [] },
								},
								{
									id: 157,
									name: "Согласование",
									created_at: new Date(),
									previous_task_id: 154,
									parent_task_id: 14,
									task_status: "todo",
									assignments: [],
									subtasks: { loaded: true, tasks: [] },
								},
							],
						},
					},
					{
						id: 33,
						name: "Закупка материалов",
						created_at: new Date(),
						previous_task_id: 14,
						parent_task_id: 10,
						task_status: "todo",
						assignments: [],
						subtasks: { loaded: true, tasks: [] },
					},
					{
						id: 77,
						name: "Реализация",
						created_at: new Date(),
						previous_task_id: 33,
						parent_task_id: 10,
						task_status: "todo",
						assignments: [],
						subtasks: {
							loaded: true,
							tasks: [
								{
									id: 78,
									name: "Фундамент",
									created_at: new Date(),
									previous_task_id: null,
									parent_task_id: 77,
									task_status: "todo",
									assignments: [],
									subtasks: { loaded: true, tasks: [] },
								},
							],
						},
					},
				],
			},
		},
	};
}
