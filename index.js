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
    console.log('Executando Fila de processos com escalonador FIFO')

    while (executionQueue.length) {
      const thread = executionQueue.shift()

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
    console.log('Executando Fila de processos com escalonador SJF')

    while (executionQueue.length) {
      const thread = executionQueue.shift()
      
      await thread.run()
    }
  }

  return {
    add,
    executeProcesses
  }
})();

(async function() {
  const thread01 = new Thread('Thread 01', 300, console.log)
  const thread02 = new Thread('Thread 02', 450, console.log)
  const thread03 = new Thread('Thread 03', 050, console.log)
  const thread04 = new Thread('Thread 04', 700, console.log)
  const thread05 = new Thread('Thread 05', 999, console.log)
  const thread06 = new Thread('Thread 06', 333, console.log)
  const thread07 = new Thread('Thread 07', 123, console.log)
  const thread08 = new Thread('Thread 08', 476, console.log)
  const thread09 = new Thread('Thread 09', 876, console.log)
  const thread10 = new Thread('Thread 10', 233, console.log)

  FifoThreadManager.add(thread01)
  FifoThreadManager.add(thread02)
  FifoThreadManager.add(thread03)
  FifoThreadManager.add(thread04)
  FifoThreadManager.add(thread05)
  FifoThreadManager.add(thread06)
  FifoThreadManager.add(thread07)
  FifoThreadManager.add(thread08)
  FifoThreadManager.add(thread09)
  FifoThreadManager.add(thread10)

  SjfThreadManager.add(thread01)
  SjfThreadManager.add(thread02)
  SjfThreadManager.add(thread03)
  SjfThreadManager.add(thread04)
  SjfThreadManager.add(thread05)
  SjfThreadManager.add(thread06)
  SjfThreadManager.add(thread07)
  SjfThreadManager.add(thread08)
  SjfThreadManager.add(thread09)
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
function Thread(processName, burstTime, code) {
  this.processName = processName;
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