const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
console.log("--- DEBUG: webpack.config.js wird geladen! ---"); // FÜGE DIES HINZU

// HIER DEFINIEREN WIR DEN ABSOLUTEN PFAD ZUM LOADER
// BITTE ANPASSEN, SOBALD DU DEN GENAUEN PFAD BESTÄTIGT HAST!
// Beispiel:
const SLYKE_LOADER_PATH = path.resolve(
  __dirname,
  "../../packages/slyke-loader/src/index.js"
);
// ^^^^ ERSETZE DIESEN PFAD MIT DEM VON DIR BESTÄTIGTEN ABSOLUTEN PFAD ZU DEINEM LOADER ^^^^

module.exports = {
  // Der Einstiegspunkt für deine Anwendung
  entry: "./src/index.js",

  // Ausgabe-Konfiguration
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },

  // resolveLoader ist jetzt optional/auskommentiert, da wir den Loader direkt referenzieren
  // resolveLoader: {
  //   modules: [
  //     'node_modules',
  //     path.resolve(__dirname, '../../packages/slyke-loader/src'),
  //     path.resolve(__dirname, '../../packages/slyke-loader')
  //   ],
  // },

  // Module-Regeln
  module: {
    rules: [
      {
        test: /\.sk$/, // Regel für Slyke-Dateien
        use: {
          loader: SLYKE_LOADER_PATH, // <--- HIER DIREKT DEN ABSOLUTEN PFAD NUTZEN
          options: {
            // Hier könnten Optionen für deinen Slyke-Compiler übergeben werden
          },
        },
      },
      {
        test: /\.css$/, // Regel für CSS-Dateien
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  // Plugins
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
      filename: "index.html",
    }),
  ],

  // Entwicklungsserver-Konfiguration
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 8081,
    open: true,
    hot: true,
  },

  // Um .sk-Dateien bei Imports aufzulösen
  resolve: {
    extensions: [".sk", ".js", ".json"],
  },

  // Source Maps für besseres Debugging
  devtool: "eval-source-map",
};
