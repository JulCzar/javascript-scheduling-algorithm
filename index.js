const count = (function () {
  let counter = 0

  const getNext = () => ++counter

  return { getNext }
})();

const FifoThreadManager = (function() {
  const executionQueue = (function () {
    const flow = []

    flow.push(new Thread())
    flow.pop()

    return flow
  })();

  /**
   * 
   * @param {Thread} thread 
   */
  const add = thread => {
    executionQueue.push(thread)
  }

  const executeProcesses = async function () {
    console.log('Executando FIla de processos com escalonador FIFO')

    for (const thread of executionQueue) {
      console.log
      await thread.run()
    }
  }

  return {
    add,
    executeProcesses
  }
})();

const SjfThreadManager = (function() {
  const executionQueue = (function () {
    const flow = []

    flow.push(new Thread()); flow.pop();

    return flow
  })();

  /**
   * 
   * @param {Thread} thread 
   */
  const add = thread => {
    executionQueue.push(thread)

    executionQueue.sort((threadA, threadB) => {
      if (threadA.burstTime > threadB.burstTime)
        return 1
      
      if (threadA.burstTime < threadB.burstTime)
        return -1
      
      return 0
    })
  }

  const executeProcesses = async function () {
    console.log('Executando FIla de processos com escalonador SJF')

    for (const thread of executionQueue) {
      await thread.run()
    }
  }

  return {
    add,
    executeProcesses
  }
})();

(async function() {
  const thread1 = new Thread(count.getNext(), 'Thread 1', 300, console.log)
  const thread2 = new Thread(count.getNext(), 'Thread 2', 450, console.log)
  const thread3 = new Thread(count.getNext(), 'Thread 3', 050, console.log)
  const thread4 = new Thread(count.getNext(), 'Thread 4', 700, console.log)
  const thread5 = new Thread(count.getNext(), 'Thread 5', 999, console.log)
  const thread6 = new Thread(count.getNext(), 'Thread 6', 333, console.log)
  const thread7 = new Thread(count.getNext(), 'Thread 7', 123, console.log)
  const thread8 = new Thread(count.getNext(), 'Thread 8', 476, console.log)
  const thread9 = new Thread(count.getNext(), 'Thread 9', 876, console.log)
  const thread10 = new Thread(count.getNext(), 'Thread 10', 233, console.log)

  FifoThreadManager.add(thread1)
  FifoThreadManager.add(thread2)
  FifoThreadManager.add(thread3)
  FifoThreadManager.add(thread4)
  FifoThreadManager.add(thread5)
  FifoThreadManager.add(thread6)
  FifoThreadManager.add(thread7)
  FifoThreadManager.add(thread8)
  FifoThreadManager.add(thread9)
  FifoThreadManager.add(thread10)

  SjfThreadManager.add(thread1)
  SjfThreadManager.add(thread2)
  SjfThreadManager.add(thread3)
  SjfThreadManager.add(thread4)
  SjfThreadManager.add(thread5)
  SjfThreadManager.add(thread6)
  SjfThreadManager.add(thread7)
  SjfThreadManager.add(thread8)
  SjfThreadManager.add(thread9)
  SjfThreadManager.add(thread10)

  await FifoThreadManager.executeProcesses()
  await SjfThreadManager.executeProcesses()
})();

/**
 * 
 * @param {number} processID 
 * @param {string} processName 
 * @param {number} burstTime 
 * @param {function} code 
 */
function Thread(processID, processName, burstTime, code) {
  this.processName = processName;
  this.processID = processID;
  this.burstTime = burstTime;
  this.code = code;

  this.run = async () => {
    await doAfter(this.code, burstTime, this.processName);
  }
}

/**
 * The following code was take from stack overflow, over the link: https://stackoverflow.com/questions/6921895/synchronous-delay-in-code-execution
 * 
 * this function will return a promise that will take the number of ms passed as param to resolve
 * @param {number} ms time in milliseconds to wait
 */
function wait(ms) {
  const waiter = (resolve, reject) => {
    setTimeout(resolve, ms)
  }

  return new Promise(waiter)
}

/**
 * Run an callback after some time 
 * @param {function} callback function that will be executed after the delay
 * @param {number} ms delay in milliseconds
 */
async function doAfter(callback, ms = 0, ...params) {
  await wait(ms)

  callback(...params)
}