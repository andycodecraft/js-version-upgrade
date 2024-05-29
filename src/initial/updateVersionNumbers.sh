#!/usr/bin/env bash

#LAST_WEEKS_TAG=$(ruby -e 'now = Time.now - 604800; puts now.strftime("%Y-w%V-rc1")')
#THIS_WEEKS_TAG=$(ruby -e 'puts Time.now.strftime("%Y-w%V-rc1")')

CUR_VER_TAG=$(ruby -e 'puts Time.now.strftime("%Y-w%V-rc1")')

FILES_WITH_VERSION_NUMBERS=("package.json" "releasenotes.md" "config/environment.js")

function replaceInFile() {
    # textToFind=${1}
    # textToReplace=${2}
    # fileName=${3}

    fileName=${1}

    # echo "replacing $textToFind with $textToReplace in $fileName"
    # sed -e "s/$textToFind/$textToReplace/g" -i "" ${fileName}

    sed -i -E "s/(\"version\":\s*\")[^\"]*(\".*)/\1${CUR_VER_TAG}\2/" "$fileName"
    sed -i -E "s/(version:\s*')[^']*(.*)/\1${CUR_VER_TAG}\2/" "$fileName"
    sed -i -E "s/(Release:\s*)[^\s]*/\1${CUR_VER_TAG}/" "$fileName"

    echo "$fileName $(grep -iE '"version":\s|version:\s*|Release:\s*' $fileName)" | awk '{ printf "%-25s \t%s\t%s\n", $1, $2, $3 }'
}

for FILE in "${FILES_WITH_VERSION_NUMBERS[@]}"; do
    replaceInFile ${FILE}
done
