document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.getElementById('card-container');
    const setaDireita = document.getElementById('seta-direita');
    const setaEsquerda = document.getElementById('seta-esquerda');
    let currentIndex = 0;

    const cart = [];

    // Criar os cards de pizza
    const createPizzaCard = (pizza) => {
        const card = document.createElement('section');
        card.innerHTML = `
            <img src="${pizza.imagem}" alt="${pizza.nome}">
            <article>
                <h2>${pizza.nome}</h2>
                <p>${pizza.recheio}</p>
            </article>
            <div>
                <p>R$${pizza.preço.toFixed(2)}</p>
                <button class="buy-button" data-id="${pizza.id}">Comprar</button>
            </div>
        `;
        return card;
    };

    const addToCart = (pizza) => {
        const existingItem = cart.find(item => item.id === pizza.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...pizza, quantity: 1 });
        }
        console.log(cart); // Debugging: verifique o estado do carrinho
        updateCart();
    };

    const updateCart = () => {
        const cartTable = document.querySelector('.meuPedido table tbody');
        cartTable.innerHTML = `
            <tr>
                <td>Item</td>
                <td>Pizza</td>
                <td>Valor</td>
                <td></td>
            </tr>
        `;
        cart.forEach((item, index) => {
            cartTable.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.nome}</td>
                    <td>R$ ${(item.preço * item.quantity).toFixed(2)}</td>
                    <td>
                        <div class="trashmore">
                            <button class="trash" data-id="${item.id}"><i class="bi bi-trash"></i></button>
                            <p>${item.quantity}</p>
                            <button class="more" data-id="${item.id}"><i class="bi bi-plus-lg"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        });
        updateTotal();
    };

    const updateTotal = () => {
        const cartTable = document.querySelector('.meuPedido table tbody');
        const totalElement = document.querySelector('.total table tbody');
        const totalAmountSpan = document.getElementById('total-amount');
    
        const total = cart.reduce((sum, item) => sum + item.preço * item.quantity, 0);
    
        cartTable.innerHTML = `
            <tr>
                <td>Item</td>
                <td>Pizza</td>
                <td>Valor</td>
                <td></td>
            </tr>
        `;
    
        cart.forEach((item, index) => {
            cartTable.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.nome}</td>
                    <td>R$ ${(item.preço * item.quantity).toFixed(2)}</td>
                    <td>
                        <div class="trashmore">
                            <button class="trash" data-id="${item.id}"><i class="bi bi-trash"></i></button>
                            <p>${item.quantity}</p>
                            <button class="more" data-id="${item.id}"><i class="bi bi-plus-lg"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        });
    
        totalElement.innerHTML = `
            <tr>
                <td>Total</td>
                <td>R$ ${total.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Taxa de entrega</td>
                <td class="gratis">Grátis</td>
            </tr>
            <tr>
                <td><b>Subtotal</b></td>
                <td><b>R$ ${total.toFixed(2)}</b></td>
            </tr>
        `;
    
        totalAmountSpan.textContent = `Total: R$ ${total.toFixed(2)}`;
    };
    
    // Evento para manipular o clique nos botões do carrinho
    document.querySelector('.meuPedido').addEventListener('click', (event) => {
        const id = event.target.closest('button')?.getAttribute('data-id');
        if (!id) return;
    
        const item = cart.find(item => item.id === id);
        if (!item) return;
    
        if (event.target.closest('button').classList.contains('more')) {
            item.quantity += 1;
        } else if (event.target.closest('button').classList.contains('trash')) {
            item.quantity -= 1;
            if (item.quantity <= 0) {
                cart.splice(cart.indexOf(item), 1);
            }
        }
    
        updateTotal();
    });
    
    // Função para carregar as pizzas e inicializar
    const loadPizzas = async () => {
        try {
            const response = await fetch('data/db.json');
            const data = await response.json();
            data.pizzas.forEach(pizza => {
                const pizzaCard = createPizzaCard(pizza);
                document.getElementById('card-container').appendChild(pizzaCard);
            });
    
            // Delegação de eventos para o botão de compra
            document.getElementById('card-container').addEventListener('click', (event) => {
                if (event.target.classList.contains('buy-button')) {
                    const pizzaId = event.target.getAttribute('data-id');
                    const pizza = data.pizzas.find(pizza => pizza.id === pizzaId);
                    addToCart(pizza);
                }
            });
        } catch (error) {
            console.error('Erro ao carregar os dados das pizzas:', error);
        }
    };
    
    loadPizzas(); // Iniciar o carregamento das pizzas ao carregar a página
    

    // Mostrar o próximo card
    const showNextCard = () => {
        const cards = document.querySelectorAll('#card-container section');
        if (currentIndex < cards.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateCarousel();
    };

    // Mostrar o card anterior
    const showPreviousCard = () => {
        const cards = document.querySelectorAll('#card-container section');
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = cards.length - 1;
        }
        updateCarousel();
    };

    // Atualizar o carrossel ( fim - inicio - fim : viceversa)
    const updateCarousel = () => {
        const cards = document.querySelectorAll('#card-container section');
        cards.forEach((card, index) => {
            card.style.transform = `translateX(-${currentIndex * 70}%)`;
        });
    };

    // Eventos aos botões de navegação
    setaDireita.addEventListener('click', showNextCard);
    setaEsquerda.addEventListener('click', showPreviousCard);

    // Carrega os dados das pizzas
    // Note: Esta chamada foi removida pois já estamos chamando `loadPizzas()` acima.
});

