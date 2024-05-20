# Typescript Generic Types

Generic TS types library for general purposes.

## Install

```bash
$ npm i @blanquera/types
```

## EventEmitter Usage

```js
import { EventEmitter } from '@blanquera/types';

const emitter = new EventEmitter;

emitter.on('trigger something', async x => {
  console.log('something triggered', x + 1)
})

emitter.on(/trigger (something)/, async x => {
  await Helper.sleep(2000)
  console.log('(something) triggered', x + 2)
}, 2)

await emitter.emit('trigger something', 1)
```

## Exception Usage

```js
import { Exception } from '@blanquera/types';

throw Exception.for('Something %s is %s', 'good', 'bad')
```

## HashStore Usage

```js
import { HashStore } from '@blanquera/types';

const registry = new HashStore()

registry.set('foo', 'bar', 'zoo')
registry.set('foo', 'zoo', ['foo', 'bar', 'zoo'])

console.log(registry.has('foo', 'bar'))
console.log(registry.has('bar', 'foo'))
console.log(registry.get('foo', 'zoo', 1))

registry.remove('foo', 'bar')

console.log(registry.has('foo', 'bar'))
console.log(registry.has('foo', 'zoo'))
```

## TaskQueue Usage

```js
import { TaskQueue } from '@blanquera/types';

const queue = new TaskQueue;

queue.push(async x => {
  console.log(x + 1)
})

queue.shift(async x => {
  await Helper.sleep(2000)
  console.log(x + 2)
})

queue.add(async x => {
  console.log(x + 3)
}, 10)

await queue.run(1)
```