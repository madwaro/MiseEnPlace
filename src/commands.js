import sketch from 'sketch'

export default function () {
	const document = sketch.getSelectedDocument()
	if (!document) {
		// During developing, every time I save the script executes with a null document.

		return
	}

	const page = document.selectedPage
	const layers = page.layers
	const layerCount = layers.length

	if (page.layers.length == 0) {
		toast('No layers in this page. Done!')

		return
	}

	rearrange(page)

	toast('Done')
}

function rearrange(page) {
	log(`Rearranging ${page.layers.length} items`)

	// Create a copy of the array so we can work on it in Javascript
	var layers = []
	page.layers.forEach((a) => {
		layers.push(a)
	})

	// Sort layers according to their x, y coordinates. Top left corner wins and then
	// it goes into a Z pattern.
	layers.sort(function (a, b) {
		const aX = a.frame.x
		const aY = a.frame.y
		const bX = b.frame.x
		const bY = b.frame.y

		const deltaX = aX - bX
		const deltaY = aY - bY

		let result = 0
		if (deltaX == 0) {
			result = deltaY
		} else if (deltaY == 0) {
			result = deltaX
		} else if (deltaX < 0 && deltaY < 0) {
			result = -2
		} else if (deltaY <0) {
			result = -1
		} else {
			result = 1
		}

		log(`a[${a.name}]=(${aX}, ${aY}); b[${b.name}]=(${bX}, ${bY}); deltaX: ${deltaX}; deltaY: ${deltaY}; result=${result}`)

		return result
	})

	// Iterate the sorted array from the bottom and move each layer to the front. At the end of, everything will be sorted.
	for (var i=layers.length-1; i >=0; i--) {
		let layer = layers[i]
		let oldIndex = layer.index

		layer.moveToFront()

		log(`${layer.name} (${layer.frame.x}, ${layer.frame.y}), oldIndex:${oldIndex}, newIndex:${i}`)
	}
}

function log(text) {
	// Uncomment the following line to enable logs. 
	// Open Console and filter entries using "Mise en place"

	console.log(`Mise en place: ${text}`)
}

function toast(text) {
	sketch.UI.message(`Mise en place: ${text}`)
}