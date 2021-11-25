
let PLACES = []

const README = [
	"<p>",
		"This is a demo using smart contracts running on the <a href=\"https://devnet-explorer.elrond.com/\">Elrond blockchain devnet</a>.",
	"</p>",
	"<br/>",
	"<center>",
		"<a class=\"swbutton\" href=\"https://devnet-wallet.elrond.com/hook/login?callbackUrl=https://xn--cds.net/buchavissent/\">Use an Elrond wallet to connect</a>",
		"<br/>",
		"<br/>",
		"or click on a token to view details about its owner.",
	"</center>",
	"<br/>",
	"<p>",
		"Here, for some <i>small fees</i>, you can have fun with:",
		"<ul>",
			"<li>watching a map</li>",
			"<li>seeing who got <a href=\"javascript:explore('2600198649w4443682037')\">the best places in town</a></li>",
			"<li>bidding at auctions for building ownership</li>",
			"<li>buying and selling building tokens</li>",
			"<li>swapping tokens with others</li>",
			"<li><i>a hefty wallet</i></li>",
			"<li>old communist apartments and new office towers</li>",
		"</ul>",
	"</p>",
	"<p>",
		"",
	"</p>",
	"<p>",
		"",
	"</p>",
	"<p>",
		"",
	"</p>",
	"<p>",
		"",
	"</p>",

	"<center><img src='flow.svg' style='width:100%;height:auto'></img></center>",
]

const TOKEN = ""

const MINTING_CONTRACT = "erd1qqqqqqqqqqqqqpgqupxnqvlve4e7a2as5zt7cr8a2qy7g6f07j5q3fstg6"
const MINTING_GAS_LIMIT = 20000000
const MINTING_MIN_VALUE = "250000000000000000" // eGLD-wei

const STATE = {}

const AUCTION_MARKER = "!A"

const ITEM_COLUMNS = [
	{
		"id": "name",
		"alias": "Name",
	},
	{
		"id": "addr:housenumber",
		"alias": "No.",
	},
	{
		"id": "addr:street",
		"alias": "Street",
	},
	{
		"id": "in-auction",
		"alias": "Auction",
		"link": (id, item, field) => {
			if(field == "--")
			{
				return "-"
			}
			else
			{
				return "<a href=\"javascript:()=>{}\">" + field + "</a>"
			}
		},
	},
	{
		"id": "ui-nav",
		"alias": "Actions",
		"link": (id, item, field) => { return "<a href=\"javascript:explore('" + item['x'] + "w" + item['y'] + "')\">Go</a>" },
	},
]


document.body.onload = function() {

	STATE.nonces = []
	fetch((json) => {
		STATE.nonces = JSON.parse(json)
	}, "/buchavissent/nonces.js")

	fetch((json) => {
		PLACES = eval(json)
		init()
	}, "/buchavissent/table.js")
}

const init = () => {
	init_state()
	show_ui()
	render_map()
	update_ui()
	setTimeout(deferred_update, 500)
}

