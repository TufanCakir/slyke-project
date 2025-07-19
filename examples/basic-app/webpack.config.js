const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // Der Einstiegspunkt für deine Anwendung
  // WICHTIG: Ändere dies auf './src/index.js' (wenn du die empfohlene JS-Einstiegsdatei nutzt)
  entry: "./src/index.js", // <--- Hier wahrscheinlich ÄNDERN!

  // Ausgabe-Konfiguration (wo die gebündelten Dateien landen sollen)
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },

  // Module-Regeln: Wie verschiedene Dateitypen behandelt werden sollen
  module: {
    rules: [
      {
        test: /\.sk$/, // Regel für Slyke-Dateien
        use: {
          loader: "slyke-loader",
          options: {
            // Hier könnten Optionen für deinen Slyke-Compiler übergeben werden
          },
        },
      },
      {
        test: /\.css$/, // Regel für CSS-Dateien
        use: ["style-loader", "css-loader"],
      },
      // Füge hier weitere Regeln für JavaScript hinzu, wenn du es brauchst
      // z.B. für die Transpilierung von ES6+ in älteres JS, wenn dein Compiler das nicht macht.
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: 'babel-loader',
      //     options: {
      //       presets: ['@babel/preset-env', '@babel/preset-react'] // @babel/preset-react für JSX/Preact's h()
      //     }
      //   }
      // }
    ],
  },

  // Plugins: Zusätzliche Funktionalitäten
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
    port: 8080,
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
