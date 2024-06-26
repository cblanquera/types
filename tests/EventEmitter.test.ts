import { describe, it } from 'mocha';
import { expect } from 'chai';
import EventEmitter from '../src/EventEmitter';

describe('Event Emitter Tests', () => {
  it('Should listen', async () => {
    const emitter = new EventEmitter
  
    expect(emitter).to.be.instanceOf(EventEmitter)
  
    const actual = emitter.on('on something', x => {})
  
    expect(actual).to.be.instanceOf(EventEmitter)

    const actual2 = emitter.on(['something', 'else'], x => {})

    expect(actual2).to.be.instanceOf(EventEmitter)
  })

  it('Should match', async () => {
    const emitter = new EventEmitter
  
    emitter.on('match something', x => {})
    emitter.on(/match (something)/g, x => {})
    emitter.on(/match (some)(thing)/i, x => {})
    emitter.on(/match (some)(thing)/i, x => {})
    emitter.on('no mas', x => {})
    emitter.on(/no mas/g, x => {})
    
    const matches = emitter.match('match something')
  
    expect(matches['match something'].pattern).to.equal('match something')
    expect(matches['/match (something)/g'].pattern).to.equal('/match (something)/g')
    expect(matches['/match (some)(thing)/i'].pattern).to.equal('/match (some)(thing)/i')
  
    expect(matches['/match (something)/g'].parameters.length).to.equal(1)
    expect(matches['/match (some)(thing)/i'].parameters.length).to.equal(2)
  })

  it('Should emit', async () => {
    const emitter = new EventEmitter<[number]>
  
    const triggered: number[] = []
    emitter.on('trigger basic something', async (x) => {
      expect(x).to.equal(1)
      triggered.push(1)
    }, 1)
  
    emitter.on(/trigger basic something/, async x => {
      expect(x).to.equal(1)
      triggered.push(2)
    }, 2)
  
    emitter.on('trigger basic something', async x => {
      expect(x).to.equal(1)
      triggered.push(3)
    }, 3)
  
    emitter.on(/trigger basic something/, async x => {
      expect(x).to.equal(1)
      triggered.push(4)
    }, 4)
  
    await emitter.emit('trigger basic something', 1)
  
    expect(triggered.length).to.equal(4)
    expect(triggered[0]).to.equal(4)
    expect(triggered[1]).to.equal(3)
    expect(triggered[2]).to.equal(2)
    expect(triggered[3]).to.equal(1)

    await emitter.emit('foobar', 1)
  })

  it('Should emit sync', () => {
    const emitter = new EventEmitter<[number]>
  
    const triggered: number[] = []
    emitter.on('trigger basic something', (x) => {
      expect(x).to.equal(1)
      triggered.push(1)
    }, 1)
  
    emitter.on(/trigger basic something/, x => {
      expect(x).to.equal(1)
      triggered.push(2)
    }, 2)
  
    emitter.on('trigger basic something', x => {
      expect(x).to.equal(1)
      triggered.push(3)
    }, 3)
  
    emitter.on(/trigger basic something/, x => {
      expect(x).to.equal(1)
      triggered.push(4)
    }, 4)
  
    emitter.emitSync('trigger basic something', 1)
  
    expect(triggered.length).to.equal(4)
    expect(triggered[0]).to.equal(4)
    expect(triggered[1]).to.equal(3)
    expect(triggered[2]).to.equal(2)
    expect(triggered[3]).to.equal(1)

    emitter.emitSync('foobar', 1)
  })

  it('Should have meta', async () => {
    const emitter = new EventEmitter
  
    const triggered: number[] = []
    emitter.on(/^trigger basic (.+)$/, async function something1() {
      expect(emitter.event.event).to.equal('trigger basic something')
      expect(emitter.event.pattern).to.equal('/^trigger basic (.+)$/')
      expect(emitter.event.parameters[0]).to.equal('something')
      expect(emitter.event.args && emitter.event.args[0]).to.equal(1)
      expect(emitter.event.callback).to.equal(something1)
      expect(emitter.event.priority).to.equal(2)
      triggered.push(1)
    }, 2)
  
    emitter.on(/trigger (.+) something$/, async function something2() {
      expect(emitter.event.event).to.equal('trigger basic something')
      expect(emitter.event.pattern).to.equal('/trigger (.+) something$/')
      expect(emitter.event.parameters[0]).to.equal('basic')
      expect(emitter.event.args && emitter.event.args[0]).to.equal(1)
      expect(emitter.event.callback).to.equal(something2)
      expect(emitter.event.priority).to.equal(1)
      triggered.push(2)
    }, 1)
  
    const actual = await emitter.emit('trigger basic something', 1)
  
    expect(triggered.length).to.equal(2)
    expect(triggered[0]).to.equal(1)
    expect(triggered[1]).to.equal(2)
    expect(actual.code).to.equal(200)
  })

  it('Should emit advanced event', async () => {
    const emitter = new EventEmitter
  
    const triggered: number[] = []
    emitter.on('trigger advance something', async x => {
      expect(x).to.equal(1)
      triggered.push(1)
    })
  
    emitter.on(/trigger (advance) something/, async x => {
      expect(x).to.equal(1)
      triggered.push(2)
      expect(emitter.event.parameters[0]).to.equal('advance')
    }, 2)
  
    const actual = await emitter.emit('trigger advance something', 1)
  
    expect(triggered.length).to.equal(2)
    expect(triggered[0]).to.equal(2)
    expect(triggered[1]).to.equal(1)
    expect(actual.code).to.equal(200)
  })

  it('Should emit incomplete event', async () => {
    const emitter = new EventEmitter
  
    const triggered: number[] = []
    emitter.on('trigger incomplete something', async x => {
      triggered.push(1)
    })
  
    emitter.on(/trigger (incomplete) something/, async x => {
      expect(x).to.equal(1)
      triggered.push(2)
      return false
    }, 2)
  
    const actual = await emitter.emit('trigger incomplete something', 1)
  
    expect(triggered.length).to.equal(1)
    expect(triggered[0]).to.equal(2)
    expect(actual.code).to.equal(308)
  })

  it('Should unbind', async () => {
    const emitter = new EventEmitter
    let listener = async x => {
      triggered.push(1)
    }
  
    const triggered: number[] = []
    emitter.on('trigger unbind something', listener)
  
    emitter.unbind('trigger unbind something')
    const actual = await emitter.emit('trigger unbind something')
  
    expect(triggered.length).to.equal(0)
    expect(actual.code).to.equal(404)
  
    let listener2 = async x => {
      triggered.push(2)
    }
  
    emitter.on('trigger unbind something', listener)
    emitter.on('trigger unbind something', listener2)
    emitter.unbind('trigger unbind something', listener)
  
    const actual2 = await emitter.emit('trigger unbind something')
  
    expect(triggered.length).to.equal(1)
    expect(triggered[0]).to.equal(2)
    expect(actual2.code).to.equal(200)

    emitter.on('trigger unbind something else', listener)
    emitter.unbind(undefined, listener)
    const actual3 = await emitter.emit('trigger unbind something else')

    expect(triggered.length).to.equal(1)
    expect(triggered[0]).to.equal(2)
    expect(actual3.code).to.equal(404)

    emitter.unbind();
    const actual4 = await emitter.emit('trigger unbind something')

    expect(triggered.length).to.equal(1)
    expect(triggered[0]).to.equal(2)
    expect(actual4.code).to.equal(404)
  })

  it('Should nest', async () => {
    const emitter = new EventEmitter
  
    emitter.on('on something', async x => {
      expect(emitter.event.event).to.equal('on something')
      const actual = await emitter.emit('on something else', x + 1)
      expect(actual.code).to.equal(200)
    })
  
    emitter.on('on something else', x => {
      expect(emitter.event.event).to.equal('on something else')
    })
  
    await emitter.emit('on something', 1)
  })

  it('Should listen to regexp', async () => {
    const emitter = new EventEmitter
  
    let triggered = 0
    emitter.on('GET /components/heyo/beans', async x => {
      expect(emitter.event.event).to.equal('GET /components/heyo/beans')
      triggered ++
    })
  
    emitter.on(/^GET\s\/components\/(.*)\/*$/, async x => {
      expect(emitter.event.event).to.equal('GET /components/heyo/beans')
      triggered ++
      expect(emitter.event.parameters[0]).to.equal('heyo/beans')
    })
  
    await emitter.emit('GET /components/heyo/beans', 1)
  
    expect(triggered).to.equal(2)
  })

  it('Should asyncronously emit', async() => {
    const emitter = new EventEmitter<[number]>
  
    const actual: number[] = []
  
    emitter.on('async test', async() => {
      actual.push(1)
    })
  
    emitter.on('async test', async() => {
      actual.push(2)
    })
  
    emitter.on('async test', async() => {
      actual.push(3)
    })
  
    emitter.emit('async test', 0)
  
    //something unexpected is that even on async the first listener is syncronous
    //I concluded that this is just how the async/await works
    expect(actual.length).to.equal(1)
  })

  it('Should allow middleware', async() => {
    const emitter1 = new EventEmitter
    const emitter2 = new EventEmitter
  
    const triggered: number[] = []
    emitter1.on('trigger basic something', async x => {
      expect(x).to.equal(1)
      triggered.push(1)
    }, 1)
  
    emitter2.on('trigger basic something', async x => {
      expect(x).to.equal(1)
      triggered.push(2)
    }, 2)
  
    emitter1.use(emitter2)
  
    await emitter1.emit('trigger basic something', 1)
  
    expect(triggered.length).to.equal(2)
    expect(triggered[0]).to.equal(2)
    expect(triggered[1]).to.equal(1)
  })

  it('Should inspect', async () => {
    const emitter = new EventEmitter

    expect(emitter.inspect('foo').length).to.equal(0)
  
    emitter.on('foo', function b() {})
    emitter.on('foo', function c() {})
    emitter.on('foo', function d() {})
    emitter.on('foo', function a() {}, 1)
    emitter.on('foo', function() {})
  
    const tasks = emitter.inspect('foo').map(task => task.callback)
  
    expect(tasks[0].name).to.equal('a')
    expect(tasks[1].name).to.equal('b')
    expect(tasks[2].name).to.equal('c')
    expect(tasks[3].name).to.equal('d')

    function bar() {}
    emitter.on('bar', bar)
    emitter.unbind('bar', bar)
    expect(emitter.inspect('bar').length).to.equal(0)
    emitter.emit('bar')
  })
})