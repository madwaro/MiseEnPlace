import sketch from 'sketch'
import { utils } from './utils.js'

export function sortLayers(context) {
  const document = sketch.fromNative(context.document)
	if (!document) {
		// During developing, every time I save the script executes with a null
		// document.

		return
	}

  bootstrap(document, null)
}

export function sortRenameLayers(context) {
  const document = sketch.fromNative(context.document)
	if (!document) {
		// During developing, every time I save the script executes with a null
		// document.

		return
	}

  sketch.UI.getInputFromUser(
    "Rename layers with the following prefix",
    {
      initialValue: "Item"
    },
    (err, value) => {
      if (err) {
        // User cancelled

        return
      }

      const page = document.selectedPage
      if (page.layers.length > 0) {
        bootstrap(document, value)
      }

      utils.toast('Layers are in place!')
    })
}

function bootstrap(document, newName) {
  const selection = document.selectedLayers
  if (selection.isEmpty) {
    utils.toast('Empty selection')
    return
  }

  const firstElement = selection.layers[0]
  var sameColumn = true
  var sameRow = true
  selection.forEach((layer) => {
    const frame = layer.frame
    sameColumn = sameColumn && frame.x == firstElement.frame.x
    sameRow = sameRow && frame.y == firstElement.frame.y

    utils.verboseLog(`Width: ${frame.width}`)
  })
  utils.verboseLog(`SameColumn: ${sameColumn} SameRow: ${sameRow}`)

  const layers = selection.layers
  if (sameColumn) {
    sortColumn(layers, newName)
  } else if (sameRow) {
    sortRow(layers, newName)
  } else {
    utils.toast('Align these layers to the right or top to rearrange them.')
    return
  }

	utils.toast('Layers are in place!')
}

function sortColumn(layers, newName) {
  arrange(newName, layers.map(l => { return { sortBy: l.frame.y, layer: l } }))
}

function sortRow(layers, newName) {
  arrange(newName, layers.map(l => { return { sortBy: l.frame.x, layer: l } }))
}

function arrange(newName, descriptors) {
  const sorted = descriptors.sort((a, b) => b.sortBy - a.sortBy)

  var equalizedName = newName != null ? newName.trim() : null
  equalizedName = equalizedName == "" ? null : equalizedName

  for (var i=0; i < sorted.length; i++) {
    const layer = sorted[i].layer
    layer.index = i
    if (equalizedName) {
      const nameIndex = sorted.length - i
      layer.name = `${equalizedName} ${nameIndex}`
    }

    utils.verboseLog(`Ordered y: ${sorted[i].sortBy}  --  ${layer.index}  ${layer.name}`)
  }
}
