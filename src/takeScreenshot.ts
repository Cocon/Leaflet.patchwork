// Leaflet.jsで読み込んだ地図タイルをつなぎ合わせて一枚の画像にして保存します
// タイルレイヤーがオプション「crossOrigin: true」のもと読み込まれていることが必要
// (C) 2020-2021 YUUKIToriyama All rights reserved.

interface TileImages {
	[index: string]: HTMLImageElement[]
}

export const takeScreenshot = async (filetype?: string) => {
	// DOMを直接参照し、タイル画像のダウンロード元を調べる
	const layerNode: HTMLDivElement | null = document.querySelector(".leaflet-tile-container");
	if (layerNode === null) {
		throw Error("class .leaflet-tile-container cannot find.");
	}
	const tileNodes: NodeListOf<HTMLImageElement> = layerNode.querySelectorAll("img");

	// タイル画像のURLを抜き出し、それらを順序よくならべる
	let tileImages: TileImages = {};
	Array.from(tileNodes).map(tileNode => {
		return {
			position: tileNode.src.split(/[./]/).slice(-3).slice(0, 2).map(num => parseInt(num)),
			imgElement: tileNode
		}
	}).sort((a, b) => {
		// z/x/y.pngのxでソート
		return a.position[0] - b.position[0]
	}).forEach(tile => {
		let x = tile.position[0];
		if (!tileImages.hasOwnProperty(x)) {
			tileImages[x] = [];
		}
		tileImages[x].push(tile.imgElement);
	});
	console.log(tileImages);

	// キャンバスを用意し、タイル画像を敷き詰めていく
	const canvas: HTMLCanvasElement = document.createElement("canvas");
	const w = Object.keys(tileImages).length;
	const h = tileNodes.length / w;
	canvas.width = w * 256;
	canvas.height = h * 256;

	const context = canvas.getContext("2d");
	let dx = 0;
	Object.values(tileImages).forEach(images => {
		let dy = 0;
		images.forEach(image => {
			if (context === null) {
				throw Error("context is null");
			}
			context.drawImage(image, 256 * dx, 256 * dy);
			dy++;
		});
		dx++;
	});

	// キャンバスを画像に保存
	const a: HTMLAnchorElement = document.createElement("a");
	a.href = canvas.toDataURL(filetype || "image/jpeg");
	if (filetype == "image/jpeg") {
		a.download = "download.jpg"
	} else {
		a.download = "download.png"
	}
	a.click();
}