const render_map = () => {
	let map = L.map("map", {"zoom": ZOOM, center: [44.420, 26.045], "zoomControl": false});

	/*
	setInterval(() => {
		document.title = map.getCenter()
	}, 500);
	*/

	let count = 0;
	L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
		{"maxZoom": 20}).addTo(map);
	PLACES.forEach(function (marker) {
		if(marker['x'] > "2605102040") return;
		if(marker['y'] > "4444363890") return;

		if(marker['name'] == "--") return;
		// if(marker['name'].indexOf('Bloc') == -1 && marker['name'].indexOf('Bl.') == -1) return;

		const id = marker.x + "w" + marker.y
		STATE.locations[id] = marker;

		const lon = marker.x / 100000000;
		const lat = marker.y / 100000000;
		++count;
		//console.log(lat, lon);
		
		let auction = "--"
		let owner = marker["blockchain_owner"]

		if(!owner) {
			owner = "--"
			marker["blockchain_owner"] = owner
		}

		auction_mark = owner.indexOf(AUCTION_MARKER)
		if(auction_mark > 0)
		{
			auction = owner.substr(auction_mark + AUCTION_MARKER.length)
			owner = owner.substr(0, auction_mark)
			
			//console.log('Auction', marker["blockchain_owner"], owner, auction, marker)

			marker["in-auction"] = auction.replace('_', ' ')
			marker["blockchain_owner"] = owner
		}
		else
		{
			marker["in-auction"] = auction
		}

		const short_owner = marker["blockchain_owner"].substr(4, 16)
		const long_owner = marker["blockchain_owner"]


		if(undefined === STATE.owners[long_owner])
		{
			STATE.owners[long_owner] = []
			STATE.owner_list.push(long_owner)
		}

		STATE.owners[long_owner].push(marker)


		let icon = icon_
		let owner_title = ""

		if(marker["in-auction"] != "--")
		{
			STATE.auctions.push(marker)

			if(long_owner == STATE.address)
			{
				owner_title = "\nAuctioned by you (" + marker["in-auction"] + ")"
				icon = icon_auction_by_wallet
				STATE.owned.push(marker)
			}
			else
			{
				owner_title = "\nOpen for bidding (" + marker["in-auction"] + ")\nOwned by " + short_owner
				icon = icon_auction
			}
		}
		else if(long_owner == STATE.address)
		{
			owner_title = "\nOwned by this wallet"
			icon = icon_owned_by_wallet
			STATE.owned.push(marker)
		}
		else if(long_owner != "--")
		{
			owner_title = "\nof " + short_owner
			icon = icon_owned
		}
		else
		{
			owner_title = "\nunowned"
			icon = icon_
		}

		const m = L.marker([lat, lon], {
			"title": marker.name + owner_title,
			"icon": icon,
		});

		marker["symbol"] = m;


		let owned = ""
		let actions = ""

		if(long_owner != "--")
		{
			if(long_owner == STATE.address)
			{
				owned += "<br/>Yours";
				if(marker["in-auction"] != "--")
				{
					actions += "<br/><a href=\"javascript:explore_auction('" + id + "')\">Review auction</a>"
				}
				else
				{
					actions += "<br/><a href=\"javascript:set_auction('" + id + "')\">Auction</a>"
					actions += "<br/><a href=\"javascript:set_price('" + id + "')\">Sell</a>"
					actions += "<br/><a href=\"javascript:donate('" + id + "')\">Gift</a>"
				}
			}
			else
			{
			owned += "<br/>"
			owned += "Owned by <a href=\"https://devnet-explorer.elrond.com/accounts/" + long_owner + "\">" + short_owner + "</a><br/><a href=\"/buchavissent?address=" + marker["blockchain_owner"] + "\">See their tokens</a>"
				if(marker["in-auction"] != "--")
				{
					actions += "<br/><a href=\"javascript:add_bid('" + id + "')\">Bid in auction</a> (price: " + marker["in-auction"] + ")"
				}
			}
		}
		else
		{
			actions += "<br/><a href=\"javascript:mint('" + id + "')\">Mint new token</a> (price: " + STATE.mint_minimum + ")"
		}

		if(!STATE.address) actions = ""

		const popup = marker.name + "<br/>" + marker['addr:housenumber'] + " " + marker['addr:street'] + "<br/>" + marker['addr:postcode'] + owned + actions;
		m.bindPopup(popup);

		m.addTo(map);
	});
	console.log(count, 'symbols on map');
}

const init_state = () => {
	const url = document.location.href

	if(url.indexOf('?') > 0)
	{
		const query = url.substr(url.indexOf('?') + 1)
		const eqvs = query.split('&')
		eqvs.forEach((xy) => {
			const equals = xy.indexOf('=')
			if(equals > 0) {
				const key = xy.substr(0, equals)
				const value = xy.substr(equals + 1)
				if(!STATE.hasOwnProperty(key))
				{
					STATE[key] = value
				}
			}
		})
	}

	STATE.locations = {}
	STATE.owners = {}
	STATE.owner_list = []

	STATE.owned = []
	STATE.auctions = []

	STATE.mint_minimum = MINTING_MIN_VALUE / 1e18 + " xeGLD"
}

const show_ui = () => {
	document.getElementById("top").innerHTML = chunk_title()
	const html = []
	html.push(chunk_wallet())
	html.push("<div id='owned'></div>")
	document.getElementById("main").innerHTML = html.join("")
}

const chunk_title = () => {
	return "<center style='font-size:4vh;cursor:hand'>Buchavissent</center>"
}

const chunk_wallet = () => {
	if(STATE.address)
	{
		blockchain_query((req) => {
			let value = "???"
			if(req.data && req.data.account && req.data.account.balance)
			{
				value = Math.round(parseInt(req.data.account.balance) / 1e12) / 1e6
			}
			document.getElementById("balance").innerHTML = value
		}, "/address/" + STATE.address)
		return "<b>Wallet</b>: <span style='font-size:auto;max-width:25vw'>" + STATE.address + "</span> <a href=\"/buchavissent\">Switch</a><br/><br/><b>Balance</b>: <span id='balance'></span> xeGLD<br/>"
	}
	else
	{
		return README.join("")
	}
}

