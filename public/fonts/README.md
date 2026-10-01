# Het Archief - icon font

## General

Het Archief contains 2 separate fonts:

- meemoocons-light
- meemoocons-solid

These fonts are managed by Jan Nikolaas. The latest versions can be found on [SHD Google drive](https://drive.google.com/drive/u/0/folders/1D-kfW7S04PuDshA9OzgUM00_NiTJ4wcz?ths=true). 
If there are icons missing please ask him for them to be added to the fonts so they can be updated here.

## Usage

Every icon available in these fonts have a corresponding key in the [Icon.enums.ts](https://github.com/viaacode/hetarchief-client/blob/master/src/modules/shared/components/Icon/Icon.enums.ts)

## Cheatsheet

Each font has a preview page listing every icon in it together with the name you have to type:

- [meemoocons-light](./meemoocons-light/preview-icons.html)
- [meemoocons-solid](./meemoocons-solid/preview-icons.html)

These are plain files: no dev server, no build step, just open them in your browser. Click an icon to
copy its name.

The pages are generated from the font files themselves, so they always match what is actually in the
repo. **After updating a font, regenerate them:**

```
npm run update-icon-preview-page
```

The design cheatsheet in Figma can be found
[here](https://www.figma.com/design/6XPR2cvjzL76lxIT3zseFv/hetarchief.be-%E2%80%94-meemoocons?node-id=1-80).
Note that it can lag behind the fonts that are actually shipped, as can the
`*__names.png` images in the font folders.
