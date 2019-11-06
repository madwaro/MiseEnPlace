import sketch from 'sketch'
import { utils } from './utils.js'

export function retitleLayersFirst(context) {
  retitleLayers(context, true)
}

export function retitleLayersLast(context) {
  retitleLayers(context, false)
}

function retitleLayers(context, keepFirst) {
  const document = sketch.fromNative(context.document)
	if (!document) {
		// During developing, every time I save the script executes with a null
		// document.

		return
	}

  const selection = document.selectedLayers
  if (selection.isEmpty) {
    utils.toast('Empty selection')
    return
  }

  selection.forEach((layer) => {
    var name = dropPathFromName(layer.name, keepFirst)
    name = dropCopyFromName(name)
    layer.name = name

    utils.verboseLog(`${name}`)
  })

  utils.toast('Look at those layer titles!')
}

function dropPathFromName(name, keepFirst) {
  const regex = keepFirst ? /([^\/]+)\// : /.*\/(.*)$/gm

  let matches = regex.exec(name)
  var newName = name
  if (matches) {
    newName = matches[1]
  }

  return newName
}

function dropCopyFromName(name) {
  const regex = /(.* )Copy ?(\d*)$/gm

  let matches = regex.exec(name)
  var newName = name
  if (matches) {
    let copyNumber = matches[2]
    if (copyNumber == '') {
      newName = `${matches[1]} 2`
    } else {
      newName = `${matches[1]} ${parseInt(copyNumber) + 1}`
    }
  }

  return newName
}
