function getModelIdFromCard(card) {
    const anchor = card.querySelector("div:nth-child(1) > a:nth-child(1)")

    if (!anchor) {
        return
    }

    const match = anchor.href.match(/\/models\/(\d+)\//)

    if (!match) {
        return
    }

    return match[1]
}

async function getModelMetadata(modelId) {
    const response = await fetch(`https://civitai.com/api/v1/models/${modelId}`)

    if (!response.ok)
        throw new Error()

    return await response.json()
}

function updateGrid() {
    const cards = [...document.querySelector(".MasonryGrid_grid__6QtWa").children]

    cards.forEach(card => {
        if (card.dataset.updated === "true") {
            return
        }

        card.dataset.updated = "true"

        const button = document.createElement("button")
        button.textContent = "Download"
        button.style.backgroundColor = "#0000ff"
        button.style.padding = "8px"
        button.addEventListener("click", () => {
            modelId = getModelIdFromCard(card)

            getModelMetadata(modelId)
                .then((modelMetadata) => {
                    const button = document.createElement("button")
                    button.textContent = "Close"
                    button.style.backgroundColor = "#ffffff"
                    button.style.color = "#000000"
                    button.style.padding = "8px"
                    button.addEventListener("click", () => {
                        modal.remove()
                    })

                    const theadCol1 = document.createElement("th")
                    theadCol1.textContent = "Version"
                    theadCol1.style.border = "4px solid white"
                    
                    const theadCol2 = document.createElement("th")
                    theadCol2.textContent = "Published at"
                    theadCol2.style.border = "4px solid white"
                    
                    const theadCol3 = document.createElement("th")
                    theadCol3.textContent = "Download"
                    theadCol3.style.border = "4px solid white"
                    
                    const thead = document.createElement("thead")
                    thead.appendChild(theadCol1)
                    thead.appendChild(theadCol2)
                    thead.appendChild(theadCol3)

                    const tbody = document.createElement("tbody")
                    
                    modelMetadata.modelVersions.forEach((modelVersion) => {
                        const tdCol1 = document.createElement("td")
                        tdCol1.textContent = modelVersion.name
                        tdCol1.style.padding = "8px"
                        tdCol1.style.border = "4px solid white"

                        const tdCol2 = document.createElement("td")
                        tdCol2.textContent = modelVersion.publishedAt
                        tdCol2.style.padding = "8px"
                        tdCol2.style.border = "4px solid white"

                        const anchor = document.createElement("a")
                        anchor.textContent = "Download"
                        anchor.href = modelVersion.downloadUrl
                        anchor.target = "_blank"
                        anchor.rel = "noopener noreferrer"
                        anchor.style.backgroundColor = "#0000ff"
                        anchor.style.padding = "8px"
                        
                        const tdCol3 = document.createElement("td")
                        tdCol3.appendChild(anchor)
                        tdCol3.style.padding = "8px"
                        tdCol3.style.border = "4px solid white"
                        
                        const tr = document.createElement("tr")
                        tr.appendChild(tdCol1)
                        tr.appendChild(tdCol2)
                        tr.appendChild(tdCol3)
                        
                        tbody.appendChild(tr)
                    })

                    const table = document.createElement("table")
                    table.appendChild(thead)
                    table.appendChild(tbody)
                    table.style.borderCollapse = "collapse"

                    const modal = document.createElement("div")
                    modal.append(button)
                    modal.append(table)
                    modal.style.position = "fixed"
                    modal.style.top = "0"
                    modal.style.right = "0"
                    modal.style.bottom = "0"
                    modal.style.left = "0"
                    modal.style.zIndex = "199"
                    modal.style.backgroundColor = "rgba(0, 0, 0, 0.75)"
                    modal.style.color = "#ffffff"
                    modal.style.padding = "16px"
                    
                    document.body.appendChild(modal)
                })
                .catch(() => {})
        })

        card.querySelector("div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)").append(button)
    })
}

function runScript() {
    if (window.location.href === "https://civitai.com/models") {
        updateGrid()
    } else if (window.location.href.match(/https:\/\/civitai.com\/collections\/*/)) {
        updateGrid()
    }
}

runScript()