const update_ui = () => {
	document.getElementById("statistics").innerHTML = chunk_statistics().join("")

	if(!STATE.address) return

	const html = []

	if(STATE.owned.length == 0)
	{
		html.push("<p>You do not own anything.</p>")
	}
	else
	{
		html.push("<p>You own these " + STATE.owned.length + " tokens:</p>")
		html.push("<table>")
		html.push("<tr>")
		ITEM_COLUMNS.forEach((col) => {
			html.push("<td class='header'>" + col.alias + "</td>")
		})
		html.push("</tr>")
		STATE.owned.forEach((item) => {
			html.push(owner_entry(item))
		})
		html.push("</table>")
	}

	document.getElementById("owned").innerHTML = html.join("")
}

const owner_entry = (item) => {
	let line = ""
	ITEM_COLUMNS.forEach((col) => {
		if(col.link) {
			const id = item.x + "w" + item.y
			line += "<td class='item'>" + col.link(id, item, item[col.id]) + "</td>"
		}
		else if(item[col.id] == "--") {
			line += "<td class='item'>-</td>"
		}
		else
		{
			line += "<td class='item'>" + item[col.id] + "</td>"
		}
	})
	return "<tr>" + line + "</tr>"
}

const explore = (id) => {
	STATE.locations[id].symbol.openPopup()
	console.log('Pinned ' + id)
}

const chunk_statistics = () => {
	const owners_sorted = STATE.owner_list.map((x) => { return x})

	for(let i = 0; i < owners_sorted.length; ++i)
	{
		for(let j = i + 1; j < owners_sorted.length; ++j)
		{
			if(STATE.owners[owners_sorted[i]].length < STATE.owners[owners_sorted[j]].length)
			{
				const temp = owners_sorted[i]
				owners_sorted[i] = owners_sorted[j]
				owners_sorted[j] = temp
			}
		}
	}

	const html = []
	html.push("<center>")
	html.push("<table>")
	html.push("<tr><td class='header'>Account</td><td class='header'># Tokens</td></tr>")
	owners_sorted.forEach((id) => {
		const display_id = (id == "--") ? "<i>mintable</i>" : id
		html.push("<tr><td class='item fixedw'>" + display_id + "</td><td class='item'>" + STATE.owners[id].length + "</td></tr>")
		// console.log(id, STATE.owners[id].length)
	})
	html.push("</table>")
	html.push("</center>")
	return html
}

const blockchain_query = (callback, path) => {
	const xhr = new XMLHttpRequest()
	xhr.open("GET", "https://devnet-gateway.elrond.com" + path, true)
	xhr.onreadystatechange = (data) => {
		if(data.target.readyState == 4)
		{
			callback(JSON.parse(data.target.responseText))
		}
	}
	xhr.send()
}

const deferred_update = () => {
	if(STATE.pin) explore(STATE.pin)
}

const mint = (id) => {
	const token_id = STATE.locations[id].x + '@' + STATE.locations[id].y
	const here = document.location.href
	const target = (
		"https://devnet-wallet.elrond.com/hook/transaction?"
		+ "receiver=" + MINTING_CONTRACT
		+ "&"
		+ "value=" + MINTING_MIN_VALUE
		+ "&"
		+ "gasLimit=" + MINTING_GAS_LIMIT
		+ "&"
		+ "data=mint@" + token_id
		+ "&"
		+ "callbackUrl=" + here
	)
	window.location.href = target
}

const donate = (id) => {
	const receiver = prompt('Donate ' + STATE.locations[id].name + ' to:')
	if(receiver.length == 0) return
	const here = document.location.href
	fetch((text) => {
		const target = (
			"https://devnet-wallet.elrond.com/hook/transaction?"
			+ "receiver=" + STATE.address
			+ "&"
			+ "value=" + "0"
			+ "&"
			+ "gasLimit=" + MINTING_GAS_LIMIT
			+ "&"
			+ "data=" + (
				"ESDTNFTTransfer"
				+ "@" + TOKEN
				+ "@" + STATE.nonces[id]
				+ "@" + "01"
				+ "@" + text /* receiver from bech32 to hex */
			)
			+ "&"
			+ "callbackUrl=" + here
		)
		window.location.href = target
	}, "/buchavissent/debech32.rx?" + STATE.address);
}

