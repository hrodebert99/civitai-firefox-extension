/*
https://civitai.com/
https://civitai.com/models
https://civitai.com/models/{id}
https://civitai.com/search/models
https://civitai.com/user/{id}
https://civitai.com/user/{id}/models
https://civitai.com/tag
https://civitai.com/collections

const regex = /^
    https:\/\/civitai.com\/(
        models(
            \?[a-zA-Z0-9%&-_=+'.]+
            |\/[0-9]+(
                \?modelVersionId=[0-9]+
                |\/[a-zA-Z0-9%&-_=+'.]+(
                    \?modelVersionId=[0-9]+
                )?
            )?
        )?
        |search\/models\?[a-zA-Z0-9%&-_=+'.]+
        |user\/[a-zA-Z0-9_]+(
            \/models(
                \?[a-zA-Z0-9%&-_=+'.]+
            )?
        )?
        |tag\/[a-zA-Z0-9%&-_=+'.]+
        |collections\/[0-9]+(
            \?[a-zA-Z0-9%&-_=+'.]+
        )?
    )?
$/

Group 1 (.MasonryContainer_queries__bS_ak div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)):
https://civitai.com/models/{id}

Group 2 (main > div:nth-child(2) > div:nth-child(2) .ProfileSection_profileSection__MqqfN .ShowcaseGrid_grid__e1fhW):
https://civitai.com/user/{id}

Group 3 (.MasonryGrid_grid__6QtWa):
https://civitai.com/
https://civitai.com/models
https://civitai.com/search/models
https://civitai.com/tag
https://civitai.com/collections
https://civitai.com/user/{id}/models
*/

function main() {
    createBodyElementObserver()
}

function createBodyElementObserver() {
    let bodyElementObserver = null
    
    bodyElementObserver = new MutationObserver(function() {
        handleBodyElementObserverCallback(bodyElementObserver)
    })

    const bodyElement = document.body

    bodyElementObserver.observe(bodyElement, {
        childList: true,
        subtree: true
    })

    return bodyElementObserver
}

function handleBodyElementObserverCallback(bodyElementObserver) {
    const nextElement = document.querySelector("#__next")

    if (nextElement === null) {
        return
    }

    bodyElementObserver.disconnect()

    createNextElementObserver(nextElement)
}

function createNextElementObserver(nextElement) {
    let nextElementObserver = null
    
    nextElementObserver = new MutationObserver(function() {
        handleNextElementObserverCallback(nextElement)
    })

    nextElementObserver.observe(nextElement, {
        childList: true,
        subtree: true
    })

    return nextElementObserver
}

function handleNextElementObserverCallback(nextElement) {
    const url = window.location.href

    if (/^https:\/\/civitai.com\/(models(\?[a-zA-Z0-9%&-_=+'.]+|\/[0-9]+(\?modelVersionId=[0-9]+|\/[a-zA-Z0-9%&-_=+'.]+(\?modelVersionId=[0-9]+)?)?)?|search\/models\?[a-zA-Z0-9%&-_=+'.]+|user\/[a-zA-Z0-9_]+(\/models(\?[a-zA-Z0-9%&-_=+'.]+)?)?|tag\/[a-zA-Z0-9%&-_=+'.]+|collections\/[0-9]+(\?[a-zA-Z0-9%&-_=+'.]+)?)?$/.test(url) === false) {
        return
    }

    const gridElementArray = []

    if (/^https:\/\/civitai.com\/models\/[0-9]+(\?modelVersionId=[0-9]+|\/[a-zA-Z0-9%&-_=+'.]+(\?modelVersionId=[0-9]+)?)?$/.test(url) === true) {
        const queriesElementArray = nextElement.querySelectorAll(".MasonryContainer_queries__bS_ak")

        if (queriesElementArray.length === 0) {
            return
        }

        queriesElementArray.forEach(function(queriesElement) {
            const titleElement = queriesElement.querySelector("div:nth-child(1) > div:nth-child(1) > h2 > div:nth-child(1)")

            if (titleElement === null) {
                return
            }

            if (titleElement.textContent.trim() !== "Suggested Resources") {
                return
            }

            const gridElement = queriesElement.querySelector("div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)")

            gridElementArray.push(gridElement)
        })
    } else if (/^https:\/\/civitai.com\/user\/[a-zA-Z0-9_]+$/.test(url) === true) {
        const profileSectionContainerElement = nextElement.querySelector("main > div:nth-child(2) > div:nth-child(2)")

        if (profileSectionContainerElement === null) {
            return
        }

        const profileSectionElementArray = profileSectionContainerElement.querySelectorAll(".ProfileSection_profileSection__MqqfN")

        if (profileSectionElementArray.length === 0) {
            return
        }

        profileSectionElementArray.forEach(function(profileSectionElement) {
            const titleElement = profileSectionElement.querySelector("div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > p")

            if (titleElement === null) {
                return
            }

            if (["Most popular models", "Models"].includes(titleElement.textContent) === false) {
                return
            }

            const gridElement = profileSectionElement.querySelector(".ShowcaseGrid_grid__e1fhW")

            gridElementArray.push(gridElement)
        })
    } else {
        const gridElement = nextElement.querySelector(".MasonryGrid_grid__6QtWa")

        if (gridElement === null) {
            return
        }

        gridElementArray.push(gridElement)
    }

    if (gridElementArray.length === 0) {
        return
    }

    gridElementArray.forEach(function(gridElement) {
        if (gridElement.hasAttribute("data-civitai-extension-for-firefox-observe") === true) {
            return
        }

        gridElement.setAttribute("data-civitai-extension-for-firefox-observe", true)

        createGridElementObserver(gridElement)
    })
}

function createGridElementObserver(gridElement) {
    let gridElementObserver = null

    gridElementObserver = new MutationObserver(function() {
        handleGridElementObserverCallback(gridElement)
    })

    gridElementObserver.observe(gridElement, {
        childList: true,
        subtree: true
    })

    return gridElementObserver
}

function handleGridElementObserverCallback(gridElement) {
    // TODO
}

main()
