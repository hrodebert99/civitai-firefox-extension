const getGrid = (href) => {
  if (/^https:\/\/civitai.(com|green)\/(models|collections\/\d+|user\/(.+)\/models)$/.test(href)) {
    return document.querySelector(".MasonryGrid_grid__6QtWa")
  }
}

const updateGrid = () => {
  const url = window.location.href
  const grid = getGrid(url)
  const cards = [...grid.children]

  cards.forEach((card) => {
    const linkOrClick = card.querySelector("div:nth-child(1) > div:nth-child(2)")

    if (!linkOrClick) {
      if (card.dataset.updated === "true") {
        delete card.dataset.updated
      }

      return
    }

    if (card.dataset.updated === "true") {
      return
    }

    card.dataset.updated = "true"

    const button = createDownloadButton(card)
    card.querySelector("div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)").append(button)
  })
}

const createDownloadButton = (card) => {
  const button = document.createElement("button")
  button.textContent = "Download"
  button.style.backgroundColor = "#0000ff"
  button.addEventListener("click", async () => {
    const modelId = getModelId(card)
    const modelMetadata = await getModelMetadata(modelId)

    if (modelMetadata.modelVersions.length === 1) {
      const anchor = document.createElement("a")
      anchor.href = modelMetadata.modelVersions[0].downloadUrl
      anchor.click()

      return
    }

    const div = createModelVersionDiv(modelMetadata)
    document.body.append(div)
  })

  return button
}

const createModelVersionDiv = (modelMetadata) => {
  const table = createModelVersionTable(modelMetadata)
  table.addEventListener("click", (event) => {
    event.stopPropagation()
  })
  
  const div = document.createElement("div")
  div.style.position = "fixed"
  div.style.top = "0"
  div.style.right = "0"
  div.style.bottom = "0"
  div.style.left = "0"
  div.style.backgroundColor = "rgba(0, 0, 0, 0.5)"
  div.style.zIndex = "199"
  div.style.display = "flex"
  div.style.justifyContent = "center"
  div.style.alignItems = "center"
  div.addEventListener("click", () => {
    div.remove()
  })
  div.append(table)

  return div
}

const createModelVersionTable = (modelMetadata) => {
  const th1 = document.createElement("th")
  th1.textContent = "Name"

  const th2 = document.createElement("th")
  th2.textContent = "Published at"
  
  const th3 = document.createElement("th")
  th3.textContent = ""

  const thead = document.createElement("thead")
  thead.append(th1)
  thead.append(th2)
  thead.append(th3)

  const tbody = document.createElement("tbody")

  modelMetadata.modelVersions.forEach((modelVersion) => {
    const td1 = document.createElement("td")
    td1.textContent = modelVersion.name

    const publishedAt = new Date(modelVersion.publishedAt)

    const td2 = document.createElement("td")
    td2.textContent = publishedAt.toLocaleString()

    const anchor = document.createElement("a")
    anchor.textContent = "Download"
    anchor.href = modelVersion.downloadUrl
    anchor.style.backgroundColor = "#0000ff"
    anchor.style.color = "#ffffff"

    const td3 = document.createElement("td")
    td3.append(anchor)

    const tr = document.createElement("tr")
    tr.append(td1)
    tr.append(td2)
    tr.append(td3)

    tbody.append(tr)
  })

  const table = document.createElement("table")
  table.style.backgroundColor = "#ffffff"
  table.append(thead)
  table.append(tbody)

  return table
}

const getModelId = (card) => {
  const anchor = card.querySelector("div:nth-child(1) > a:nth-child(1)")

  if (!anchor) {
    return
  }

  const match = anchor.href.match(/https:\/\/civitai.(com|green)\/models\/(\d+)/)
  
  return match[2]
}

const getModelMetadata = async (modelId) => {
  const response = await fetch(`https://civitai.com/api/v1/models/${modelId}`)

  if (!response.ok) {
    throw new Error()
  }

  return response.json()
}

// TODO: Download all models in a collection.
// (async () => {
//   const grid = document.querySelector(".MasonryGrid_grid__6QtWa")
//   const cards = [...grid.children]

// 	for (const card of cards) {
//     const header = card.querySelector(".AspectRatioImageCard_header__Mmd__")

// 		if (!header) {
// 			continue
// 		}

// 		const dropdownButton = header.children.length === 1 ? header.querySelector("div:first-child > div:nth-child(2) > button:first-child") : header.querySelector("div:nth-child(2) > button:first-child")
// 		dropdownButton.click()

// 		await new Promise((resolve) => { setTimeout(resolve, 500) })

// 		const dropdown = document.querySelector("#" + dropdownButton.id.match(/mantine-(.{9})-/)[0] + "dropdown")

// 		const removeFromThisCollectionButton = dropdown.children.length === 8 ? dropdown.querySelector("button:nth-child(7)") : dropdown.querySelector("button:nth-child(5)")
// 		removeFromThisCollectionButton.click()

// 		await new Promise((resolve) => { setTimeout(resolve, 10000) })
//   }

// 	console.log("Completed.")
// })()

const main = () => {
  console.log("Civitai Extension: Running")

  const url = window.location.href
  const grid = getGrid(url)

  updateGrid()

  const observer = new MutationObserver(() => {
    updateGrid()
  })
  observer.observe(grid, { childList: true, subtree: true })

  console.log("Civitai Extension: Observing")
}

main()
