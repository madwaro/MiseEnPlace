import sketch from 'sketch'
import { utils } from './utils.js'

let strategies = {
  KEEP_FIRST_COMPONENT: 'keep_first_component',
  KEEP_LAST_COMPONENT: 'keep_last_component',
  REMOVE_EXTRA_WHITESPACE: 'remove_extra_whitespace'
}

export function retitleLayersFirst(context) {
  retitleLayers(context, strategies.KEEP_FIRST_COMPONENT)
}

export function retitleLayersLast(context) {
  retitleLayers(context, strategies.KEEP_LAST_COMPONENT)
}

export function removeExtraSpacesFromPathName(context) {
  retitleLayers(context, strategies.REMOVE_EXTRA_WHITESPACE)
}

function retitleLayers(context, strategy) {
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
    var name = layer.name

    if (strategy == strategies.KEEP_FIRST_COMPONENT || strategy == strategies.KEEP_LAST_COMPONENT) {
      name = dropPathFromName(layer.name, strategy)
      name = dropCopyFromName(name)
    } else if (strategy == strategies.REMOVE_EXTRA_WHITESPACE) {
      name = removeExtraWhiteSpaces(name)
    }

    layer.name = name.trim()

    utils.verboseLog(`${name}`)
  })

  utils.toast('Look at those layer titles!')
}

function dropPathFromName(name, strategy) {
  const regex = strategy == strategies.KEEP_FIRST_COMPONENT ? /([^\/]+)\// : /.*\/(.*)$/gm

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

function removeExtraWhiteSpaces(pathName) {
  return pathName.split('/').map(c => c.trim()).join('/')
}
