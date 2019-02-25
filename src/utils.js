class Utils {
  log(text) {
    // Uncomment the following line to enable logs.
  	// Open Console and filter entries using "Mise en place"

  	console.log(`Mise en place: ${text}`)
  }

  toast(text) {
    sketch.UI.message(`Mise en place: ${text}`)
  }
}

export let utils = new Utils()
