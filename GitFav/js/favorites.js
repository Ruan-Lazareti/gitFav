import { GithubUser } from "./githubuser.js"

export class Favorites {
    constructor (root) {
        this.root = document.querySelector(root)
        this.load()
    }


    async add(value) {
        try {
            const userExists = this.entries.find(entry => entry.login === value)
            
            if(userExists) {
                throw new Error ('Usuário já Cadsatrado!')
            }

            const user = await GithubUser.search(value)

            if (user.login === undefined) {
                throw new Error ('Usuário não encontrado!')
            }

            else {
                this.entries = [user, ...this.entries]
                this.update()
                this.save()
            }
            
        } catch (Error) {
            alert(Error.message)
        }

    }

    save() {
        localStorage.setItem('@github-favorites', JSON.stringify(this.entries))
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites')) || []
    }

    delete(user) {
        const filteredEntries = this.entries
        .filter(entry => entry.login !== user.login)

        this.entries = filteredEntries

        this.update()
        this.save()
    }
    
    
}

export class FavoritesView extends Favorites{
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')
        this.update()
        this.onAdd()
    }

    update() {
        this.removeAllTr()

        if(this.entries.length === 0) {
            const emptyRow = this.createRowEmpty()

            emptyRow.style.height = '60rem'
            emptyRow.style.position = 'relative'
            emptyRow.querySelector('img').style.position = 'absolute'
            emptyRow.querySelector('img').style.top = '21.0rem'
            emptyRow.querySelector('img').style.left = '22rem'
            emptyRow.querySelector('img').style.width = '13.2rem'
            emptyRow.querySelector('p').style.position = 'absolute'
            emptyRow.querySelector('p').style.top = '26.2rem'
            emptyRow.querySelector('p').style.left = '43rem'
            emptyRow.querySelector('p').style.fontSize = '4.0rem'
            emptyRow.querySelector('p').style.lineHeight = '2.5rem'
            emptyRow.querySelector('p').style.color = '#4E5455'

            this.tbody.append(emptyRow)
        }

        this.entries.
            forEach(entry => {
                const row = this.createRow()

                row.querySelector('img').src = `https://github.com/${entry.login}.png`
                row.querySelector('img').alt = `Imagem de ${entry.name}`
                row.querySelector('a').href = `https://github.com/${entry.login}`
                row.querySelector('p').innerText = `${entry.name}`
                row.querySelector('span').innerText = `/${entry.login}`
                row.querySelector('.repositories').innerText = `${entry.public_repos}`
                row.querySelector('.followers').innerText = `${entry.followers}`

                GithubUser.search('ruan-lazareti')

                row.querySelector('.remove').onclick = () => {
                    const isOk = confirm('Deseja remover esse usuário?')

                    if(isOk) {
                        this.delete(entry)
                    }
                }

                this.tbody.append(row)
            })        
    }

    onAdd() {
        this.root.querySelector('.search button').onclick = () => {
            const { value } = this.root.querySelector('.search input')
            
            this.add(value)
        }
    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr').
            forEach(tr => tr.remove());
    }

    createRow() {
        const tr = document.createElement('tr')
        
        tr.innerHTML = `
        <td class="gitUser">
            <img src="https://github.com/maykbrito.png" alt="Imagem de Mayk Brito">
            <a href="https://github.com/maykbrito">
                <p>Mayk Brito</p>
                <span>/maykbrito</span>
            </a>
        </td>
        <td class="repositories">302</td>
        <td class="followers">15034</td>
        <td class="remove"><button>Remover</button></td>`

        return tr
    }

    createRowEmpty() {
        const tr = document.createElement('tr')
        
        tr.innerHTML = `
            <td>
            <img src="./src/starClear.svg" alt="Imagem de Mayk Brito">
            <p>Nenhum Favorito ainda</p>
            </td>
            <td></td>
            <td></td>
            <td></td>`

        return tr
    }
}