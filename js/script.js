;(() => {
    console.log('loaded')

    const timeout = time => new Promise(resolve => setTimeout(resolve, time))

    const asyncInterval = async (callback, ms = 500, triesLeft = 25) =>
        new Promise((resolve, reject) => {
            const interval = setInterval(async () => {
                const result = await callback()

                if (!result && triesLeft <= 1) {
                    clearInterval(interval)
                    reject()
                }

                if (result) {
                    clearInterval(interval)
                    resolve(result)
                }

                triesLeft--
            }, ms)
        })

    class LinkedInExplorerPlugin {
        iframe = null
        links = []
        currentIndex = 0
        currentPage = ''
        pageNumber = 1
        openToWork = []
        setApp(iframe) {
            this.iframe = iframe
        }

        init() {
            try {
                document.getElementById(loader.panelId).removeChild(document.getElementById('ita-btn'))
            } catch (e) {}

            const btn = document.createElement('button')
            btn.style = 'background-color: white;'
            btn.id = 'ita-btn'
            btn.innerHTML = 'Add iTA People'
            btn.addEventListener('click', () => this.findOpenToWorkEngineers())
            document.getElementById(loader.panelId).appendChild(btn)
        }

        printResult() {
            const ul = document.createElement('ul')
            ul.style.position = 'fixed'
            ul.style.backgroundColor = '#ffffff'
            ul.style.padding = '2rem'
            ul.style.border = '2px solid black'
            ul.style.top = 0
            ul.style.right = 0
            ul.style.zIndex = 10000

            this.openToWork.forEach(open => {
                const li = document.createElement('li')
                console.log(open)
                li.innerHTML = open
                ul.appendChild(li)
            })

            document.body.appendChild(ul)
        }

        async nextPage() {
            // if (this.pageNumber === 1) return true
            console.log('Next page...')
            this.pageNumber++
            this.iframe.contentWindow.location.href = this.currentPage + `&page=` + this.pageNumber

            await asyncInterval(() => {
                this.iframe.contentWindow.scroll(0, this.iframe.contentWindow.document.body.scrollHeight)
                return this.iframe.contentWindow.document.querySelector('.artdeco-pagination.ember-view.pv5.ph2')
            })

            this.links = [
                ...this.iframe.contentWindow.document.querySelectorAll('.entity-result__title-text > .app-aware-link')
            ].filter(link => !link.href.startsWith('https://www.linkedin.com/search'))
            console.log('New page user profiles: ', this.links)

            if (!this.links.length) {
                console.log(`No more pages are available`)
                return true
            }

            this.currentPage = this.iframe.contentWindow.location.href
            this.currentIndex = 0

            return false
        }

        async visitLinks() {
            let userLink = this.links[this.currentIndex]

            console.log(`visiting ${userLink.href}`)
            console.log(`Current index`, this.currentIndex)

            this.iframe.contentWindow.location.href = userLink.href

            await asyncInterval(() =>
                this.iframe.contentWindow.document.querySelector('.artdeco-card.ember-view.pv-top-card')
            )

            let openToWorkCard = this.iframe.contentWindow.document.querySelector(
                '.poc-opportunities-card__text-content'
            )

            if (openToWorkCard) {
                console.log(`User ${userLink} is open to work`)
                this.openToWork.push(userLink.href)
            }

            if (this.currentIndex === this.links.length - 1) {
                const isEnd = await this.nextPage()
                if (isEnd) {
                    console.log('No more pages to visit')
                    this.printResult()
                    return
                }
                this.visitLinks()
                return
            }

            await timeout(1000)
            this.currentIndex++
            this.visitLinks()
        }

        async findOpenToWorkEngineers() {
            console.log('Looking for open to work engineers...')

            const searchParams = new URLSearchParams(this.iframe.contentWindow.location.search)

            this.pageNumber = +searchParams.get('page') || 1
            this.currentPage = this.iframe.contentWindow.location.href
            this.links = this.iframe.contentWindow.document.querySelectorAll(
                '.entity-result__title-text > .app-aware-link'
            )
            console.log('User profiles: ', this.links)
            this.currentIndex = 0
            this.visitLinks()
        }
    }

    class Loader {
        iframeId = 'loader-inner-iframe-5079520'
        panelId = null
        contentWindow = null
        plugins = []

        init() {
            this.panelId = this.iframeId + '345345'
            this.createIframe(true)
            this.initPlugins()
        }

        createIframe(removeHTML) {
            removeHTML = removeHTML || false
            try {
                document.body.removeChild(document.getElementById(this.iframeId))
            } catch (e) {}
            const iframe = document.createElement('iframe')
            iframe.src = document.location.href
            iframe.id = this.iframeId
            iframe.width = '100%'
            iframe.height = window.innerHeight

            if (removeHTML) {
                document.body.innerHTML = ''
            }
            document.body.appendChild(iframe)
            this.contentWindow = iframe.contentWindow

            this.createPanel()
        }

        createPanel() {
            try {
                document.body.removeChild(document.getElementById(this.panelId))
            } catch (e) {}

            const div = document.createElement('div')
            div.style = 'position: absolute; top: 5px; left: 20px; font-weight: bold;'
            div.id = this.panelId
            div.innerHTML = ''
            document.body.appendChild(div)
        }

        windowInit() {
            // Put code that you want to run after iframe is created
        }

        initPlugins() {
            this.plugins.forEach(plugin => {
                plugin.init()
            })
        }

        addPlugin(plugin) {
            this.plugins.push(plugin)
            plugin.setApp(this)
            return this
        }
    }

    const loader = new Loader()
    loader.addPlugin(new LinkedInExplorerPlugin())
    loader.init()
})()
