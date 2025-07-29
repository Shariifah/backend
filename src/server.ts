// import 'module-alias/register';
import app from "./app";
import { connectDB } from "./configs/database";
import config from "./configs/config";

const PORT = config.appPort;

(async () => {
  await connectDB();
})();

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`🕹️  Environnement:  ${config.nodeEnv}`);
});
