
function parseLine(line) {
	let fields = line.split(',');
	let time = new Date(fields[0]).getTime();
	let value = parseInt(fields[1]);
	return { x: time, y: value };
}
async function getData(cut=0) {
	var data = await fetch('data.csv')
		.then(response => response.text())
		.then(text => text.trim().split('\n'));
	console.log(data.map(parseLine));
	return data.slice(cut).map(parseLine);
}


function doGraph(data, thickness=3) {
	var options = {
		series: [{
			name: 'Internet Connection',
			data: data,
		}],
		chart: {
			type: 'line',
			height: 350,
		},
		title: {
			text: 'Internet Connection',
			align: 'left'
		},
		fill: {
			type: 'gradient',
			gradient: {
				type: 'vertical',
				inverseColors: false,
				gradientToColors: ["#FF3377"],
			},
		},
		stroke: {
			curve: 'stepline',
			lineCap: 'round',
			width: thickness,
		},
		yaxis: {
			labels: {
				formatter: function (val) {
					return val.toFixed(0);
				},
			},
			title: {
				text: 'Connectivity'
			},
		},
		xaxis: {
			type: 'datetime',
			labels: {
				datetimeUTC: false,
			},
			tooltip: {
				formatter: function (val) {
					return new Date(val).toLocaleString('es-AR');
				}
			}
		},
		tooltip: {
			shared: false,
			y: {
				formatter: function (val) {
					return val.toFixed(0);
				}
			}
		}
	};

	var chart = new ApexCharts(document.querySelector("#chart"), options);
	chart.render();
}
