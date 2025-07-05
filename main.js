const main = () => {
    const bodyElementObserver = new MutationObserver(() => {
        const nextElement = document.querySelector("#__next")

        if (nextElement === null) {
            return
        }

        bodyElementObserver.disconnect()

        const nextObserver = new MutationObserver(() => {
            if (/^https:\/\/civitai.com\/(models|user\/.+\/models|collections\/\d+)$/.test(window.location.href) === false) {
                return
            }

            const gridElement = document.querySelector(".MasonryGrid_grid__6QtWa")
            
            if (gridElement === null) {
                return
            }

            if (gridElement.hasAttribute("data-civitai-firefox-extension-observe") === true) {
                return
            }

            gridElement.setAttribute("data-civitai-firefox-extension-observe", true)

            const gridObserver = new MutationObserver(() => {
                const cardElements = [...gridElement.children]

                cardElements.forEach((cardElement) => {
                    const contentElement = cardElement.querySelector(".AspectRatioImageCard_content__IGj_A")

                    if (contentElement.children.length === 0) {
                        if (cardElement.hasAttribute("data-civitai-firefox-extension-observer")) {
                            cardElement.removeAttribute("data-civitai-firefox-extension-observer")
                        }

                        return
                    }

                    if (cardElement.hasAttribute("data-civitai-firefox-extension-observer")) {
                        return
                    }
                    
                    cardElement.setAttribute("data-civitai-firefox-extension-observer", true)

                    const downloadButtonElement = document.createElement("button")
                    downloadButtonElement.className = "civitai-firefox-extension-download-button"
                    downloadButtonElement.style.backgroundColor = "#88ccff"
                    downloadButtonElement.textContent = "Download"
                    downloadButtonElement.addEventListener("click", () => {
                        console.log(contentElement.querySelector(".AspectRatioImageCard_linkOrClick__d_K_4").href)

                        // TODO
                    })

                    const buttonContainerElement = contentElement.querySelector(".AspectRatioImageCard_header__Mmd__ > div:first-child > div:nth-child(2)")
                    buttonContainerElement.append(downloadButtonElement)
                })
            })

            gridObserver.observe(gridElement, { childList: true, subtree: true })
        })

        nextObserver.observe(nextElement, { childList: true, subtree: true })
    })

    bodyElementObserver.observe(document.body, { childList: true, subtree: true })
}

main()
