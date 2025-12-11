const exampleJSONString = `{
  "age": 24,
  "version": 10
}`

const createParser = (j: number, jsonString: string) => {
  let i = j

  const expectNext = (char: string) => {
    console.log('i\n', i)
    const nextChar = jsonString.charAt(i)
    if (nextChar !== char) {
      throw new Error(`Expected ${char} at index ${j}`)
    }
    i++
  }

  const or = (...fns: Array<() => unknown>) => {
    const startingI = i
    for (const fn of fns) {
      try {
        return fn()
      } catch {
        i = startingI
        continue
      }
    }

    throw new Error('No valid parser found')
  }

  const skipWhitespace = () => {
    while (true) {
      const char = jsonString.charAt(i)
      if ([' ', '\n', '\t'].includes(char)) {
        i++
        continue
      }
      break
    }
  }

  const seek = (x: number) => {
    i += x
  }

  const jump = (x: number) => {
    i = x
  }

  const peek = () => i

  const char = () => {
    const char = jsonString.charAt(i)
    return char
  }

  const clone = () => {
    return createParser(i, jsonString)
  }

  return {
    expectNext,
    or,
    skipWhitespace,
    seek,
    jump,
    peek,
    char,
    clone,
  }
}

type TParser = ReturnType<typeof createParser>

const parseKey = (parser: TParser) => {
  const j = parser.peek()
  let key = ''

  parser.expectNext('"')

  while (true) {
    const char = parser.char()
    if (char === '"') {
      break
    }
    key += char
    parser.seek(1)
  }

  parser.expectNext('"')

  return [parser.peek(), key] as [number, string]
}

const parseNumber = (parser: TParser) => {
  const j = parser.peek()
  let number = ''

  while (true) {
    const char = parser.char()
    if ([',', ']', '}'].includes(char)) {
      if (number === '') {
        throw new Error(`Expected number at index ${parser.peek()}`)
      }
      break
    }

    number += char
    parser.seek(1)
  }

  return [parser.peek(), parseFloat(number)] as [number, number]
}

const parseObject = (parser: TParser) => {
  parser.skipWhitespace()
  const [keyJ, key] = parseKey(parser.clone())
  parser.jump(keyJ)

  parser.skipWhitespace()
  parser.expectNext(':')
  console.log('got', ':')

  parser.skipWhitespace()
  const [valueJ, value] = parseNumber(parser.clone())
  parser.jump(valueJ)

  return [parser.peek(), key, value] as [number, string, number]
}

const parse = (_jsonString: string) => {
  let jsonString = _jsonString
  jsonString = jsonString.replace(/(\r\n|\n|\r|\t)/gm, '')

  let i = 0
  const brackets: string[] = []

  const tree: any[] = []

  console.log(jsonString)

  try {
    const parser = createParser(0, jsonString)
    while (i < jsonString.length) {
      const char = jsonString.charAt(i)
      if (char === '{') {
        brackets.push(char)
        parser.seek(1)
        const [j, key, value] = parseObject(parser.clone())
        parser.jump(j)

        tree.push({ key, value })
        continue
      }

      break
    }
  } catch (e) {
    console.log('dump')
    console.log(tree)

    throw e
  }

  console.log(tree)

  return true
}

setTimeout(() => {
  process.stdout.write('tick tick')
}, 1000)

parse(exampleJSONString)
