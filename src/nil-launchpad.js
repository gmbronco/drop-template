const randomGenerator = (seed) => {
  // TODO: validate seed length
  const hashes = seed.match(/.{1,16}/g).map(r => parseInt(r, 16))
  const sfc32 = (a, b, c, d) => {
    return () => {
      a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
      var t = (a + b) | 0;
      a = b ^ b >>> 9;
      b = c + (c << 3) | 0;
      c = (c << 21 | c >>> 11);
      d = d + 1 | 0;
      t = t + d | 0;
      c = c + t | 0;
      return (t >>> 0) / 4294967296;
    }
  }
  const generator = sfc32(...hashes)

  const randomNumberInRange = (start = 0, end = 1) => (
    generator() * (Math.abs(start) + Math.abs(end)) + start
  )
  
  return randomNumberInRange
}

const randomSeed = (size = 64) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')

const getMetadata = ({ traits }) => {
  if (!window.nil || !window.nil.metadata) {
    throw ('Project metadata not defined')
  }

  return {
    ...window.nil.metadata,
    attributes: Object.entries(traits).map(([key, value]) => ({
      trait_type: key,
      value
    })),
  }
}

const render = (computeTraits, renderImage) => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  })

  const { nilSeed, metadata, preview } = params

  // Randomise seed
  const seed = nilSeed || (preview ? randomSeed() : null)

  if (!seed) {
    throw ('seed not defined')
  }

  // initialize rng
  const nilRandom = randomGenerator(seed)

  const traits = computeTraits(nilRandom)

  // render inside body
  const container = document.querySelector('body')

  // Routing to display metadata
  if (metadata) {
    container.innerHTML = JSON.stringify(getMetadata({ traits }))
  } else {
    renderImage(nilRandom, traits)
  }
}

export { render }
