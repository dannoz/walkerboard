#/bin/sh

# add node modules to path.
export PATH=./node_modules/bin:$PATH

# remove existing
rm www/build/walkerboard.*

# do the JSX transform
jsx jsx/ www/build/ -x jsx

#now uglify to bundle.
uglifyjs www/js/*.js www/build/*.js www/build/widgets/*.js -b > walkerboard.js
uglifyjs walkerboard.js -c > walkerboard.min.js

mv walkerboard.* www/build/
