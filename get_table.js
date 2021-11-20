
const fetch = (callback, url) => {
	const xhr = new XMLHttpRequest()
	xhr.open("GET", url, true)
	xhr.onreadystatechange = () => {
		if(xhr.readyState == 4)
		{
			callback(xhr.responseText)
		}
	}
	xhr.send()
}



