import fs from 'fs';
import zlib from 'zlib';

const gzip = zlib.createGzip();

fs.createReadStream('airbnb_with_photos.json')
  .pipe(gzip)
  .pipe(fs.createWriteStream('airbnb_with_photos.json.gz'))
  .on('finish', () => console.log('airbnb_with_photos.json.gz created successfully!'));
