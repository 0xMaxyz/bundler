export function preDecode(input: string): string[] {
  input = input.replace(/-/g, '+').replace(/_/g, '/')
  return input.split('.').map((part) => {
    let decodedLen = part.length
    if (decodedLen % 4 === 2) {
      part += '=='
    } else if (decodedLen % 4 === 1) {
      part += '='
    }
    return part
  })
}
