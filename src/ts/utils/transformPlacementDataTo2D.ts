export default function transformPlacementDataTo2D(data: number[]) {
	const arr: number[][] = [];

	for (let i = 0; i < data.length; i += 20) {
		arr.push(data.slice(i, i + 20));
	}

	return arr;
}
