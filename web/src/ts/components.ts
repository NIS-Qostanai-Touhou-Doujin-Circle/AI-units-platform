import Chart from "chart.js/auto";
import colors from "tailwindcss/colors";

export function pieChart() {
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

function barChart() {
	const canvas = document.getElementById('bar-chart') as HTMLCanvasElement;
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	const chart = new Chart(ctx, {
		type: "bar",
		options: {
			plugins: {
				title: {
					text: "Hello World Chart",
					display: true,
				},
				legend: {
					display: false
				}
			}
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

function lineChart() {
	const canvas = document.getElementById('line-chart') as HTMLCanvasElement;
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	const chart = new Chart(ctx, {
		type: "line",
		options: {
			plugins: {
				title: {
					text: "Hello World Chart",
					display: true,
				},
				legend: {
					display: false
				}
			},
		},
		data: {
			labels: ["Hello", "The", "World!"],
			datasets: [
				{
					data: [5, 8, 6],
					backgroundColor: [colors.red[500], colors.green[500], colors.blue[500]],
				},
			],
		},
	});
}

pieChart();
barChart();
lineChart();