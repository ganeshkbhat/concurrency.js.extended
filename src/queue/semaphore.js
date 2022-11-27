const { Queue } = require("./queue");

function Semaphore(initialValue) {
  this.count;
  this.awaiters = new Queue();
  this.count = initialValue;

  /**
   * Decrement the semaphore
   */
  async function P() {
    this.count--;
    if (this.count < 0) {
      // accept should be a function
      await new Promise((accept) => {
        this.awaiters.enqueue(accept);
      });
    }
  }

  /**
   * Increment the semaphore
   */
  function V() {
    this.count++;
    if (this.count <= 0) {
      setImmediate(this.awaiters.dequeue());
    }
  }

  async function use(thunk) {
    try {
      await this.P();
      await thunk();
    } finally {
      this.V();
    }
  }

  function value() {
    return this.count;
  }
}

module.exports.Semaphore = Semaphore;
