const Cluster = require("discord-hybrid-sharding");
const { token } = require("./src/config/config.json");

const manager = new Cluster.ClusterManager(`${__dirname}/index.js`, {
    totalShards: 'auto',
    shardsPerClusters: 2,
    token: token,
});

manager.extend(
    new Cluster.HeartbeatManager({
        interval: 10000,
        maxMissedHeartbeats: 5,
    }),
);

manager.on('clusterCreate', (cluster) => {
    console.log(`[CLUSTERS] => Launched Cluster #${cluster.id}`);
    cluster.on('error', (e) => {
        console.log(`[CLUSTER #${cluster.id}] => [ERROR] => ${e}`);
    });
    cluster.on('disconnect', function () {
        console.log(`[CLUSTER #${cluster.id}] => Disconnected`);
    });
    cluster.on('reconnecting', function () {
        console.log(`[CLUSTER #${cluster.id}] => Reconnecting....`);
    });
    cluster.on('close', function (code) {
        console.log(`[CLUSTER #${cluster.id}] => [CLOSE] => ${code}`);
    });
    cluster.on('exit', function (code) {
        console.log(`[CLUSTER #${cluster.id}] => [EXIT] => ${code}`);
    });
});

manager.once('debug', (d) => {
    console.log(`[CLUSTERS MANAGER] => ${d}`);
});

manager.spawn({ timeout: -1 });

console.clear()