document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('nav a');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = link.getAttribute('href').substring(1); // Remove o #
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 150; // Ajuste fino para considerar o cabeçalho fixo
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth' // Scroll suave
                });
            }
        });
    });
});

function scrollToSection(sectionId) {
    const offset = 135;  // Ajuste este valor conforme necessário
    const element = document.getElementById(sectionId);
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

var modal = document.getElementById("loginModal");
var userIcon = document.getElementById("userIcon");
var span = document.getElementsByClassName("close")[0];

// Quando o usuário clicar no ícone, abre o modal
userIcon.onclick = function() {
    modal.style.display = "flex"; // Muda de "block" para "flex"
}

// Quando o usuário clicar no "x", fecha o modal
span.onclick = function() {
    modal.style.display = "none";
}

// Quando o usuário clicar em qualquer lugar fora do modal, fecha o modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

document.getElementById("form-login").addEventListener("submit", async function(event) {
    event.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    try {
        const response = await fetch(`http://localhost:8088/users?username=${username}&password=${password}`);
        const users = await response.json();
        
        if (users.length > 0) {
            alert("Login bem-sucedido!");
            // Exibir o nome do usuário logado
            const loggedInUser = users[0].username;
            document.getElementById("loggedInUser").textContent = loggedInUser;

            // Fechar o modal de login
            closeModal();

            // Limpar os campos do formulário de login
            document.getElementById("form-login").reset();
        } else {
            alert("Nome de usuário ou senha incorretos!");
        }
    } catch (error) {
        console.error("Erro ao tentar fazer login:", error);
    }
});

function closeModal() {
    document.getElementById("loginModal").style.display = "none";
}

document.getElementById("form-signup").addEventListener("submit", async function(event) {
    event.preventDefault();
    const username = document.getElementById("signup-username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const passwordConfirm = document.getElementById("signup-password-confirm").value;

    if (password !== passwordConfirm) {
        alert("As senhas não correspondem!");
        return;
    }

    const newUser = {
        username: username,
        email: email,
        password: password
    };

    try {
        const response = await fetch("http://localhost:8088/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
        });

        if (response.ok) {
            alert("Cadastro bem-sucedido!");
            document.getElementById("form-signup").reset();
        } else {
            alert("Erro ao cadastrar. Por favor, tente novamente.");
        }
    } catch (error) {
        console.error("Erro ao tentar cadastrar:", error);
    }
});


// Função para buscar os dados dos diferentes endpoints
async function fetchPrices() {
    try {
        const massaResponse = await fetch('http://localhost:8088/massa');
        const bordaResponse = await fetch('http://localhost:8088/borda');
        const ingredientesResponse = await fetch('http://localhost:8088/ingredientes');
        const tamanhoResponse = await fetch('http://localhost:8088/tamanho');

        const massa = await massaResponse.json();
        const borda = await bordaResponse.json();
        const ingredientes = await ingredientesResponse.json();
        const tamanho = await tamanhoResponse.json();

        return { massa, borda, ingredientes, tamanho };
    } catch (error) {
        console.error('Erro ao buscar os preços:', error);
    }
}

// Função para calcular o preço total da pizza montada
async function calculatePrice() {
    const prices = await fetchPrices();
    let totalPrice = 0;

    // Capturar massa selecionada
    const massa = document.querySelector('input[placeholder="Selecione um tipo de massa"]').value;
    if (massa) {
        totalPrice += prices.massa[massa] || 0;
    }

    // Capturar borda selecionada
    const borda = document.querySelector('input[placeholder="Selecione um tipo de borda"]').value;
    if (borda) {
        totalPrice += prices.borda[borda] || 0;
    }

    // Capturar ingredientes selecionados
    const ingredientesInputs = document.querySelectorAll('.ingredientes');
    ingredientesInputs.forEach(input => {
        const ingrediente = input.value;
        if (ingrediente) {
            totalPrice += prices.ingredientes[ingrediente] || 0;
        }
    });

    // Capturar tamanho selecionado
    const tamanho = document.querySelector('input[placeholder="Selecione o tamanho da pizza"]').value;
    if (tamanho) {
        totalPrice += prices.tamanho[tamanho] || 0;
    }

    // Exibir o preço total calculado
    document.getElementById('total-price').innerText = `Total: R$${totalPrice.toFixed(2)}`;

    // Retornar o preço total para uso posterior
    return totalPrice;
}
// Chamar input e valor -- somar
document.querySelector('input[placeholder="Selecione um tipo de massa"]').addEventListener('input', calculatePrice);
document.querySelector('input[placeholder="Selecione um tipo de borda"]').addEventListener('input', calculatePrice);
document.querySelectorAll('.ingredientes').forEach(input => input.addEventListener('input', calculatePrice));
document.querySelector('input[placeholder="Selecione o tamanho da pizza"]').addEventListener('input', calculatePrice);

document.getElementById('cart-icon').addEventListener('click', function() {
    var cart = document.getElementById('cart');
    cart.classList.toggle('open');  
});

document.getElementById('close-cart').addEventListener('click', function() {
    var cart = document.getElementById('cart');
    cart.classList.remove('open');
});

document.getElementById('cancel-button').addEventListener('click', function() {
    var cart = document.getElementById('cart');
    cart.classList.remove('open');
});

document.querySelector('.meuPedido').addEventListener('click', (event) => {
    const id = event.target.closest('button')?.getAttribute('data-id');
    if (!id) return;

    const item = cart.find(item => item.id === id);
    if (!item) return;

    if (event.target.closest('button').classList.contains('more')) {
        item.quantity += 1;
    } else if (event.target.closest('button').classList.contains('trash')) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            cart.splice(cart.indexOf(item), 1);
        }
    }

    updateCart();
});

