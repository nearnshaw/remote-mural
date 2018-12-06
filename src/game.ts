
@Component('pixel')
export class Pixel {
  x: number
  y: number
  //color: string
  constructor(x : number = 0, y : number = 0){
    this.x = x 
    this.y = y 
    //this.color = color 
  }
}

const pixels = engine.getComponentGroup(Pixel)


@Component('swatch')
export class Swatch {
  x: number
  y: number
  //color: Color3
  active: boolean
  size: number
  constructor(x : number = 0, y : number = 0){
    this.x = x 
    this.y = y 
    //this.color = color 
    this.active = false
  }
}

const swatches = engine.getComponentGroup(Swatch)


///////// SYSTEMS


export class GrowSwatches implements ISystem {
 
  update(dt: number) {
    for (let swatch of swatches.entities) {
      let state = swatch.get(Swatch)
      let transform = swatch.get(Transform)
      if (state.active && state.size < 1){
        state.size += dt
        transform.scale = Vector3.Lerp(swatchScale, swatchSelectedScale, state.size)
        transform.position.z = Scalar.Lerp(swatchZSelected, swatchZUnselected, state.size)
      }
      else if (!state.active && state.size > 0){
        state.size -= dt
        transform.scale = Vector3.Lerp(swatchScale, swatchSelectedScale, state.size)
        transform.position.z = Scalar.Lerp(swatchZSelected, swatchZUnselected, state.size)
      }
 
    }
  }
}

// Add system to engine
engine.addSystem(new GrowSwatches())

////////  PARAMETERS

const wallBlocksX: number = 21;
const wallBlocksY: number = 6;
const wallWidth = 7;
const wallHeight = 2;
const wallOffsetX = 0.75;
const wallOffsetY = 1;
const wallPixelPrefix = "wall-pixel-";
const wallPixelZ = 5;

const wallPixelScale: Vector3 = new Vector3(wallWidth / wallBlocksX - 0.01, wallHeight / wallBlocksY - 0.01, 0.01)

const swatchPrefix = "swatch-";

// z = 0.1 or else clicks would not fire
const swatchScale = new Vector3(0.1, 0.16,  0.1)
const swatchSelectedScale = new Vector3(0.18, 0.18, 0.1)

const swatchZSelected = -0.07
const swatchZUnselected = -0.03


/*

Color list

Source:
https://www.patternfly.org/styles/color-palette/

+ some are commented to get the entity count down
+ more wall pixels could be added if the palette is truncated

*/
const blankColor = "#0099CC"

const paletteColor =  "#666666"

const swatchColors = [
  blankColor,
  "#fbdebf",
  "#f7bd7f",
  "#f39d3c",
  "#ec7a08",
  "#b35c00",
  "#773d00",
  // "#3b1f00",
  "#fbeabc",
  "#f9d67a",
  "#f5c12e",
  "#f0ab00",
  "#b58100",
  "#795600",
  // "#3d2c00",
  "#e4f5bc",
  "#c8eb79",
  "#ace12e",
  "#92d400",
  // "#6ca100",
  // "#486b00",
  // // "#253600",
  // "#cfe7cd",
  // "#9ecf99",
  // "#6ec664",
  // "#3f9c35",
  // "#2d7623",
  // "#1e4f18",
  // // "#0f280d",
  // "#bedee1",
  // "#7dbdc3",
  // "#3a9ca6",
  // "#007a87",
  // "#005c66",
  // "#003d44",
  // // "#001f22",
  // "#beedf9",
  // "#7cdbf3",
  // "#35caed",
  // "#00b9e4",
  // "#008bad",
  // "#005c73",
  // // "#002d39",
  // "#def3ff",
  // "#bee1f4",
  // "#7dc3e8",
  // "#39a5dc",
  // "#0088ce",
  // "#00659c",
  // // "#004368",
  // // "#002235",
  // "#c7bfff",
  // "#a18fff",
  // "#8461f7",
  // "#703fec",
  // "#582fc0",
  // "#40199a",
  // // "#1f0066",
  // "#fafafa",
  // // "#f5f5f5",
  // "#ededed",
  // // "#d1d1d1",
  // "#bbbbbb",
  // // "#8b8d8f",
  // "#72767b",
  // // "#4d5258",
  // "#393f44",
  // // "#292e34",
  // "#030303",
  // "#cc0000",
  // "#a30000",
  // "#8b0000",
  // "#470000",
  // "#2c0000",
  paletteColor
]




////// SCENERY

/*

There are two materials used for the wall:
+ wallPixelColorMaterial - opaque material which is the background for colors
+ wallPixelTransparentMaterial - transparent material used for no color

*/

let wallPixelColorMaterial = {}

for (let i = 0; i< swatchColors.length; i++){
  let material = new Material()
  let color = Color3.FromHexString(swatchColors[i])
  material.ambientColor = color
  material.albedoColor = color
  material.reflectivityColor = color
  wallPixelColorMaterial[swatchColors[i]] = material  
}


let wallPixelTransparentMaterial = new Material()
wallPixelTransparentMaterial.alpha = 0.1
wallPixelTransparentMaterial.ambientColor= Color3.FromHexString(blankColor)
wallPixelTransparentMaterial.albedoColor=Color3.FromHexString(blankColor)
wallPixelTransparentMaterial.reflectivityColor=Color3.FromHexString(blankColor)
wallPixelTransparentMaterial.hasAlpha=true
wallPixelTransparentMaterial.transparencyMode =2

