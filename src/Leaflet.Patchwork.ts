import L from "leaflet";
import { takeScreenshot } from './takeScreenshot';

import './style.css';

export class Patchwork extends L.Control {
	container: HTMLDivElement | null;
	constructor(options?: L.ControlOptions) {
		super(options);
		this.container = null;
	}
	onAdd = (map: L.Map) => {
		this.container = L.DomUtil.create("div", "leaflet-cocodoco");
		const button = L.DomUtil.create("button", "leaflet-cocodoco-button", this.container);
		L.DomEvent.addListener(button, "click", () => {
			try {
				takeScreenshot()
			} catch (error) {
				console.error(error);
			}
		});
		return this.container;
	}
}