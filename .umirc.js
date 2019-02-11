const path = require('path');

const server = 'http://localhost:3000';

// ref: https://umijs.org/config/
export default {
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: false,
        dll: true,
        routes: {
          exclude: [
            /model\.(j|t)sx?$/,
            /service\.(j|t)sx?$/,
            /models\//,
            /components\//,
            /services\//,
          ],
        },
        hardSource: false,
      },
    ],
  ],
  alias: {
    '@components': path.resolve(__dirname, 'src/components'),
    '@utils': path.resolve(__dirname, 'src/utils'),
    '@service': path.resolve(__dirname, 'src/service'),
    '@models': path.resolve(__dirname, 'src/models'),
    // themes:path.resolve(__dirname,'src/themes'),
    '@images': path.resolve(__dirname, 'src/assets'),
    "@":path.resolve(__dirname,'src'),
  },
  cssModulesExcludes: ['.module.css','iconfont.css','global.css'],
  proxy: {
    "/api": {
      "target": 'http://192.168.1.118:3000',
      "changeOrigin": true,
      "pathRewrite": { "^/api" : "" }
    }
  }
  
  // chainWebpack(config, { webpack }) {
  //   config.merge({
  //     resolve: {
  //       alias: {
  //         '@': path.resolve(__dirname, './src'),
  //         "utils": path.resolve(__dirname,"./src/utils"),
  //         "@service": path.resolve(__dirname,"./src/service"),
  //       },
  //     },
  //     devServer: {
  //       contentBase: path.join(__dirname, 'dist'),
  //       compress: true,
  //       host: '192.168.1.118',
  //       port: 9000,
  //     },
  //   });
  // },
};
