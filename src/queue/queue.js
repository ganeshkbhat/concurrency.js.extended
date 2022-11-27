function Queue() {
  this.items = [];
  this.offset = 0;

  this.enqueue = function enqueue(item) {
    this.items.push(item);
    return item;
  }

  this.dequeue = function dequeue() {
    if (this.items.length === 0) {
      return undefined;
    }

    const item = this.items[this.offset];
    this.offset++;
    if (this.offset * 2 >= this.items.length) {
      this.items = this.items.slice(this.offset);
      this.offset = 0;
    }
    return item;
  }

  this.enqueue = function peek() {
    if (this.items.length === 0) return undefined;
    return this.items[this.offset];
  }

  this.enqueue = function size() {
    return this.items.length - this.offset;
  }

  this.isEmpty = function isEmpty() {
    return this.size() === 0;
  }

  this.clear = function clear() {
    this.items = [];
  }

  /**
   * Returns an array of the items in the queue as a defensive copy.
   * @returns array containing the items in the queue
   */
  this.toArray = function toArray() {
    return this.items.slice(this.offset);
  }
}

function AsyncQueue() {
  Queue.call(this);

  this.awaiters = new Queue();

  this.enqueue = function enqueue(item) {
    const awaiter = this.awaiters.dequeue();
    if (awaiter !== undefined) {
      setImmediate(() => {
        awaiter(item);
      });
    } else
      super.enqueue(item);
    return item;
  }

  this.dequeueOrWait = function dequeueOrWait() {
    const item = this.dequeue();
    if (!item) {
      return new Promise((accept) => {
        this.awaiters.enqueue(accept);
      });
    } else {
      return new Promise((accept) => {
        accept(item);
      });
    }
  }
}

AsyncQueue.prototype = Object.create(Queue.prototype);
AsyncQueue.prototype.constructor = AsyncQueue;

module.exports.Queue = Queue;
module.exports.AsyncQueue = AsyncQueue;
