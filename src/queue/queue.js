function Queue() {
  this.items = [];

  // this.offset is used for
  // endLifo
  //   <==   [1,2,3,4]  <==
  this.offset = 0;

  this.enqueue = function enqueue(item) {
    this.items.push(item);
    return item;
  }
  this.push = this.enqueue;

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

  this.peek = function peek() {
    if (this.items.length === 0) return undefined;
    return this.items[this.offset];
  }

  this.size = function size() {
    return this.items.length - this.offset;
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

function QueueLowFootprint() {

  this.items = [];

  this.enqueue = function enqueue(item) {
    this.items.push(item);
    return item;
  }

  this.dequeue = function dequeue() {
    if (this.items.length === 0) {
      return undefined;
    }

    let item = this.items.shift();
    return item;
  }


  this.isEmpty = function isEmpty() {
    return this.size() === 0;
  }

  this.clear = function clear() {
    this.items = [];
  }

  this.peek = function peek(index = 0) {
    if (this.items.length === 0) return undefined;
    return this.items[index];
  }

  this.size = function size() {
    return this.items.length;
  }

  this.toArray = function toArray() {
    return this.items.slice(0, (this.items.length - 1));
  }

  this.insert = function insert(item, index) {
    this.items[index] = item;
    return item;
  }

  this.pop = function pop() {
    return this.items.pop();
  }

  this.remove = function remove(index) {
    this.items.splice(index, 1);
    return index;
  }

  this.removeItem = function removeItem(item) {
    this.items.splice(this.items.indexOf(item), 1);
    return item;
  }

  //   <==   [1,2,3,4]  <==
  this.endFifo = {
    enqueue: this.enqueue,
    dequeue: this.dequeue,

    add: (item) => this.insert(item, this.items.length),
    insert: (item) => this.insert(item, this.items.length),
    push: (item) => this.insert(item, this.items.length),
    insertAtIndex: this.insert,

    remove: this.dequeue,
    removeAtIndex: this.remove,
    removeItem: this.removeItem,
    pop: this.pop,

    size: this.size,
    peek: this.peek(0),
    seek: (index) => this.items[index],
    clear: this.clear
  };

  //   [1,2,3,4]  <==
  //              ==>
  this.endLifo = {
    enqueue: this.enqueue,
    dequeue: this.pop,

    add: this.enqueue,
    push: this.enqueue,
    insert: this.enqueue,
    insertAtIndex: this.insert,

    remove: this.pop,
    removeAtIndex: this.remove,
    removeItem: this.removeItem,
    pop: this.pop,

    size: this.size,
    peek: () => this.peek(this.items.length - 1),
    seek: (index) => this.items[index],
    clear: this.clear
  }

  //   ==>   [1,2,3,4]  ==>
  this.startLifo = {
    add: (item) => this.insert(item, 0),
    push: (item) => this.insert(item, 0),
    insert: (item) => this.insert(item, 0),

    insertAtIndex: this.insert,

    remove: this.pop,
    pop: this.pop,

    removeAtIndex: this.remove,
    removeItem: this.removeItem,

    clear: this.clear
  }

  //   ==> [1,2,3,4]
  //   <==
  this.startFifo = {
    add: (item) => this.insert(item, 0),
    push: (item) => this.insert(item, 0),
    insert: (item) => this.insert(item, 0),

    insertAtIndex: this.insert,

    remove: this.dequeue,
    pop: this.dequeue,

    removeAtIndex: this.remove,
    removeItem: this.removeItem,

    size: this.size,
    peek: () => this.peek(this.items.length - 1),
    seek: (index) => this.items[index],
    clear: this.clear
  }

  // Double Ended Queue
  //
  //   ==>   [1,2,3,4]  ==>
  // 
  //   <==   [1,2,3,4]  <==
  //
  //   <==   [1,2,3,4]
  //   ==>
  // 
  //   [1,2,3,4] <==
  //             ==>
  //
  this.doubleEnded = {
    start: {
      add: (item) => this.insert(item, 0),
      remove: this.dequeue
    },
    end: {
      add: (item) => this.insert(item, this.items.length),
      remove: this.pop
    },

    insertAtIndex: this.insert,
    removeAtIndex: this.remove,

    size: this.size,
    peek: () => this.peek(this.items.length - 1),
    seek: (index) => this.items[index],
    clear: this.clear,
  }

}


module.exports.Queue = Queue;
module.exports.AsyncQueue = AsyncQueue;

module.exports.QueueLowFootprint = QueueLowFootprint;
