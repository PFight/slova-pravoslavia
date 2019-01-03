// @ts-ignore
import LocationBar from "location-bar";
var locationBar = new LocationBar();

export function getCurrentWorshipId(url = location.href) {
    return getParameterByName("worship", location.href);
}

export function onCurrentWorshipChange(callback: (worshipId: string | null) => void) {
    locationBar.onChange((url: string) => {
        let worshipId = getCurrentWorshipId(url);
        callback(worshipId);;
    });
}

function getParameterByName(name: string, url: string) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}