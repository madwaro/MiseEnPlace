import sketch from 'sketch'
import { utils } from './utils.js'

export function sortArtboards(context) {
	const document = sketch.fromNative(context.document)
	if (!document) {
		// During developing, every time I save the script executes with a null
		// document.

		return
	}

	const page = document.selectedPage
	if (page.layers.length > 0) {
		rearrangeArtboardsInPage(page)
	}

	utils.toast('Artboards are in place!')
}

export function sortRenameArtboards(context) {
	const document = sketch.fromNative(context.document)
	if (!document) {
		// During developing, every time I save the script executes with a null
		// document.

		return
	}

	sketch.UI.getInputFromUser(
		"Rename artboards with the following prefix",
		{
			initialValue: "Artboard"
		},
		(err, value) => {
			if (err) {
				// User cancelled

				return
			}

			const page = document.selectedPage
			if (page.layers.length > 0) {
				rearrangeArtboardsInPage(page)
				renameArtboardsInPage(page, value)
			}

			utils.toast('Artboards are in place!')
		})
}

function rearrangeArtboardsInPage(page) {
	utils.log(`Rearranging ${page.layers.length} artboards`)

	// Create a copy of the array so we can work on it in Javascript
	var layers = getLayersInPage(page)

	// Sort layers according to their x, y coordinates. Top left corner wins and
	// then it goes into a Z pattern.
	layers.sort(function (a, b) {
		const aX = a.frame.x
		const aY = a.frame.y
		const bX = b.frame.x
		const bY = b.frame.y

		const deltaX = aX - bX
		const deltaY = aY - bY

		let result = 0

		// When both layers are on the same column, then sort based on their
		// y-position
		if (deltaX == 0) {
			result = deltaY
		}
		// When both layers are on the same row, then sort based on their x-position
		else if (deltaY == 0) {
			result = deltaX
		}
		// When layer a is before in both x & y axis, it goes first
		else if (deltaX < 0 && deltaY < 0) {
			result = -2
		}
		// When layer b is after layer in the x-axis, but before in the y-axis, it
		// goes first
		else if (deltaY < 0) {
			result = -1
		}
		// Otherwise, it goes later
		else {
			result = 1
		}

		utils.log(`a[${a.name}]=(${aX}, ${aY}); b[${b.name}]=(${bX}, ${bY}); deltaX: ${deltaX}; deltaY: ${deltaY}; result=${result}`)

		return result
	})

	// Iterate the sorted array from the bottom and move each layer to the front.
	// At the end of, everything will be sorted.
	for (var i=layers.length-1; i >=0; i--) {
		let layer = layers[i]
		let oldIndex = layer.index

		layer.moveToFront()

		utils.log(`${layer.name} (${layer.frame.x}, ${layer.frame.y})`)
	}
}

function renameArtboardsInPage(page, prefix) {
	utils.log(`Renaming ${page.layers.length} artboards`)

	// Create a copy of the array so we can work on it in Javascript
	var count = 1
	getLayersInPage(page, true).reverse().forEach(l => {
		var newName = `${prefix} ${count++}`
		l.name = newName
	})
}

function getLayersInPage(page, onlyArtboards) {
	return onlyArtboards ?
		page.layers.filter(l => l instanceof sketch.Artboard).map(l => l) :
		page.layers.map(l => l)
}
