const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");
const deps = require("./package.json").dependencies;
const webpack = require("webpack");
const dotenv = require("dotenv");

const modes = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
};

module.exports = () => {
  const mode = process.env.NODE_ENV;
  const isProduction = mode === 'production'

  const plugins = [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html"),
      // favicon: path.join(__dirname, "public", "images", "favicon.ico"),
    }),
    new ModuleFederationPlugin({
      name: "container",
      remotes: {
        app1: "app1@http://localhost:3001/remoteEntry.js",
        app2: "app2@http://localhost:3002/remoteEntry.js"
      },
      shared: {
        ...deps,
        react: { singleton: true, eager: true, requiredVersion: deps.react },
        "react-dom": {
          singleton: true,
          eager: true,
          requiredVersion: deps["react-dom"],
        },
        "react-router-dom": {
          singleton: true,
          eager: true,
          requiredVersion: deps["react-router-dom"],
        },
      },
    }),
  ];

  if (!isProduction) {
    const env = dotenv.config().parsed;

    const envKeys = Object.keys(env).reduce((prev, next) => {
      prev[`process.env.${next}`] = JSON.stringify(env[next]);
      return prev;
    }, {});
    plugins.push(new webpack.DefinePlugin(envKeys))
  }

  if (isProduction) {
    plugins.push(
        new MiniCssExtractPlugin({
          filename: "[name].[contenthash].css",
          chunkFilename: "[id].[contenthash].css",
        }),
        new TerserPlugin(),
        new webpack.DefinePlugin({
          'process.env': {
            KEYCLOAK_URL: JSON.stringify(process.env.KEYCLOAK_URL),
            KEYCLOAK_REALM: JSON.stringify(process.env.KEYCLOAK_REALM),
            KEYCLOAK_CLIENT_ID: JSON.stringify(process.env.KEYCLOAK_CLIENT_ID),
            BASE_URL_API: JSON.stringify(process.env.BASE_URL_API),
          }
        })
    );
  }

  return {
    mode,
    entry: path.join(__dirname, "src", "index.tsx"),
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".jsx"],
      preferAbsolute: true,
      modules: [path.resolve(__dirname, "src"), "node_modules"],
      alias: {},
    },
    output: {
      filename: "bundle.js",
      path: path.join(__dirname, "build"),
      //publicPath: "/",
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "ts-loader",
            options: {
              configFile: path.join(__dirname, "tsconfig.json"),
            },
          },
        },
        {
          test: /\.module\.css$/i,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: "[name]__[local]___[hash:base64:5]",
                },
                importLoaders: 1,
              },
            },
          ],
        },
        {
          test: /\.css$/i,
          exclude: /\.module\.css$/,
          use: [isProduction ? MiniCssExtractPlugin.loader : "style-loader", "css-loader"],
        },

        {
          test: /\.(png|jp(e*)g|gif|webp|avif)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                publicPath: "../",
                name: `public/images/[name].[ext]`,
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          use: ["@svgr/webpack"],
        },
      ],
    },
    plugins,
    performance: {
      maxEntrypointSize: Infinity,
      maxAssetSize: 1024 ** 2,
    },
    devtool: isProduction ? "source-map" : "inline-source-map",
    devServer: {
      port: 3000,
      open: true,
      allowedHosts: 'all',
      historyApiFallback: true,
      hot: true,
      client: {
        overlay: {
          errors: true,
          warnings: true,
        },
        progress: true,
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  };
};
