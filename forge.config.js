const join = require("path").join;

module.exports = {
    packagerConfig: {
        asar: {
            unpack: "**/node_modules/node-notifier/vendor/**"
        },
        extraResource: "src/assets/icons",
        icon: join(__dirname, "/src/assets/icons/Eagluet.png"),
        overwrite: true,
        //ignore file to be packaged
        ignore: [
            "forge.config.js",
            ".gitignore",
            ".eslintrc.json",
            ".eslintignore",
            ".github"
        ]
    },
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                name: "Eagluet",
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
        }
    ]
}