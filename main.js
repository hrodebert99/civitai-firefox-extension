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

    bodyElementObserver.observe(document.body, {
        childList: true,
        subtree: true
    })
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
    const nextElementObserver = new MutationObserver(function() {
        handleNextElementObserverCallback(nextElement)
    })

    nextElementObserver.observe(nextElement, {
        childList: true,
        subtree: true
    })
}

function handleNextElementObserverCallback(nextElement) {
    const url = window.location.href

    if (/^https:\/\/civitai.com\/(models(\?[a-zA-Z0-9%&-_=+'.]+|\/[0-9]+(\?modelVersionId=[0-9]+|\/[a-zA-Z0-9%&-_=+'.]+(\?modelVersionId=[0-9]+)?)?)?|search\/models\?[a-zA-Z0-9%&-_=+'.]+|user\/[a-zA-Z0-9_]+(\/models(\?[a-zA-Z0-9%&-_=+'.]+)?)?|tag\/[a-zA-Z0-9%&-_=+'.]+|collections\/[0-9]+(\?[a-zA-Z0-9%&-_=+'.]+)?)?$/.test(url) === false) {
        return
    }

    const gridElementArray = []

    if (/^https:\/\/civitai.com\/models\/[0-9]+(\?modelVersionId=[0-9]+|\/[a-zA-Z0-9%&-_=+'.]+(\?modelVersionId=[0-9]+)?)?$/.test(url) === true) {
        const queriesElementArray = nextElement.querySelectorAll(".MasonryContainer_queries__bS_ak")

        queriesElementArray.forEach(function(queriesElement) {
            const titleElement = queriesElement.querySelector("div:nth-child(1) > div:nth-child(1) > h2 > div:nth-child(1)")

            if (titleElement === null) {
                return
            }

            if (titleElement.textContent.trim() !== "Suggested Resources") {
                return
            }

            const gridElement = queriesElement.querySelector("div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)")

            if (gridElement === null) {
                return
            }

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

            if (gridElement === null) {
                return
            }

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
    const cardElementArray = [...gridElement.children]

    cardElementArray.forEach(function(cardElement) {
        updateCardElement(cardElement)
    })
}

function updateCardElement(cardElement) {
    const contentElement = cardElement.querySelector(".AspectRatioImageCard_content__IGj_A")

    if (contentElement === null) {
        return
    }

    if (contentElement.children.length === 0) {
        if (cardElement.hasAttribute("data-civitai-extension-for-firefox-observe")) {
            cardElement.removeAttribute("data-civitai-extension-for-firefox-observe")
        }
        
        return
    }

    if (cardElement.hasAttribute("data-civitai-extension-for-firefox-observe")) {
        return
    }

    cardElement.setAttribute("data-civitai-extension-for-firefox-observe", true)

    const downloadButtonElement = document.createElement("button")
    downloadButtonElement.textContent = "Download"
    downloadButtonElement.style.backgroundColor = "#4488ff"
    downloadButtonElement.style.padding = "0 0.5rem"
    downloadButtonElement.style.borderRadius = "1rem"
    downloadButtonElement.addEventListener("click", function() {
        handleDownloadButtonElementClickEvent(contentElement)
    })
    
    let buttonContainerElement = contentElement.querySelector(".AspectRatioImageCard_header__Mmd__ > div:nth-child(1) > div:nth-child(2)")

    if (buttonContainerElement === null) {
        buttonContainerElement = contentElement.querySelector(".AspectRatioImageCard_header__Mmd__ > div:nth-child(2) > div:nth-child(2)")
    }

    buttonContainerElement.append(downloadButtonElement)
}

async function handleDownloadButtonElementClickEvent(contentElement) {
    const linkOrClickElement = contentElement.querySelector(".AspectRatioImageCard_linkOrClick__d_K_4")

    const match = linkOrClickElement.href.match(/^https:\/\/civitai.com\/models\/(\d+)\/[a-zA-Z0-9%&-_=+'.]+$/)

    if (match === null) {
        return
    }

    const modelId = match[1]
    const modelMetadata = await getModelMetadata(modelId)

    if (modelMetadata.modelVersions.length === 1) {
        const anchorElement = document.createElement("a")
        anchorElement.href = modelMetadata.modelVersions[0].downloadUrl
        anchorElement.click()
    } else {
        // 
    }
}

async function getModelMetadata(modelId) {
    const response = await fetch(`https://civitai.com/api/v1/models/${modelId}`)

    if (response.ok === false) {
        cardElement.removeAttribute("data-civitai-extension-for-firefox-observe")

        throw new Error()
    }

    const modelMetadata = await response.json()

    return modelMetadata
}

main()
