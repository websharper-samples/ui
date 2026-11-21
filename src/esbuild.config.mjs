import { cpSync, readdirSync, existsSync, mkdirSync, rmSync } from 'fs'
import { build } from 'esbuild'

const outDir = '../dist'

rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir + '/Scripts', { recursive: true })

// Copy the static site (index.html, styles, images, data files) to dist.
cpSync('./wwwroot/', outDir + '/', { recursive: true })

const prebundles = readdirSync('./build/')

prebundles.forEach(file => {
  if (file.endsWith('.js')) {
    var options =
    {
      entryPoints: ['./build/' + file],
      bundle: true,
      minify: true,
      format: 'iife',
      outfile: outDir + '/Scripts/' + file,
      globalName: 'wsbundle'
    };

    console.log("Bundling:", file);
    build(options);
  }
});

if (existsSync('./build/workers/')) {
  const workers = readdirSync('./build/workers/');
  mkdirSync(outDir + '/Scripts/workers', { recursive: true })

  workers.forEach(file => {
    if (file.endsWith('.js')) {
      var options =
      {
        entryPoints: ['./build/workers/' + file],
        bundle: true,
        minify: true,
        format: 'iife',
        outfile: outDir + '/Scripts/workers/' + file,
      };

      console.log("Bundling worker:", file);
      build(options);
    }
  });
}