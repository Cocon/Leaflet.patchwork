// Leaflet.jsで読み込んだ地図タイルをつなぎ合わせて一枚の画像にして保存します
// タイルレイヤーがオプション「crossOrigin: true」のもと読み込まれていることが必要
// (C) 2020-2021 YUUKIToriyama All rights reserved.

const takeScreenshot = async (filetype: string) => {
	// DOMを直接参照し、タイル画像のダウンロード元を調べる
	let layerNode = document.querySelector(".leaflet-tile-container");
	if (layerNode === null) {
		throw Error("class .leaflet-tile-container cannot find.");
	}
	let tileNodes: NodeListOf<ChildNode> = layerNode.childNodes;

	// タイル画像のURLを抜き出し、それらを順序よくならべる
	let tileImgs = {};
	Array.from(tileNodes).map(tileNode => {
		return [tileNode.src.split(/[./]/).slice(-3).slice(0, 2), tileNode]
	}).sort().forEach(([position, tileImg]) => {
		let x = position[0];
		if (!(tileImgs.hasOwnProperty(x))) {
			tileImgs[x] = [];
		}
		tileImgs[x].push(tileImg);
	})
	console.log(tileImgs);

	// キャンバスを用意し、タイル画像を敷き詰めていく
	let canvas = document.createElement("canvas");
	let w = Object.keys(tileImgs).length
	let h = tileNodes.length / w;
	canvas.width = w * 256;
	canvas.height = h * 256;

	let context = canvas.getContext("2d");
	let dx = 0;
	for (let [x, images] of Object.entries(tileImgs)) {
		let dy = 0;
		images.forEach(image => {
			context.drawImage(image, 256 * dx, 256 * dy);
			dy = dy + 1;
		})
		dx = dx + 1;
	}

	// キャンバスを画像に保存
	var a = document.createElement("a");
	a.href = await canvas.toDataURL(filetype);
	if (filetype == "image/jpeg") {
		a.download = "download.jpg"
	} else {
		a.download = "download.png"
	}
	a.click();
}

export default takeScreenshot;