const exe = (...arg) => document.execCommand(...arg)
const ct = document.querySelector("main")
const log = console.log
var keys = {}

window.addEventListener("blur", e => ct.focus())

ct.innerHTML = localStorage.getItem(location.hash) || "<h1>New Document</h1>"

window.addEventListener("hashchange", e => ct.innerHTML = localStorage.getItem(location.hash) || "<h1>New Document</h1>")

ct.addEventListener("input", e => {
    localStorage.setItem(location.hash, ct.innerHTML);
})

window.addEventListener("mousemove", e => {
    if (e.target) {
        if (e.target.classList.contains("dragable")) {
            if (e.buttons == 1) {
                
            }
        }
    }
})

window.addEventListener("keydown", (e) => {
    keys[e.key] = true
    HandleKeys(e)
})

window.addEventListener("keyup", ({ key }) => {
    delete keys[key]
})

function HandleKeys(e) {

    if (keys.Tab) {
        e.preventDefault()
        exe("insertHTML", false, '\t\t\t\t')
    }

    if (keys.Control && keys.s)
        e.preventDefault()

    if (keys.Escape) {

        e.preventDefault()
        ct.focus()

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
        } else if (keys.d) {
            Download()
        }
        else if (keys.L) {
            exe('insertUnorderedList')
        }
        else if (keys.l) {
            exe('insertOrderedList')
        }
        else if (keys.I) {
            InsetImage()
            keys = {}
        } else if (keys.E) {
            Share()
        } else if (keys[","]) {
            exe('justifyLeft')
        } else if (keys["."]) {
            exe('justifyCenter')
        } else if (keys["-"]) {
            exe('justifyRight')
        } else if (keys["#"]) {
            ChangePage()
        }

    }

}

async function Download() {
    const name = prompt("filename :")
    const downloadURL = URL.createObjectURL(await getDownloadBlob(name))

    const link = document.createElement("a")

    link.download = name + ".html"
    link.href = downloadURL
    link.click()
    keys = {}

}

async function getDownloadBlob(name = "") {
    var data = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${name}</title><style>${(await (await fetch("index.css")).text()).split("\n").join(" ")}img:active {position: fixed;z-index: 1001;top: 0;left: 0;max-height: none;width:100dvw;height: 100dvh;object-fit: contain;background-color: var(--d);}</style></head><body><main id="content">${ct.innerHTML}</main><script>var l=document.createElement("link");document.head.appendChild(l);l.rel="icon";l.href=document.querySelector("img")?.src</script></body></html>`

    const blob = new Blob([data], { type: "text/html" })

    return blob;
}

async function Share() {
    const name = prompt("filename :") + ".html"
    const blob = await getDownloadBlob(name)
    navigator.share({ files: [new File([blob], name, { type: "text/html" })], title: "MW-Office Document" })
    keys = {}
}

function InsetImage() {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"

    input.addEventListener("change", e => {
        const file = e.target.files[0]
        const fr = new FileReader()

        fr.onload = e => {
            exe('insertImage', false, fr.result)
        }

        fr.readAsDataURL(file)
    })

    keys = {}

    input.click()
}

ct.addEventListener("click", e => {
    if (e.target.href) {
        if (keys.Control || keys.Escape || keys.Alt) {
            open(e.target.href)
        }
    }
})

const isLink = () => {
    if (window.getSelection().toString !== '') {
        const selection = window.getSelection().getRangeAt(0)
        if (selection) {
            if (selection.startContainer.parentNode.tagName === 'A'
                || selection.endContainer.parentNode.tagName === 'A') {
                return [true, selection]
            } else { return false }
        } else { return false }
    }
}

function ChangePage() {
    keys = {}
    const strorageArray = Object.keys(localStorage).filter(k => k[0] == "#")
    const projects = strorageArray.map((k, i) => `(${i + 1}) ${k}`)
    var p = prompt(`goto projeckt : (1 - ${projects.length}) or new project name\n${projects.join("\n")}`)
    document.location.hash = strorageArray?.[parseInt(p || strorageArray.findIndex(document.location.hash) + 1) - 1] || p
    ct.innerHTML = localStorage.getItem(location.hash) || "<h1>New Document</h1>"
    keys = {}
}

function toggleDesign() {
    var theme = localStorage.getItem("theme") == "dark" ? "light" : "dark"
    localStorage.setItem("theme", theme)
    document.documentElement.style.setProperty('--l', theme == "dark" ? "rgb(17, 17, 17)" : "rgb(238, 238, 238)");
    document.documentElement.style.setProperty('--d', theme == "dark" ? "rgb(238, 238, 238)" : "rgb(17, 17, 17)");
    document.documentElement.style.setProperty('--p', theme == "dark" ? "rgb(15, 15, 15)" : "rgb(215, 215, 215)");
}

toggleDesign()
toggleDesign()

function AddDragableField() {
    document.execCommand('insertHTML', false, '<section class="dragable" draggable="true">Dragzone</section>')
}