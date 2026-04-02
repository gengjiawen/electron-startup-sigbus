module.exports = {
  packagerConfig: {
    asar: false
  },
  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin']
    }
  ]
}
