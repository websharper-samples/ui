# creates build/html
rm -r build -errorAction ignore
$d = mkdir build
$d = mkdir build/html
cp -r Site/Content build/html/
cp -r Site/*.jpg build/html/
cp -r Site/*.css build/html/
cp -r Site/*.html build/html/
cp -r Site/*.json build/html/


