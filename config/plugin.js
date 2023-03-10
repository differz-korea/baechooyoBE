module.exports = ({ env }) => ({
  "users-permissions": {
    config: {
      jwt: {
        expiresIn: "7d",
      },
    },
  },
  // // enable a plugin that doesn't require any configuration
  // i18n: true,
  // // enable a custom plugin
  // myplugin: {
  //   // my-plugin is going to be the internal name used for this plugin
  //   enabled: true,
  //   resolve: './src/plugins/my-local-plugin',
  //   config: {
  //     // user plugin config goes here
  //   },
  // },
  // // disable a plugin
  // myotherplugin: {
  //   enabled: false, // plugin installed but disabled
  // },
  //   "google-auth": {
  //     enabled: true,
  //   },
  //   upload: {
  //     config: {
  //       provider: "aws-s3",
  //       providerOptions: {
  //         accessKeyId: env("SCALEWAY_ACCESS_KEY_ID"),
  //         secretAccessKey: env("SCALEWAY_ACCESS_SECRET"),
  //         endpoint: env("SCALEWAY_ENDPOINT"), // e.g. "s3.fr-par.scw.cloud"
  //         params: {
  //           Bucket: env("SCALEWAY_BUCKET"),
  //         },
  //       },
  //     },
  //   },
});
