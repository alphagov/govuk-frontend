for DIR in */; do
    filename=${DIR/%\/}
    mv $filename/_$filename.scss $filename/_style.scss
    echo '@import "../../settings/all";
@import "../../tools/all";
@import "../../helpers/all";

@import "style";' > $filename/_$filename.scss
done
