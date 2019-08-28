import sketch from 'sketch'
import { sortArtboards } from './sortArtboards.js'
import { utils } from './utils.js'

export function onDocumentSaved(context) {
	const actionContext = context.actionContext
  const document = sketch.fromNative(actionContext.document)

	if (document.selectedPage.name == 'Symbols') {
		utils.log('Skipping Symbols page')
		return
	}

	sortArtboards(actionContext)
}
