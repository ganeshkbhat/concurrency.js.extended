const { Queue, AsyncQueue } = require("./queue/queue.js");
const { Semaphore } = require("./queue/semaphore.js");
const processes = require("./processes.js");
const threading = require("./threading.js");


module.exports.Queue = Queue;
module.exports.Semaphore = Semaphore;
module.exports.AsyncQueue = AsyncQueue;

module.exports.processes = processes;
module.exports.threading = threading;
module.exports.default = { Queue, AsyncQueue, Semaphore };
