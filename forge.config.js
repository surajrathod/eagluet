const join = require("path").join;

module.exports = {
    packagerConfig: {
        asar: {
            unpack: "**/node_modules/node-notifier/vendor/**"
        },
        extraResource: "src/assets/icons",
        icon: join(__dirname, "/src/assets/icons/Eagluet.png"),
        overwrite: true
    },
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                name: "eagluet",
                iconUrl: join(__dirname, "/src/assets/icons/Eagluet.ico"),
                setupIcon: join(__dirname, "/src/assets/icons/Eagluet.ico"),
                loadingGif: join(__dirname, "/src/assets/icons/Loading.gif")
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
            config: {
                options: {
                    icon: join(__dirname, "/src/assets/icons/Eagluet.png"),
                    name: "eagluet",
                    productName: "Eagluet"
                }
            }
        },
        {
            name: "@electron-forge/maker-rpm",
            config: {}
        }
    ],
    publishers: [
        {
            name: "@electron-forge/publisher-github",
            config: {
                prerelease: false,
                repository: {
                    name: "eagluet",
                    owner: "surajrathod"
                }
            }
        }
    ]
}