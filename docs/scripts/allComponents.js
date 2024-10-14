import { initializeSelectMenu } from "./customSelectMenu.js";
import { initializeSideBar } from "./sidebar.js";
import { initializeTabSlider } from "./tabSlider.js";
import { initializePreview } from "./preview.js";

export function initializeComponents(){
    initializeSelectMenu();
    initializeTabSlider();
    initializeSideBar();
    initializePreview();
}