// document.getElementById('carrinho').addEventListener('click', function alertSimulacao(){
//     alert("É apenas uma simulação!!!\nEntre em contato com a pizzaria\n(11) 4002-8922\n(11) 95231-0981") 
// }) 

document.getElementById('carrinho').addEventListener('click', async function() {
    const pizza = await calculatePrice();
    addToCart(pizza);
    alert("Adicionado ao carrinho!");
});

async function calculatePrice() {
    const prices = await fetchPrices();
    let totalPrice = 0;

    const massa = document.querySelector('input[placeholder="Selecione um tipo de massa"]').value;
    const borda = document.querySelector('input[placeholder="Selecione um tipo de borda"]').value;
    const ingredientesInputs = document.querySelectorAll('.ingredientes');
    const tamanho = document.querySelector('input[placeholder="Selecione o tamanho da pizza"]').value;

    const ingredientes = Array.from(ingredientesInputs).map(input => input.value).filter(value => value);

    if (massa) {
        totalPrice += prices.massa[massa] || 0;
    }
    if (borda) {
        totalPrice += prices.borda[borda] || 0;
    }
    ingredientes.forEach(ingrediente => {
        if (ingrediente) {
            totalPrice += prices.ingredientes[ingrediente] || 0;
        }
    });
    if (tamanho) {
        totalPrice += prices.tamanho[tamanho] || 0;
    }

    document.getElementById('total-price').innerText = `Total: R$${totalPrice.toFixed(2)}`;

    return {
        id: `custom-${Date.now()}`,
        nome: `Pizza ${tamanho}`,
        recheio: `Massa: ${massa}, Borda: ${borda}, Ingredientes: ${ingredientes.join(', ')}`,
        preço: totalPrice,
        quantidade: 1
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.getElementById('card-container');
    const setaDireita = document.getElementById('seta-direita');
    const setaEsquerda = document.getElementById('seta-esquerda');
    let currentIndex = 0;

    const cart = [];

    const createPizzaCard = (pizza) => {
        const card = document.createElement('section');
        card.innerHTML = `
            <img src="${pizza.imagem}" alt="${pizza.nome}">
            <article>
                <h2>${pizza.nome}</h2>
                <p>${pizza.recheio}</p>
            </article>
            <div>
                <p>R$${pizza.preço.toFixed(2)}</p>
                <button class="buy-button" data-id="${pizza.id}">Comprar</button>
            </div>
        `;
        return card;
    };

    const addToCart = (pizza) => {
        const existingItem = cart.find(item => item.id === pizza.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...pizza, quantity: 1 });
        }
        console.log(cart); // Debugging: verifique o estado do carrinho
        updateCart();
    };

    const updateCart = () => {
        const cartTable = document.querySelector('.meuPedido table tbody');
        cartTable.innerHTML = `
            <tr>
                <td>Item</td>
                <td>Pizza</td>
                <td>Valor</td>
                <td></td>
            </tr>
        `;
        cart.forEach((item, index) => {
            cartTable.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.nome}</td>
                    <td>R$ ${(item.preço * item.quantity).toFixed(2)}</td>
                    <td>
                        <div class="trashmore">
                            <button class="trash" data-id="${item.id}"><i class="bi bi-trash"></i></button>
                            <p>${item.quantity}</p>
                            <button class="more" data-id="${item.id}"><i class="bi bi-plus-lg"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        });
        updateTotal();
    };

    const updateTotal = () => {
        const totalElement = document.querySelector('.total table tbody');
        const total = cart.reduce((sum, item) => sum + item.preço * item.quantity, 0);
        totalElement.innerHTML = `
            <tr>
                <td>Total</td>
                <td>R$ ${total.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Taxa de entrega</td>
                <td class="gratis">Grátis</td>
            </tr>
            <tr>
                <td><b>Subtotal</b></td>
                <td><b>R$ ${total.toFixed(2)}</b></td>
            </tr>
        `;
    };

    document.querySelector('.meuPedido').addEventListener('click', (event) => {
        const id = event.target.closest('button')?.getAttribute('data-id');
        if (!id) return;
    
        const item = cart.find(item => item.id === id);
        if (!item) return;
    
        if (event.target.closest('button').classList.contains('more')) {
            item.quantity += 1;
        } else if (event.target.closest('button').classList.contains('trash')) {
            item.quantity -= 1;
            if (item.quantity <= 0) {
                cart.splice(cart.indexOf(item), 1);
            }
        }
    
        updateCart();
    });
    

    const loadPizzas = async () => {
        try {
            const response = await fetch('data/db.json'); // Altere para o caminho correto do seu db.json
            const data = await response.json();
            const cardContainer = document.getElementById('card-container');
            data.pizzas.forEach(pizza => {
                const pizzaCard = createPizzaCard(pizza);
                cardContainer.appendChild(pizzaCard);
            });

            // Delegação de eventos
            cardContainer.addEventListener('click', (event) => {
                if (event.target.classList.contains('buy-button')) {
                    alert("Adicionado ao carrinho!");
                    const pizzaId = event.target.getAttribute('data-id');
                    const pizza = data.pizzas.find(pizza => pizza.id === pizzaId);
                    addToCart(pizza);
                }
            });
        } catch (error) {
            console.error('Erro ao carregar os dados das pizzas:', error);
        }
    };

    loadPizzas();

    const showNextCard = () => {
        const cards = document.querySelectorAll('#card-container section');
        if (currentIndex < cards.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateCarousel();
    };

    const showPreviousCard = () => {
        const cards = document.querySelectorAll('#card-container section');
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = cards.length - 1;
        }
        updateCarousel();
    };

    const updateCarousel = () => {
        const cards = document.querySelectorAll('#card-container section');
        cards.forEach((card, index) => {
            card.style.transform = `translateX(-${currentIndex * 70}%)`;
        });
    };

    setaDireita.addEventListener('click', showNextCard);
    setaEsquerda.addEventListener('click', showPreviousCard);

    async function fetchPrices() {
        try {
            const massaResponse = await fetch('http://localhost:8088/massa');
            const bordaResponse = await fetch('http://localhost:8088/borda');
            const ingredientesResponse = await fetch('http://localhost:8088/ingredientes');
            const tamanhoResponse = await fetch('http://localhost:8088/tamanho');
    
            const massa = await massaResponse.json();
            const borda = await bordaResponse.json();
            const ingredientes = await ingredientesResponse.json();
            const tamanho = await tamanhoResponse.json();
    
            return { massa, borda, ingredientes, tamanho };
        } catch (error) {
            console.error('Erro ao buscar os preços:', error);
        }
    }
    
    async function calculatePrice() {
        const prices = await fetchPrices();
        let totalPrice = 0;
    
        const massa = document.querySelector('input[placeholder="Selecione um tipo de massa"]').value;
        const borda = document.querySelector('input[placeholder="Selecione um tipo de borda"]').value;
        const ingredientesInputs = document.querySelectorAll('.ingredientes');
        const tamanho = document.querySelector('input[placeholder="Selecione o tamanho da pizza"]').value;
    
        const ingredientes = Array.from(ingredientesInputs).map(input => input.value).filter(value => value);
    
        if (massa) {
            totalPrice += prices.massa[massa] || 0;
        }
        if (borda) {
            totalPrice += prices.borda[borda] || 0;
        }
        ingredientes.forEach(ingrediente => {
            if (ingrediente) {
                totalPrice += prices.ingredientes[ingrediente] || 0;
            }
        });
        if (tamanho) {
            totalPrice += prices.tamanho[tamanho] || 0;
        }
    
        document.getElementById('total-price').innerText = `Total: R$${totalPrice.toFixed(2)}`;
    
        return {
            id: `custom-${Date.now()}`,
            nome: `Pizza ${tamanho}`,
            recheio: `Massa: ${massa}, Borda: ${borda}, Ingredientes: ${ingredientes.join(', ')}`,
            preço: totalPrice,
            quantidade: 1
        };
    }

    document.getElementById('carrinho').addEventListener('click', async function() {
        const pizza = await calculatePrice();
        addToCart(pizza);
        alert("Adicionado ao carrinho!");
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const finalizarButton = document.getElementById('finalizar-compra-button');
    const finalizarModal = document.getElementById('finalizarModal');
    const closeButton = document.querySelector('.modal .close');
    const cartModal = document.getElementById('cart');

    finalizarButton.addEventListener('click', () => {
        cartModal.style.display = 'none'; // Fecha o modal do carrinho
        finalizarModal.style.display = 'block'; // Exibe o modal de finalização
    });

    closeButton.addEventListener('click', () => {
        finalizarModal.style.display = 'none'; // Esconde o modal de finalização
        cartModal.style.display = 'block'; // Reabre o modal do carrinho (se necessário)
    });

    window.addEventListener('click', (event) => {
        if (event.target == finalizarModal) {
            finalizarModal.style.display = 'none'; // Esconde o modal de finalização ao clicar fora dele
            cartModal.style.display = 'block'; // Reabre o modal do carrinho (se necessário)
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const cartModal = document.getElementById("cart");
    const finalizarCadastroModal = document.getElementById("finalizar-cadastro-modal");
    const confirmButton = document.getElementById("confirmar-pedido-button");
    const totalAmountElement = document.getElementById("total-amount");

    // Função para calcular o valor total do carrinho
    function calcularTotalCarrinho() {
        let total = 0;
        // Suponha que os itens do carrinho estejam armazenados em um array chamado 'cartItems'
        cartItems.forEach(item => {
            total += item.price * item.quantity;
        });
        totalAmountElement.textContent = `Total: R$${total.toFixed(2)}`;
    }

    // Chamar a função para calcular o total do carrinho quando a página for carregada
    calcularTotalCarrinho();

    // Evento de clique no botão "Confirmar pedido"
    confirmButton.addEventListener("click", function() {
        alert("Seu pedido foi enviado para loja, em 30 minutos poderá fazer a retirada");
        finalizarCadastroModal.style.display = "none";
        cartModal.style.display = "none";
        // Aqui você pode adicionar qualquer lógica para limpar o carrinho ou redirecionar o usuário
        // Por exemplo:
        // window.location.href = "/index.html";
    });

    // Atualizar o valor total do carrinho sempre que houver uma mudança no carrinho
    // Suponha que exista uma função que atualiza o carrinho e chame essa função ao final
    function atualizarCarrinho() {
        // Sua lógica de atualização do carrinho
        calcularTotalCarrinho();
    }

    // Exemplo de como você pode integrar essa função de atualização em outros lugares
    // document.querySelector("#algum-botao-de-atualizar").addEventListener("click", atualizarCarrinho);
});

// Selecionar o botão "Confirmar pedido"
const confirmarPedidoButton = document.getElementById('confirmar-pedido-button');

// Adicionar evento de clique ao botão
confirmarPedidoButton.addEventListener('click', () => {
    alert("Pedido enviado à loja.\nEm 30 minutos seu pedido estará pronto para retirada.\n\nPagamento é feito na retirada");

    // Fechar o modal
    const modal = document.getElementById('finalizarModal');
    modal.style.display = 'none';  // Esconder o modal
    location.reload()
});
    

