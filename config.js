const config = {};

config.host = process.env.HOST || "https://frc-cc-test.documents.azure.com:443/";
config.authKey =
  process.env.AUTH_KEY || "1luSiRzPbeyID3jRLoNK8aNn00q10ktdx1CfBqbcrwMcPY9cVm1Lgxu7Pwtswmgz2KsJGdrfSvtqACDbKCcpmQ==";
config.databaseId = "frc_prototype";
config.containerId = "exemptions";

if (config.host.includes("https://localhost:")) {
  console.log("Local environment detected");
  console.log("WARNING: Disabled checking of self-signed certs. Do not have this code in production.");
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.log(`Go to http://localhost:${process.env.PORT || '3000'} to try the sample.`);
}

module.exports = config;