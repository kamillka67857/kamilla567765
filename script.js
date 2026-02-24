const tg = window.Telegram.WebApp;
tg.expand();

let cart = [];
let favorites = [];

// Фильтры и поиск
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');
const searchInput = document.getElementById('search');

function filterProducts() {
    const category = categoryFilter.value;
    const price = priceFilter.value;
    const query = searchInput.value.toLowerCase();

    document.querySelectorAll('.product-card').forEach(card => {
        const cardCategory = card.dataset.category;
        const cardPrice = parseInt(card.dataset.price); // убедись, что data-price число
        const cardTitle = card.querySelector('h2').innerText.toLowerCase();
        let show = true;

        // Фильтр по категории
        if (category !== 'all' && cardCategory !== category) show = false;

        // Фильтр по цене
        if (price === 'low' && cardPrice > 55000) show = false;       // до 55 000 ₽
        if (price === 'medium' && (cardPrice < 55000 || cardPrice > 75000)) show = false; // 55 000 - 75 000 ₽
        if (price === 'high' && cardPrice <= 75000) show = false;     // более 75 000 ₽

        // Фильтр по поиску
        if (!cardTitle.includes(query)) show = false;

        // Показать или скрыть карточку
        card.style.display = show ? 'block' : 'none';
    });
}

categoryFilter.addEventListener('change', filterProducts);
priceFilter.addEventListener('change', filterProducts);
searchInput.addEventListener('input', filterProducts);

// ----------------- Корзина -----------------
const cartBtn = document.getElementById('cart-btn');
const cartCount = document.getElementById('cart-count');

const cartPanel = document.getElementById('cart-panel');
const cartItemsPanel = document.getElementById('cart-items-panel');
const cartTotalPanel = document.getElementById('cart-total-panel');

// ----------------- Избранное -----------------
const favoritesPanel = document.getElementById('favorites-panel');
const favoritesItems = document.getElementById('favorites-items');
const favCount = document.getElementById('fav-count');

// ----------------- Общий overlay -----------------
const overlay = document.getElementById('overlay');

// ----------------- Функции корзины -----------------
function updateCartUI() {
    // mini корзина (иконка)
    let total = 0;
    cart.forEach(item => total += item.price * item.quantity);
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-total').textContent = total;
}

function updateCartPanel() {
    cartItemsPanel.innerHTML = '';
    let total = 0;

    if(cart.length === 0){
        cartItemsPanel.innerHTML = '<p>Корзина пуста</p>';
        cartTotalPanel.textContent = '0';
        return;
    }

    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <span>${item.name} — ${item.price} ₽ x${item.quantity}</span>
            <div>
                <button class="minus">−</button>
                <button class="plus">+</button>
            </div>
        `;

        div.querySelector('.plus').addEventListener('click', () => {
            cart[index].quantity++;
            updateCartPanel();
            updateCartUI();
        });

        div.querySelector('.minus').addEventListener('click', () => {
            if(cart[index].quantity > 1){
                cart[index].quantity--;
            } else {
                cart.splice(index, 1);
            }
            updateCartPanel();
            updateCartUI();
        });

        cartItemsPanel.appendChild(div);
        total += item.price * item.quantity;
    });

    cartTotalPanel.textContent = total;
}

// ----------------- Функции избранного -----------------
function updateFavoritesPanel() {
    favoritesItems.innerHTML = '';

    if(favorites.length === 0){
        favoritesItems.innerHTML = '<p>Пока нет избранных товаров</p>';
        return;
    }

    favorites.forEach(name => {
        const item = document.createElement('div');
        item.classList.add('fav-item');
        item.innerHTML = `
            <span>${name}</span>
            <button onclick="removeFromFavorites('${name}')">Удалить</button>
        `;
        favoritesItems.appendChild(item);
    });
}

function removeFromFavorites(name){
    favorites = favorites.filter(item => item !== name);
    favCount.textContent = favorites.length;

    document.querySelectorAll('.product-card').forEach(card => {
        if(card.querySelector('h2').innerText === name){
            const btn = card.querySelector('.favorite-btn');
            btn.classList.remove('active');
            btn.textContent = '🤍';
        }
    });

    updateFavoritesPanel();
}

// ----------------- Добавление товара в корзину -----------------
document.querySelectorAll('.cart-icon-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.product-card');
        const name = card.querySelector('h2').innerText;
        const price = parseInt(card.querySelector('.price').innerText.replace(/\D/g,''));

        const existing = cart.find(item => item.name === name);
        if(existing){
            existing.quantity++;
        } else {
            cart.push({name, price, quantity:1});
        }

        updateCartUI();
    });
});

// ----------------- Добавление в избранное -----------------
document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.product-card');
        const name = card.querySelector('h2').innerText;

        btn.classList.toggle('active');

        if(btn.classList.contains('active')){
            btn.textContent = '❤️';
            favorites.push(name);
        } else {
            btn.textContent = '🤍';
            favorites = favorites.filter(item => item !== name);
        }

        favCount.textContent = favorites.length;
    });
});

// ----------------- Открытие / закрытие панели избранного -----------------
document.getElementById('favorites-view-btn').addEventListener('click', () => {
    updateFavoritesPanel();
    favoritesPanel.classList.add('active');
    overlay.classList.add('active');
});

document.getElementById('close-favorites').addEventListener('click', () => {
    favoritesPanel.classList.remove('active');
    overlay.classList.remove('active');
});

// ----------------- Открытие / закрытие панели корзины -----------------
cartBtn.addEventListener('click', () => {
    updateCartPanel();
    cartPanel.classList.add('active');
    overlay.classList.add('active');
});

document.getElementById('close-cart').addEventListener('click', () => {
    cartPanel.classList.remove('active');
    overlay.classList.remove('active');
});

// ----------------- Закрытие overlay -----------------
overlay.addEventListener('click', () => {
    cartPanel.classList.remove('active');
    favoritesPanel.classList.remove('active');
    overlay.classList.remove('active');
});
const chatPanel = document.getElementById('chat-panel');
const chatMessages = document.getElementById('chat-messages');
const chatText = document.getElementById('chat-text');
const chatSend = document.getElementById('chat-send');
const chatBtn = document.getElementById('chat-btn');

// Открытие чата
chatBtn.addEventListener('click', () => {
    chatPanel.classList.add('active');
    overlay.classList.add('active');
});

// Закрытие чата
document.getElementById('close-chat').addEventListener('click', () => {
    chatPanel.classList.remove('active');
    overlay.classList.remove('active');
});

// Отправка сообщения
chatSend.addEventListener('click', () => {
    const msg = chatText.value.trim();
    if(msg === '') return;

    // Сообщение пользователя
    const userMsg = document.createElement('div');
    userMsg.classList.add('user-msg');
    userMsg.textContent = msg;
    chatMessages.appendChild(userMsg);

    chatText.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Автоответ поддержки
    setTimeout(() => {
        const supportMsg = document.createElement('div');
        supportMsg.classList.add('support-msg');
        supportMsg.textContent = 'Спасибо за сообщение! Мы скоро ответим.';
        chatMessages.appendChild(supportMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
});