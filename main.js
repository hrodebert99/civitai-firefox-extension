const main = () => {
    createBodyElementObserver()
}

const createBodyElementObserver = () => {
    let bodyElementObserver = null

    bodyElementObserver = new MutationObserver(() => {
        handleBodyElementCallback(bodyElementObserver)
    })

    bodyElementObserver.observe(document.body, {
        childList: true,
        subtree: true
    })

    return bodyElementObserver
}

const handleBodyElementCallback = (bodyElementObserver) => {
    const nextElement = document.querySelector("#__next")

    if (nextElement === null) {
        return
    }

    bodyElementObserver.disconnect()

    createNextElementObserver(nextElement)
}

const createNextElementObserver = (nextElement) => {
    let nextElementObserver = null

    nextElementObserver = new MutationObserver(() => {
        handleNextElementObserverCallback()
    })

    nextElementObserver.observe(nextElement, {
        childList: true,
        subtree: true
    })

    return nextElementObserver
}

const handleNextElementObserverCallback = () => {
    const url = window.location.href

    if (/^https:\/\/civitai.com\/(models(\?[a-zA-Z0-9=+&%]+)?|tag\/[a-zA-Z0-9=+&%]+|user\/[a-zA-Z0-9_]+(\/models(\?[a-zA-Z0-9=+&%]+)?)?|collections\/[0-9]+(\?[a-zA-Z0-9=+&%]+)?)?$/.test(url) === false) {
        return
    }

    let gridElements = []

    if (/^https:\/\/civitai.com\/(models(\?[a-zA-Z0-9=+&%]+)?|tag\/[a-zA-Z0-9=+&%]+|user\/[a-zA-Z0-9_]+\/models(\?[a-zA-Z0-9=+&%]+)?|collections\/[0-9]+(\?[a-zA-Z0-9=+&%]+)?)?$/.test(url) === true) {
        const gridElement = document.querySelector(".MasonryGrid_grid__6QtWa")

        if (gridElement === null) {
            return
        }

        gridElements.push(gridElement)
    } else if (/^https:\/\/civitai.com\/user\/[a-zA-Z0-9_]+$/.test(url) === true) {
        const profileSectionContainerElement = document.querySelector("main > div:nth-child(2) > div:nth-child(2)")

        if (profileSectionContainerElement === null) {
            return
        }

        if (profileSectionContainerElement.children.length === 1) {
            if (profileSectionContainerElement.querySelector(".ProfileSection_profileSection__MqqfN") === null) {
                return
            }
        }

        const profileSectionElementArray = [...profileSectionContainerElement.querySelectorAll(".ProfileSection_profileSection__MqqfN")]

        profileSectionElementArray.forEach((profileSectionElement) => {
            const titleElement = profileSectionElement.querySelector(".ProfileSection_title__SlyX6")

            if (titleElement === null) {
                return
            }

            if (["Models", "Most popular models"].includes(titleElement.textContent) === false) {
                return
            }

            const gridElement = profileSectionElement.querySelector(".ShowcaseGrid_grid__e1fhW")

            gridElements.push(gridElement)
        })
    }

    if (gridElements.length === 0) {
        return
    }

    gridElements.forEach((gridElement) => {
        if (gridElement.hasAttribute("data-civitai-firefox-extension-observe") === true) {
            return
        }

        gridElement.setAttribute("data-civitai-firefox-extension-observe", true)

        createGridElementObserver(gridElement)
    })
}

const createGridElementObserver = (gridElement) => {
    let gridObserver = null

    gridObserver = new MutationObserver(() => {
        handleGridObserverCallback(gridElement)
    })

    gridObserver.observe(gridElement, {
        childList: true,
        subtree: true
    })

    return gridObserver
}

const handleGridObserverCallback = (gridElement) => {
    const cardElementArray = [...gridElement.children]

    cardElementArray.forEach(updateCardElement)
}

