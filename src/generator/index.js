const ROT = require('rot-js')

const {Map2D} = require('../map')
const {capitalize} = require('../util')

// TODOS:
// - Pull in options from nearest pkg.json or .axollemaconfig file in cwd if avail
//   otherwise go with fallback defaults.
// - Actually make this a CLI app.
// - Use ROT.RNG to spice things up as far as adding points of interest (perhaps the weighted thing).

module.exports = function generator (options = {}) {
  const {
    width = 20,
    height = 20,
    depth = 0,
    type = 'Uniform',
    roomDugPercentage = 0.25,
    dugPercentage = 0.25,
    timeLimit = 60 * 1000,
    mapperOptions = {},
    roomHeightMaximum,
    roomHeightMinimum,
    roomWidthMaximum,
    roomWidthMinimum,
    corridorLengthMinimum,
    corridorLengthMaximum,
    regularity
  } = options

  // Make just a 2D map as MVP.
  if (depth <= 1) {
    const Mapper = ROT.Map[capitalize(type)]
    if (!Mapper) {
      throw new Error(`The map type ${type} is unsupported`)
    }

    const _mapperOptions = Object.assign({}, mapperOptions, {
      roomHeightMaximum,
      roomHeightMinimum,
      roomWidthMaximum,
      roomWidthMinimum,
      corridorLengthMinimum,
      corridorLengthMaximum,
      regularity,
      dugPercentage,
      roomDugPercentage,
      timeLimit
    })

    const mapper = new Mapper(width, height, _mapperOptions)
    const map = new Map2D({width, height})
    try {
      map.create(mapper)
    } catch (error) {
      console.log(`Error when creating map. Please ensure options are correct for ROT-js map type ${type}.`)
      throw error
    }

    return {
      graphic: map.draw(),
      rooms: map.getAllRooms()
    }
  } else {
    throw new Error('3D areas are as of yet unsupported. Omit the Z value for your map.')
  }
}
