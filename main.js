window._registerGameScript(function(Engine) {
const blockSize = 40

const cosList = {
  800: "Stone",
  850: "Coal_Ore",
  900: "Copper_Ore",
  940: "Iron_Ore",
  975: "Gold_Ore",
  1000: "Diamond_Ore"
};

function hash2D(x, y, range) {
  const h = (x * 73856093) ^ (y * 19349663);
  return ((h % range) + range ) % range
};

function pickCostume(x, y) {
  const value = hash2D(x, y, 1000);
  for ([num, image] of Object.entries(cosList)) {
    if (value < num) {
      return image;
    }
  }
};

function display() {
  const bx = Engine.Camera.x / blockSize
  const by = Engine.Camera.y / blockSize
  const lx = 400 / blockSize
  const ly = 300 / blockSize
  const z = Engine.Camera.zoom

  const sx = Math.floor(bx - lx)
  const ex = Math.ceil (bx + lx)

  const sy = Math.floor(by - ly)
  const ey = Math.ceil (by + ly)

  for(let x = sx; x <= ex; x++) {
    for(let y = sy; y <= ey; y++) {
      const cosName = pickCostume(x, y)
      Engine.draw(
        cosName,
        x * blockSize,
        y * blockSize,
        blockSize,
        blockSize
      )
    }
  }
}

Engine.setInit(() => {
  display()
})

Engine.setUpdate(() => {
  Engine.Camera.x += 3 * Engine.Input.getKey("ArrowRight")
  Engine.Camera.x -= 3 * Engine.Input.getKey("ArrowLeft")
  Engine.Camera.y += 3 * Engine.Input.getKey("ArrowUp")
  Engine.Camera.y -= 3 * Engine.Input.getKey("ArrowDown")
  display()
})
});