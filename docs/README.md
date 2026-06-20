<p align="center">
  <img src="./cloudcord-logo.png" width="420" alt="CloudCord Logo">
</p>

<h1 align="center">CloudCord</h1>

<p align="center">
  RainTweak native loader + Kettu runtime + CloudCord branding.
</p>

<p align="center">
  <img src="./cloudcord-favicon.png" width="96" alt="CloudCord Icon">
</p>

## This ZIP

Everything is in the root of the ZIP. There are no folders.

All original paths were flattened using `__`.

Examples:

- `native-ios__Sources__Tweak.x`
- `runtime__src__index.ts`
- `runtime__src__core__plugins__notrack__index.ts`
- `cloudcord-official-plugins__builds__fakeprofile__index.js`

## Included bases

- RainTweak native iOS loader, rebranded into CloudCordTweak
- Kettu JavaScript runtime and plugin system
- CloudCord logos and favicon
- CloudCord official plugin source pack

## CloudCord official plugins included

- FakeProfile
- NoTrack
- MessageFix
- QuickInstall
- CloudCordEnhancements
- BadgeTools

Some plugins are included as source modules from Kettu and need bundling before being used as external plugins.

## Assets

- `cloudcord-logo.png`
- `cloudcord-favicon.png`

## Plugin source format

Recommended hosted source:

```txt
https://raw.githubusercontent.com/BypassHub-EX/cloudcord-plugins/main/
```

Legacy direct plugin source style:

```txt
https://raw.githubusercontent.com/BypassHub-EX/fake-profile/main/
```

## Build note

This is source, not a compiled IPA.

To create an IPA, you need a base Discord/Raincord/Kettu IPA, the compiled CloudCord tweak/runtime, and signing.
