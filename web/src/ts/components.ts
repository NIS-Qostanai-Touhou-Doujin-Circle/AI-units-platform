import Chart from "chart.js/auto";
import colors from "tailwindcss/colors";
import $ from 'jquery';
import { Chat, getExampleChatArgs } from "./components/chat/chat";
import renderClientHistory from "./components/clientHistory/clientHistory";
import getExampleClientHistory from "./components/clientHistory/example";

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
			rotation: 5,
		},
		data: {
			labels: ["Hello", "World!"],
			datasets: [
				{
					data: [98, 2],
					backgroundColor: [colors.red[500], colors.green[500]],
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
					backgroundColor: [colors.orange[500], colors.blue[500]],
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
					backgroundColor: [colors.orange[500], colors.green[500], colors.blue[500]],
				},
			],
		},
	});
}

pieChart();
barChart();
lineChart();
$("#money").text(new Intl.NumberFormat('ru-KZ', { style: 'currency', currency: 'KZT' }).format(1337));
new Chat($("#chat")[0], getExampleChatArgs());
renderClientHistory($("#client-history")[0], getExampleClientHistory());