const updateCardElement = (cardElement) => {
    const contentElement = cardElement.querySelector(".AspectRatioImageCard_content__IGj_A")

    if (contentElement === null) {
        return
    }

    if (contentElement.children.length === 0) {
        if (cardElement.hasAttribute("data-civitai-firefox-extension-observe")) {
            cardElement.removeAttribute("data-civitai-firefox-extension-observe")
        }

        return
    }

    if (cardElement.hasAttribute("data-civitai-firefox-extension-observe")) {
        return
    }

    cardElement.setAttribute("data-civitai-firefox-extension-observe", true)

    const downloadButtonElement = document.createElement("button")
    downloadButtonElement.textContent = "Download"
    downloadButtonElement.style.backgroundColor = "#4488ff"
    downloadButtonElement.style.padding = "0 0.5rem"
    downloadButtonElement.style.borderRadius = "1rem"
    downloadButtonElement.addEventListener("click", async () => {
        const linkOrClickElement = contentElement.querySelector(".AspectRatioImageCard_linkOrClick__d_K_4")

        const getModelId = (url) => {
            const match = url.match(/^https:\/\/civitai.com\/models\/(\d+)\/[a-z0-9\-]+$/)

            // if (match === null) {
            //     return 0
            // }

            return match[1]
        }

        const modelId = getModelId(linkOrClickElement.href)

        const getModelMetadata = async (modelId) => {
            const response = await fetch(`https://civitai.com/api/v1/models/${modelId}`)

            if (!response.ok) {
                cardElement.removeAttribute("data-civitai-firefox-extension-observe")

                throw new Error()
            }

            return await response.json()
        }

        let modelMetadata = await getModelMetadata(modelId)

        if (modelMetadata.modelVersions.length === 1) {
            const anchorElement = document.createElement("a")
            anchorElement.href = modelMetadata.modelVersions[0].downloadUrl
            // anchorElement.target = "_blank"
            // anchorElement.rel = "noopener"
            anchorElement.click()
        } else {
            const instructionElement = document.createElement("p")
            instructionElement.textContent = "Click anywhere to close."

            const modalElement = document.createElement("div")
            modalElement.style.backgroundColor = "rgba(0, 0, 0, 0.8)"
            modalElement.style.color = "#ffffff"
            modalElement.style.position = "fixed"
            modalElement.style.top = "0"
            modalElement.style.right = "0"
            modalElement.style.bottom = "0"
            modalElement.style.left = "0"
            modalElement.style.zIndex = "199"
            modalElement.style.display = "flex"
            modalElement.style.flexDirection = "column"
            modalElement.style.justifyContent = "center"
            modalElement.style.alignItems = "center"
            modalElement.style.gap = "1rem"
            modalElement.addEventListener("click", () => {
                modalElement.remove()
            })
            
            const containerElement = document.createElement("div")
            containerElement.style.backgroundColor = "#333333"
            containerElement.style.textAlign = "center"
            containerElement.style.padding = "1rem 2rem"
            containerElement.style.borderRadius = "1rem"
            containerElement.style.display = "flex"
            containerElement.style.flexDirection = "column"
            containerElement.style.justifyContent = "center"
            containerElement.style.alignItems = "center"
            containerElement.style.gap = "1rem"
            containerElement.addEventListener("click", (event) => {
                event.stopPropagation()
            })

            const titleElement = document.createElement("p")
            titleElement.textContent = "Model Versions"
            titleElement.style.fontWeight = "bold"

            containerElement.append(titleElement)

            modelMetadata.modelVersions.forEach((modelVersion) => {
                const downloadButtonElement = document.createElement("button")
                downloadButtonElement.textContent = modelVersion.name
                downloadButtonElement.style.backgroundColor = "#4488ff"
                downloadButtonElement.style.width = "fit-content"
                downloadButtonElement.style.padding = "0 0.5rem"
                downloadButtonElement.style.borderRadius = "1rem"
                downloadButtonElement.addEventListener("click", async () => {
                    const anchorElement = document.createElement("a")
                    anchorElement.href = modelMetadata.modelVersions[0].downloadUrl
                    // anchorElement.target = "_blank"
                    // anchorElement.rel = "noopener"
                    anchorElement.click()
                })

                containerElement.append(downloadButtonElement)
            })

            modalElement.append(instructionElement)
            modalElement.append(containerElement)

            document.body.append(modalElement)
        }
    })

    let buttonContainerElement = contentElement.querySelector(".AspectRatioImageCard_header__Mmd__ > div:first-child > div:last-child")

    if (buttonContainerElement === null) {
        buttonContainerElement = contentElement.querySelector(".AspectRatioImageCard_header__Mmd__ > div:last-child > div:last-child")
    }

    buttonContainerElement.append(downloadButtonElement)
}

main()
