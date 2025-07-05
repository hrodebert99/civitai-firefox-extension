const main = () => {
    const bodyElementObserver = new MutationObserver(() => {
        const nextElement = document.querySelector("#__next")

        if (nextElement === null) {
            return
        }

        bodyElementObserver.disconnect()

        const nextObserver = new MutationObserver(() => {
            if (/^https:\/\/civitai.com\/(models|user\/.+|user\/.+\/models|collections\/\d+)$/.test(window.location.href) === false) {
                return
            }

            let gridElement = null

            if (/^https:\/\/civitai.com\/(models|user\/.+\/models|collections\/\d+)$/.test(window.location.href)) {
                gridElement = document.querySelector(".MasonryGrid_grid__6QtWa")
            } else if (/^https:\/\/civitai.com\/user\/.+$/.test(window.location.href)) {
                // TODO

                // const profileSectionElements = [...document.querySelectorAll(".ProfileSection_profileSection__MqqfN")]

                // if (profileSectionElements.length === 0) {
                //     return
                // }

                // profileSectionElements.forEach((profileSectionElement) => {
                //     const titleElement = profileSectionElement.querySelector(".ProfileSection_title__SlyX6")

                //     if (titleElement === null) {
                //         return
                //     }

                //     if ([
                //         "Models",
                //         "Most popular models"
                //     ].includes(titleElement.textContent)) {
                //         console.log(titleElement.textContent)
                //     }

                //     gridElement = profileSectionElement.querySelector(".ShowcaseGrid_grid__e1fhW")
                // })
            }

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
                    downloadButtonElement.style.backgroundColor = "#4488ff"
                    downloadButtonElement.style.padding = "0px 8px"
                    downloadButtonElement.style.borderRadius = "16px"
                    downloadButtonElement.textContent = "Download"
                    downloadButtonElement.addEventListener("click", () => {
                        console.log(contentElement.querySelector(".AspectRatioImageCard_linkOrClick__d_K_4").href)

                        // TODO
                    })

                    let buttonContainerElement = contentElement.querySelector(".AspectRatioImageCard_header__Mmd__ > div:first-child > div:nth-child(2)")

                    if (buttonContainerElement === null) {
                        buttonContainerElement = contentElement.querySelector(".AspectRatioImageCard_header__Mmd__ > div:nth-child(2)")
                    }

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
