const sharp = require("sharp");
const compress_images = require("compress-images");
const fs = require("fs");

let arg = process.argv.slice(2);

let path = arg[0];
let width = Number(arg[1]);

const temp = "./temp";

if (!fs.existsSync(temp)) {
  fs.mkdirSync(temp);
}

const compressed = "./compressed/";

if (!fs.existsSync(compressed)) {
  fs.mkdirSync(compressed);
}


function resize(inputPath, outputPath, width) {
  sharp(inputPath)
    .rotate()
    .resize({ width: width })
    .toFile(outputPath, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Imagem redimensionada com sucesso!!");
        compress(outputPath, "./compressed/");
      }
    });
}

function compress(inputPath, outputPath) {

    fs.unlink(outputPath , (err) => {
        if (err) {
          console.log(err);
        }});

  compress_images(inputPath, outputPath,{ compress_force: false, statistic: true, autoupdate: true },
    false,
    { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
    { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
    { svg: { engine: "svgo", command: "--multipass" } },
    {
      gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] },
    },
    function (error, completed, statistic) {
      console.log("-------------");
      console.log(error);
      console.log(completed);
      console.log(statistic);
      console.log("-------------");


      fs.unlink(inputPath, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log(inputPath, " Apagado");
        }
      });
    
    });

}

resize(path, "./temp/output_resize.jpg", width);
