import sketch from 'sketch'

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
      log(`Processing artboard ${layer.name}`)
      processGroup(layer)
    }
  })

	toast('Done')
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
    }
  }

  rename(group)
}

function processSymbolInstance(instance) {
  // When detaching, the resulting group gets "Copy" appended to the name.
  const realName = instance.name
  log(`Detaching ${realName}`)

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
    var newName = name
    var re = / (\d+)$/
    var results = re.exec(name)
    if (results) {
      var currentCopy = parseInt(results[1])
      newName = `${name} ${currentCopy + 1}`
    } else {
      newName = `${name} 2`
    }
  }

  uniqueNames[newName] = newName

  return newName
}





// Abstract this duplicated coordinates
function log(text) {
	// Uncomment the following line to enable logs.
	// Open Console and filter entries using "Mise en place"

	// console.log(`Mise en place: ${text}`)
}

function toast(text) {
	sketch.UI.message(`Mise en place: ${text}`)
}
