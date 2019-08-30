import sketch from 'sketch'
import { sortArtboards } from './sortArtboards.js'
import { utils } from './utils.js'

export function onArtboardChanged(context) {
	const actionContext = context.actionContext
	const document = sketch.fromNative(actionContext.document)

	if (document.selectedPage.name == 'Symbols') {
		utils.log('Skipping Symbols page')
		return
	}

	utils.verboseLog(`${context.action}: new: ${actionContext.newArtboard} old: ${actionContext.oldArtboard}`)
	sortArtboards(actionContext)
}

export function onLayersMoved(context) {
	const layers = context.actionContext.layers

	var atLeastOneArtboard = false
	for (var i=0; i < layers.length; i++) {
		if (layers[i].className() == 'MSArtboardGroup') {
			utils.verboseLog('Found one artboard in the layer move')
			atLeastOneArtboard = true
			break
		}
	}

	if (atLeastOneArtboard) {
		sortArtboards(context.actionContext)
	}
}
