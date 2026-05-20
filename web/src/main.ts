

const handler = async () => {
  
  const pre = document.createElement('pre')
  document.querySelector<HTMLDivElement>('#app')!.appendChild(pre)

  const append = (movie: unknown) => {
    pre.appendChild(document.createTextNode(JSON.stringify(movie, null, 2) + '\n'))
  }

  const response = await fetch('http://localhost:3333/data')
  if (!response.body) return

  const decoder = new TextDecoder()
  let buffer = ''

 for await (const chunk of response.body) {
  buffer += decoder.decode(chunk, {stream: true})

  const lines = buffer.split('\n')
  buffer = lines.pop() ?? ''

  for (const line of lines) {
    if (!line) continue
    const movie = JSON.parse(line)
    // await new Promise((resolve) => setTimeout(resolve, 100))
    append(movie)
  }
 }

 if(buffer) append(JSON.parse(buffer))

}

window.onload = handler