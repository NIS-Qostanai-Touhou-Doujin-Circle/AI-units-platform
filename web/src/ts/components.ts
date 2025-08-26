import Chart from "chart.js/auto";
import colors from "tailwindcss/colors";

export function helloWorld() {
	const canvas = document.getElementById('pie-chart') as HTMLCanvasElement;
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	const chart = new Chart(ctx, {
		type: "pie",
		options: {
			plugins: {
				title: {
					text: "Hello World Chart",
					display: true,
				},
			},
		},
		data: {
			labels: ["Hello", "World!"],
			datasets: [
				{
					data: [5, 6],
					backgroundColor: [colors.red[500], colors.blue[500]],
				},
			],
		},
	});
}

helloWorld();
