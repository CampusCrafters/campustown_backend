module.exports = {
    apps: [
      {
        name: "primary-backend",
        script: "./src/app.ts",
        interpreter: "ts-node",
        env: {
          NODE_ENV: "development",
        },
        env_production: {
          NODE_ENV: "production",
        },
      },
    ],
  };
  