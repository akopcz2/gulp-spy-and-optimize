### gulp-spy-and-optimize

Watch Image directory for changes (rename,additions,deletions) - then optimize changed imaged ( if not already optimized)

```
const spy = require('gulp-spy-and-optimize');

const pathToWatch = {
    path:'/public/images/'
}

spy(pathToWatch.path);
```