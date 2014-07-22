# creates build/html
rm -r build -errorAction ignore
$d = mkdir build
$d = mkdir build/html
cp -r src/Content build/html/
cp -r src/*.jpg build/html/
cp -r src/*.css build/html/
cp -r src/*.csv build/html/
cp -r src/*.html build/html/
cp -r src/*.json build/html/


