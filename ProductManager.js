const fs = require('fs')
const fe = require('fs').promises;

const filename = './Usuarios.json'

class ProductManager {

    #products

    #lastId = 1


    async initialize() {
        this.#products = await this.readUsersFromFile()
    }


    async generarArchivoSiNoExiste(filename) {
        try {

            await fe.access(filename);

            return 'El archivo ya existe. No se generará uno nuevo.';
        } catch (error) {

            try {
                await fe.writeFile(filename, []);
                return 'Archivo generado exitosamente.';
            } catch (error) {
                return 'Error al generar el archivo:' + error;
            }
        }
    }



    async getProducts() {
        try {
            const usersFileContent = await fs.promises.readFile(filename, 'utf-8')
            return JSON.parse(usersFileContent)
        }
        catch (err) {
            return []
        }
    }

    async getProductById(id) {

        let product = []

        let p = this.#products.map(function (element) {


            if (element.id == id) {
                product = [{ "id": element.id, "title": element.title, "price": element.price, "thumbnail": element.thumbnail, "code": element.code, "stock": element.stock }]
            }

        })

        if (product.length === 0) {
            return "No se encontro ningun producto con ese id"
        } else {
            return product
        }

    }

    #getNewId() {
        const id = this.#lastId
        this.#lastId += 1
        return id
    }

    async #findByCode(c) {

        let v = 1

        let code = this.#products.map(function (element) {
            if (element.code == c) {

                v = 0
                return v
            }

        })

        return v

    }


    async addProduct(title, price, thumbnail, code, stock) {
        try {
            if (title === "" || price === "" || thumbnail === "" || code === "" || stock === "") {
                return "Es obligatorio completar todos los campos";
            }

            const codigo = await this.#findByCode(code);

            if (codigo === 0) {
                return "El código ya existe";
            } else {
                const product = {
                    id: this.#getNewId(),
                    title,
                    price,
                    thumbnail,
                    code,
                    stock
                };

                this.#products.push(product);

                await this.#updateFile();

                return "Producto agregado";
            }
        } catch (error) {
            console.error("Error:", error);
            return "Error al agregar el producto: " + error.message;
        }
    }

    async updateProduct(id, nuevosDatos) {
        try {
            let indice = this.#products.findIndex(producto => producto.id === id);

            if (indice !== -1) {
                this.#products[indice] = { ...this.#products[indice], ...nuevosDatos };


                await this.#updateFile();

                return "Cargado exitosamente";
            } else {
                return "No se encontró un objeto con el ID proporcionado.";
            }
        } catch (error) {
            console.error('Error al actualizar el archivo:', error);
            return "Error al actualizar el archivo.";
        }
    }

    async deleteProduct(id) {
        try {
            let indice = this.#products.findIndex(producto => producto.id === id);

            if (indice !== -1) {

                this.#products.splice(indice, 1);


                await this.#updateFile();

                return "Eliminado exitosamente";
            } else {
                return "No se encontró un objeto con el ID proporcionado.";
            }
        } catch (error) {

            return "Error al eliminar el producto: " + error;
        }
    }

    async #updateFile() {
        try {
            await fs.promises.writeFile(filename, JSON.stringify(this.#products, null, '\t'));
        } catch (error) {
            console.error('Error al escribir en el archivo:', error);
            throw error;
        }
    }

    async readUsersFromFile() {
        try {
            const usersFileContent = await fs.promises.readFile(filename, 'utf-8')
            return JSON.parse(usersFileContent)
        }
        catch (err) {
            return []
        }
    }
}


const main = async () => {

    const productmanager = new ProductManager()

    console.log("-----------GENERAR=ARCHIVO----------")

    console.log(await productmanager.generarArchivoSiNoExiste('Usuarios.json'));


    await productmanager.initialize()


    console.log("-----------GET-PRODUCTS----------")

    console.log(await productmanager.getProducts())

    console.log("-----------ADD-PRODUCTS----------")

    console.log(await productmanager.addProduct("dd", "33", "dadwadd", "dda2", "22"))

    console.log(await productmanager.addProduct("ddd", "33d", "dadwadd", "dda2d", "22"))

    console.log("-----------GET-PRODUCTS----------")

    console.log(await productmanager.getProducts())

    console.log("-----------UPDATE----------")

    console.log(await productmanager.updateProduct(1, { "price": "40", "stock": "30" }))

    console.log("-----------GET-PRODUCTS-BY-ID----------")

    console.log(await productmanager.getProductById(1))
    console.log(await productmanager.getProductById(5))

    console.log("-----------DELETE-PRODUCT----------")

    console.log(await productmanager.deleteProduct(2))
    console.log(await productmanager.deleteProduct(5))

}

main()







