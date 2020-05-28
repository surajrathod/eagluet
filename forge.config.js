const join = require("path").join;

module.exports = {
    packagerConfig: {
        asar: {
            unpack: "**/node_modules/node-notifier/vendor/**"
        },
        extraResource: "src/assets/icons",
        icon: join(__dirname, "/src/assets/icons/focus.png"),
        overwrite: true
    },
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                name: "eagluet",
                iconUrl: join(__dirname, "/src/assets/icons/focus.ico")
            }
        },
        {
            name: "@electron-forge/maker-zip",
            platforms: [
                "darwin"
            ]
        },
        {
            name: "@electron-forge/maker-deb",
            config: {}
        },
        {
            name: "@electron-forge/maker-rpm",
            config: {}
        }
    ]
}