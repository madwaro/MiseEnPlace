import sketch from 'sketch'
import { utils } from './utils.js'

var uniqueNames = {}

export default function() {
  const document = sketch.getSelectedDocument()
  if (!document) {
    // During developing, every time I save the script executes with a null
		// document.

    return
  }

  const page = document.selectedPage

  var duplicatedPage = page.duplicate()
  duplicatedPage.name = `Ready for Principle - ${duplicatedPage.name}`
  const layers = duplicatedPage.layers

  layers.forEach((layer) => {
    if (layer instanceof sketch.Artboard) {
      utils.log(`Processing artboard ${layer.name}`)
      processGroup(layer)
    }
  })

	utils.toast('Done')

  utils.debugLog(`Names: ${JSON.stringify(uniqueNames)}`)
}

function processGroup(group) {
  const layers = group.layers
  const layerCount = layers.length

  for (var i=0; i<layerCount; i++) {
    let layer = layers[i]

    if (layer instanceof sketch.Group) {
      processGroup(layer)
    } else if (layer instanceof sketch.SymbolInstance) {
      processSymbolInstance(layer)
    } else {
      rename(layer)
      processHidden(layer)
    }
  }

  rename(group)
  processHidden(group)
}

function processHidden(layer) {
  if (!layer.hidden) {
    return
  }

  layer.hidden = false
  layer.style.opacity = 0
  layer.name = `👁  ${layer.name}`
}

function processSymbolInstance(instance) {
  // When detaching, the resulting group gets "Copy" appended to the name.
  const realName = instance.name
  utils.log(`Detaching ${realName}`)

  var group = instance.detach({
    recursively: true
  })

  if (group) {
    group.name = realName
    processGroup(group)
  }
}

function rename(layer) {
  var names = []

  var newLayer = layer
  while (!(newLayer instanceof sketch.Artboard)) {
    names.push(newLayer.name)
    newLayer = newLayer.parent
  }

  var newName = names.reverse().join('_')
  layer.name = getUniqueName(newName)
}

function getUniqueName(name) {
  var newName = name

  if (uniqueNames[newName]) {
    utils.verboseLog(`Not unique: ${newName}`)

    var newName = name
    var re = /(.+) (\d+)$/
    var results = re.exec(name)
    if (results) {
      var currentCopy = parseInt(results[2])

      const oldName = newName

      newName = newName.replace(re, '$1')
      newName = `${newName} ${currentCopy + 1}`

      utils.verboseLog(`    Has number: ${oldName} (${currentCopy}) --> ${newName}`)
    } else {
      newName = `${name} 2`

      utils.verboseLog(`    First duplicate, bump it to 2: ${newName}`)
    }

    newName = getUniqueName(newName)
  } else {
    utils.verboseLog(`Unique already: ${newName}`)
  }

  uniqueNames[newName] = newName

  return newName
}
