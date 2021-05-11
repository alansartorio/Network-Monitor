
function parseLine(line) {
	let fields = line.split(',');
	let time = new Date(fields[0]).getTime();
	let value = parseInt(fields[1]);
	return { x: time, y: value };
}
async function getData() {
	var data = await fetch('data.csv')
		.then(response => response.text())
		.then(text => text.trim().split('\n'))
		.then(data => data.map(parseLine));
	return data;
}

function filterLatest(data, cut) {
	if (cut != null) {
		let first = data[data.length - 1].x - cut;
		let cutIndex = data.findIndex(p => p.x > first);
		let newData = data.slice(cutIndex);
		newData.unshift({x: first, y: data[cutIndex - 1].y});
		return newData;
	}
	return data;
}


function getChart(connectivity, uptime, thickness = 3) {
	var options = {
		series: [{
			name: 'Internet Connectivity',
			data: connectivity,
		}, {
			name: 'Uptime %',
			data: uptime,
		}],
		chart: {
			type: 'line',
			height: 350,
		},
		title: {
			text: 'Internet Status',
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
			curve: ['stepline', 'smooth'],
			lineCap: 'round',
			width: thickness,
		},
		yaxis: [
			{
				labels: {
					formatter: function (val) {
						return val.toFixed(0);
					},
				},
				title: {
					text: 'Connectivity'
				},
			},
			{
				labels: {
					formatter: function (val) {
						return (val * 100).toFixed(1) + '%';
					},
				},
				title: {
					text: 'Uptime %'
				},
				min: 0,
				max: 1
			}
		],
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
			shared: true,
			y: [{
				formatter: function (val) {
					return val.toFixed(0);
				}
			}, {
				formatter: function (val) {
					return (val * 100).toFixed(1) + '%';
				}
			}]
		}
	};

	return new ApexCharts(document.querySelector("#chart"), options);
}

function simplify(data) {
	let out = [data[0]];
	for (let i = 1; i < data.length - 1; i++) {
		if (data[i - 1].y != data[i].y)
			out.push(data[i]);
	}
	out.push(data[data.length - 1]);
	return out;
}