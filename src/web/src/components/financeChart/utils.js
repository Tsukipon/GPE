import { tsvParse } from  "d3-dsv";
import { timeParse } from "d3-time-format";

function parseData(parse) {
	return function(d) {
		d.date = parse(d.date);
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;

		return d;
	};
}

const parseDate = timeParse("%Y-%m-%d");


export function minBid(data) {
	let min = Number.POSITIVE_INFINITY;
	for (let i = 0; i < data.length; i++) {
		if (data[i].bid < min) {
			min = data[i].bid;
		}
	}
	return min;
}

export function maxAsk(data) {
	let max = Number.NEGATIVE_INFINITY;
	for (let i = 0; i < data.length; i++) {
		if (data[i].ask > max) {
			max = data[i].ask;
		}
	}
	return max;
}


export function getData() {
	const promiseMSFT = fetch("https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/MSFT.tsv")
		.then(response => response.text())
		.then(data => tsvParse(data, parseData(parseDate)))
	return promiseMSFT;
}
