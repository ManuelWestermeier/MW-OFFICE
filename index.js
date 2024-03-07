const exe = (...arg) => document.execCommand(...arg)
const ct = document.querySelector("main")
const log = console.log
var keys = {}

window.addEventListener("blur", e => ct.focus())

ct.innerHTML = localStorage.getItem(location.hash) || "<h1>New Document</h1>"

ct.addEventListener("input", e => {
    localStorage.setItem(location.hash, ct.innerHTML);
})

window.addEventListener("keydown", (e) => {
    keys[e.key] = true
    HandleKeys(e)
})

window.addEventListener("keyup", ({ key }) => {
    delete keys[key]
})

function HandleKeys(e) {

    log(keys)

    if (keys.Escape) {

        e.preventDefault()

        if (keys.ArrowRight) {
            exe("redo")
        } else if (keys.ArrowLeft) {
            exe("undo")
        } else if (keys.b) {
            exe("bold")
        } else if (keys.i) {
            exe("italic")
        } else if (keys.u) {
            exe("underline")
        } else if (keys.s) {
            exe('fontSize', false, parseInt(prompt('headline type : 1 - 7') ?? 2))
            keys = {}
        } else if (keys.g) {
            AddGrid()
        }

    }

}

function AddGrid() {
    const [width, height] = prompt("Grid size : width/height").split("/").map(x => parseInt(x));

    exe(
        "insertHTML",
        false,
        `<div class="grid" style="grid-template-columns: repeat(${width}, 1fr); grid-template-rows: repeat(${height}, 1fr);">
            ${Array.from(new Uint8Array(width * height)).map((x, i) =>
            `<div class="g-w-5">
                element ${i + 1}
            </div>`
        ).join("")}
        </div>`
    )

    keys = {}
}

async function Download() {
    const name = prompt("filename :")
    var frame = true
    var data;

    if (frame) {
        data = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${name}</title><style>
        ${(await (await fetch("index.css")).text()).split("\n").join(" ")}</style></head><body><main id="content">${ct.innerHTML}</main></body></html>`
    } else {
        data = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${name}</title><style>
        ${(await (await fetch("index.css")).text()).split("\n").join(" ")}</style></head><body id="content">${ct.innerHTML}</body></html>`
    }

    const blob = new Blob([data], { type: "text/html" })
    const downloadURL = URL.createObjectURL(blob)

    const link = document.createElement("a")

    link.download = name + ".html"
    link.href = downloadURL
    link.click()

}

function InsetImage() {
    const input = document.createElement("input")
    input.type = "file"

    input.addEventListener("change", e => {
        const file = e.target.files[0]
        const fr = new FileReader()

        fr.onload = e => {
            exe('insertImage', false, fr.result)
        }

        fr.readAsDataURL(file)
    })

    input.click()
}