let currentColor: Material = wallPixelTransparentMaterial

/*

An [x] icon shows on the palette. This is that texture material.

*/

let transparentMaterial = new BasicMaterial()
transparentMaterial.texture = "./textures/transparent-texture.png"


// const wallPixelPositions: IColorVec3HashTable = {};
// const wallPixelColorsInit: IPixelHashTable = {};

// /*

// IPixelHashTable is used like this:

// table["one"] = "two";

// */
// interface IPixelHashTable {
//   [key: string]: string;
// }

// /*

// IColorVec3HashTable is used for Vec3:
// table["one"] = {x: 0, y: 0, z: 0};

// */
// interface IColorVec3HashTable {
//   [key: string]: Vector3Component;
// }




function InitiateWall(){

  for (let xIndex = 0; xIndex < wallBlocksX; xIndex += 1) {
    for (let yIndex = 0; yIndex < wallBlocksY; yIndex += 1) {
      const xPos = (wallWidth / wallBlocksX) * xIndex + wallOffsetX;
      const yPos = (wallHeight / wallBlocksY) * yIndex + wallOffsetY;
      
      let pix = new Entity()
      pix.set(new Transform())
      pix.get(Transform).position.set(xPos, yPos, wallPixelZ)
      pix.get(Transform).scale = (wallPixelScale)
      pix.set(new Pixel(xIndex, yIndex))

      pix.set(wallPixelTransparentMaterial)
      pix.set(new PlaneShape())
      pix.set(new OnClick(e=> {
        clickPixel(pix)
      }))

      engine.addEntity(pix)
    }
  }
}


function InitiatePalette(){
  let palette = new Entity()
  palette.set(new Transform())
  palette.get(Transform).scale.set(2.2,1,1)
  palette.get(Transform).position.set(8.5,1,3)
  palette.get(Transform).rotation.eulerAngles = new Vector3(30,50,0)
  palette.set(new PlaneShape())
  palette.set(wallPixelColorMaterial[paletteColor])
  engine.addEntity(palette)
  let rowY = 0
  for (let i = 0; i< swatchColors.length; i++){
    const x = ((i % 12) + 1) / 8 - 0.55;
    if (i % 6 === 0) {
      rowY -= 0.17;
    }
    const y = rowY + 0.5;

    let colorOption = new Entity()
    colorOption.setParent(palette)
    colorOption.set(new Transform())
    colorOption.get(Transform).position.set(x, y, swatchZUnselected)
    colorOption.get(Transform).scale = (swatchScale)
    colorOption.set(new Swatch(x, y))
    //log(wallPixelColorMaterial[i].albedoColor)
    let col = swatchColors[i]
    colorOption.set(wallPixelColorMaterial[col])
    colorOption.set(new PlaneShape())
    colorOption.set(new OnClick(e=> {
      clickSwatch(colorOption)
    }))

    engine.addEntity(colorOption)

  }

  // add transparent color

}


InitiateWall()
InitiatePalette()

function clickPixel(pix: Entity){
  pix.set(currentColor)
  log("setting color to pixel")

  let x = pix.get(Pixel).x
  let y = pix.get(Pixel).y
  let color = currentColor.albedoColor.toHexString


  let url = `${apiUrl}/pixel/?x=${x}&y=${y}`
  let method = "POST";
  let headers = { "Content-Type": "application/json" }
  let body =  JSON.stringify("color")


  executeTask(async () => {
    try {
      let response = await fetch(url, {
        headers: headers,
        method: method,
        body: body})
      let json = await response.json()
      log(json)
      for (let pixel of pixels.entities){
      }
      
    } catch {
      log("error sending pixel change")
    }

   })
 
}

function clickSwatch(colorOption: Entity){
  // TODO inactivate all others
  colorOption.get(Swatch).active = true
  currentColor = colorOption.get(Material)
  log("clicked color in the palette")
}


///// Connect to the REST API

const apiUrl = "http://127.0.0.1:7753"

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json"
};


//synchronizeWall()

function synchronizeWall() {

  let url = `${apiUrl}/api/pixels`

  executeTask(async () => {
    try {
      let response = await fetch(url)
      let json = await response.json()
      log(json)
      for (let pixel of pixels.entities){
        let pixelData = pixel.get(Pixel)
        for (let i = 0; i < json.length; i++){
          //log("x: " + json[i].x + " y: " + json[i].y )
          if(json[i].x == pixelData.x && 
             json[i].y == pixelData.y){
               let color = json[i].color
               let material = wallPixelColorMaterial[color]
               pixel.set(material)
               break
          } 
        }

      }
      
    } catch {
      log("error getting all pixels")
    }

   })

  // GET /api/pixels
  // fetch(apiUrl)
  //   .then(res => res.json())
  //   .then(function(res) {
  //     const { wallBlockColors } = scene.state;

  //     Object.keys(wallBlockColors).forEach(function(blockKey) {
  //       const isColorSet = res.some((pixel: IDBPixel) => {
  //         const { x, y, color } = pixel;
  //         const pixelKey = `${x}-${y}`;

  //         if (pixelKey === blockKey) {
  //           wallBlockColors[blockKey] = color;
  //           return true;
  //         }

  //         return false;
  //       });

  //       if (isColorSet === false) {
  //         wallBlockColors[blockKey] = "transparent";
  //       }
  //     });

  //     scene.setState({ wallBlockColors });
  //   })

}