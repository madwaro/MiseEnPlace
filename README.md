Mise En Place is a Sketch plug-in that helps you prep before you start cooking
your designs.

# Re-title Layers

Cleans up layer names removing path information, and the word copy.

For example, a layer named `Misc/Button/SolidWithButton` gets renamed to
`SolidWithButton`.

# Sort artboards

I got tired of arranging artboards in the layer list to match the order I saw in
the canvas. Provided the artboards are aligned to each other, *Sort artboards*
looks at their position and sorts the layer list; placing the top-left-most
artboard at the top of the list and the bottom-right-most artboard at the end.

Shortcut: `CTRL OPTION COMMAND S`

# Sort and rename artboards

Same as *Sort artboards* but you can rename artboards using a prefix.

Shortcut: `CTRL OPTION COMMAND R`

# Sort layers

Same magic but for layers. Select some layers, make sure they are aligned to the top
or to the right, and then run this command.

Shortcut: `SHIFT CTRL OPTION COMMAND S`

# Sort and rename Layers

Same as *Sort layers* but you can rename layers using a prefix.

Shortcut: `SHIFT CTRL OPTION COMMAND R`

# Prepare page motion in Principle

Going from Sketch to Principle requires a bit of preparation. For example, you
need to make sure your layers are grouped and named correctly. When you import
your Sketch designs into Principle, Principle renames layers having the same
name. Principle uses artboards as different states in a motion sequence. It
helps by interpolating changes in layers found in two different states; to do
that, Principle relies on layers having the same name across states. However,
when there is more than one distinct layer in the same state having the same
name, Principle intervenes and renames them to ensure every layer has a unique
name. Layers nested in symbol instances are particularly affected; for example,
a list of symbol instances may repeat layers like _Text_ or _Background_, and
when they get imported to Principle, you'll end up with names like _Text 14_ and
_Background 14_.

When importing a Sketch document, Principle skips over hidden layers. You may
find the hard way a layer didn't get imported when you want to animate it. Going
back to your Sketch document to re-import it is not always an easy task.

Another problem is that symbol instances sometimes don't port correctly into
Principle. In some cases, there are some weird layout issues in Principle.

*Prepare page motion in Principle* helps you preparing your page in the
following ways:

- Duplicates the page you want to prepare before importing it in Principle
  keeping your original design intact.
- Detaches all symbol instances.
- Unhides all hidden layers but sets their opacity to 0. Visually, it's the same
  effect but these get imported into Principle. You'll see a 👁  when this
  happens.
- Renames all layers to ensure unique names even for nested layers in symbols.

# Support

If you find this plugin helpful, or would like to support my plugins in general, buy me ☕️ via <a href="https://paypal.me/madwaro">PayPal</a>.

# License

Copyright (c) 2019 Carlos Madrigal (Madwaro). See LICENSE.md for further details.
