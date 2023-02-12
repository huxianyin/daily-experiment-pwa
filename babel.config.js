module.exports = {
    presets:[
        "@babel/preset-env",
        "@babel/preset-react"
    ],
    "env": {
        "production": {
            "plugins": [
                "@babel/plugin-transform-react-jsx"
              ]
        }
      }
}