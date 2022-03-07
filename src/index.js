import { render } from './nil-launchpad.js'
import p5 from 'p5'

/**
 * Define your project traits
 * Following function is  will compute traits with deterministic nilRandom generator
 */
const computeTraits = (nilRandom) => {
  const colorTrait = nilRandom()

  // Define rarity of different values based on a random number
  const backgroundColorFn = (n) => {
    if (n <= 0.5) { // 50%
      return 'gold'
    } else { // 50%
      return 'silver'
    }
  }

  const lineColorFn = (n) => {
    if (n <= 0.1) { // 10%
      return 'green'
    } else
    if (n <= 0.3) { // 20%
      return 'blue'
    } else { // 70%
      return 'white'
    }
  }

  // Get the vaules, which can be later accessed in the image generation function
  const backgroundColor = backgroundColorFn(colorTrait)
  const lineColor = lineColorFn(colorTrait)

  return { backgroundColor, lineColor }
}

/**
 * Define your rendering function
 */
const renderImage = ({ backgroundColor, lineColor }, nilRandom) => {
  // Since we need a callable function, we use P5 instance mode to call it after random numbers are generated
  // https://github.com/processing/p5.js/wiki/Global-and-instance-mode
  // based on https://happycoding.io/examples/p5js/for-loops/wrong-lines
  const drop = (p5) => {
    const width = document.body.clientWidth
    const body = document.body,
          html = document.documentElement
    const height = Math.max(body.scrollHeight, body.offsetHeight,
                            html.clientHeight, html.scrollHeight, html.offsetHeight)
    const margin = 25

    p5.setup = () => {
      p5.createCanvas(width, height)
      p5.noLoop()
      p5.strokeWeight(2)
    }

    p5.draw = () => {
      p5.background(backgroundColor)
      p5.stroke(lineColor)

      p5.noFill()
      p5.rect(margin, margin, width - margin * 2, height - margin * 2)

      for (let y = margin*2; y < height - margin * 2; y += 25) {
        drawLine(y)
      }
    }

    const drawLine = (lineY) => {
      const range = p5.map(lineY, margin * 2, height - margin * 2, 0, 50)

      let prevX = margin * 2
      let prevY = lineY
      const lineSpacing = 10

      for (let x = prevX + lineSpacing; x <= width - margin * 2; x += lineSpacing) {
        const y = lineY + nilRandom(-range, range)
        p5.line(prevX, prevY, x, y)

        prevX = x
        prevY = y
      }
    }
  }

  new p5(drop)
}

render(computeTraits, renderImage)
