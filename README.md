<p align="center">
    <img src="https://avatars.githubusercontent.com/u/164861142?s=200&v=4"
    alt="Micanto Logo"
    height="200">
</p>

<p align="center">
    <img src="https://www.andrerinas.de/micantoapp.png"
    alt="appscreens"
    width="600" />
</p>

# Micanto APP
This is an react native app for playing your own tracks via the <a href="https://github.com/micanto-music/micanto">Micanto-Backend</a>.

## Features
- Play tracks from your device anywhere
- Works on Android, iOS not yes, because I don't have a iOS device
- Android Auto Support with Speech Search

## Contribute/Build yourself
- Clone this repository
- `yarn install`
- Setup React Native: https://reactnative.dev/docs/environment-setup
- `yarn start` to start the metro server and test with an emulator
- For your local host you can use the Android localhost ip as follows. If your micanto server runs on http://localhost:3000, you set the host in your app to http://10.0.2.2:3000
- connect your phone via USB and call `yarn build` to build and deploy directly to your device

## Any Bug or Idea?
Please open new issues here: https://github.com/micanto-music/app/issues

## Special Thanks
Many many thanks to 
- lovegaoshi (https://github.com/lovegaoshi) for his android auto fork of react native track player
- doublesymmetry (https://github.com/doublesymmetry) for the track player
- Podverse (https://github.com/podverse/podverse-rn) for the implementation of trackplayer with android auto support. I reused some of their excellent work!

## Changelog
**1.0.0** - Initial Release
