import sketch from 'sketch'
import { utils } from './utils.js'

export function retitleLayers(context) {
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
    var name = dropPathFromName(layer.name)
    name = dropCopyFromName(name)
    name = convertPascalCaseToSentenceCase(name)
    layer.name = name

    utils.verboseLog(`${name}`)
  })

  utils.toast('Look at those layer titles!')
}

function dropPathFromName(name) {
  const regex = /.*\/(.*)$/gm

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

function convertPascalCaseToSentenceCase(name) {
  const regex = /[0-9A-Z][^ 0-9A-Z]*/gm

  var newName = []

  var matches = null
  while ((matches = regex.exec(name)) != null) {
    if (matches.index === regex.lastIndex) {
      regex.lastIndex++
    }

    if (newName.length == 0) {
      newName.push(matches[0])
    } else {
      newName.push(matches[0].toLowerCase())
    }
  }

  return newName.length == 0 ? name : newName.join(' ')
}
