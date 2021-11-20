
const ZOOM = 16;

const icons = {};
const icon_f = function (tag, W) {
	const H = W;
	if(icons[tag] === undefined)
	{
		icons[tag] = L.icon({
			"iconUrl": "icons/" + tag + ".png",
			"iconSize": [W,H],
		});
	}
	return icons[tag];
};

const icon_ = icon_f("house-2-alternate", 16);
const icon_owned = icon_f("house-2", 20);
const icon_owned_by_wallet = icon_f("house-2_blue", 20);
const icon_auction = icon_f("cash-shield", 24);
const icon_auction_by_wallet = icon_f("cash-shield_orange", 24);
const icon_buy = icon_f("accounting-bill-stack-1", 24);

/*
	{
		"title": "",
		"popup": "",
		"icon":  icon_,
		"lat":   "",
		"lon":   "",
	},
*/


