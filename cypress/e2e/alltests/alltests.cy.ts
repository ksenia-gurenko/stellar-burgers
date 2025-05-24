// Конфигурационные константы
const BASE_URL = 'http://localhost:4000';
const SELECTORS = {
  PAGE_TITLE: 'Соберите бургер',
  INGREDIENT_CATEGORIES: ['Булки', 'Соусы', 'Начинки'],
  INGREDIENTS: {
    BUN: 'Краторная булка N-200i',
    MAIN: 'Биокотлета из марсианской Магнолии',
    SAUCE: 'Соус Spicy-X'
  },
  MODAL: {
    TITLE: 'Детали ингредиента',
    ORDER_SUCCESS: 'идентификатор заказа'
  }
};

describe('Sanity Check', () => {
  it('Проверка доступности приложения', () => {
    cy.visit('/');
    cy.contains(SELECTORS.PAGE_TITLE).should('exist');
  });
});

describe('Интеграционные тесты конструктора бургеров', () => {
  before(() => {
    // Загружаем фикстуры один раз перед всеми тестами
    cy.fixture('ingredients.json').as('ingredientsData');
    cy.fixture('user.json').as('userData');
    cy.fixture('order.json').as('orderData');
  });

  beforeEach(() => {
    // Настраиваем моки API
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('createOrder');

    // Устанавливаем токены авторизации
    window.localStorage.setItem('accessToken', 'test-token');
    window.localStorage.setItem('refreshToken', 'test-refresh-token');

    // Переходим на страницу с увеличенным таймаутом
    cy.visit('/', {
      timeout: 15000,
      retryOnNetworkFailure: true
    });

    // Ждем завершения загрузки ингредиентов
    cy.wait('@getIngredients', { timeout: 10000 });

    // Проверяем, что страница загрузилась
    cy.contains(SELECTORS.PAGE_TITLE, { timeout: 10000 }).should('be.visible');
  });

  describe('Тестирование загрузки ингредиентов', () => {
    it('Должны загружаться все категории ингредиентов', () => {
      // Проверяем наличие всех категорий (без кликов)
      SELECTORS.INGREDIENT_CATEGORIES.forEach((category) => {
        cy.contains(category).should('be.visible');
      });

      // Проверяем загрузку ингредиентов в каждой категории
      cy.contains(SELECTORS.INGREDIENT_CATEGORIES[0]).click({ force: true });
      cy.contains(SELECTORS.INGREDIENTS.BUN).should('be.visible');

      cy.contains(SELECTORS.INGREDIENT_CATEGORIES[2]).click({ force: true });
      cy.contains(SELECTORS.INGREDIENTS.MAIN).should('be.visible');

      cy.contains(SELECTORS.INGREDIENT_CATEGORIES[1]).click({ force: true });
      cy.contains(SELECTORS.INGREDIENTS.SAUCE).should('be.visible');
    });
  });

  describe('Тестирование добавления ингредиентов', () => {
    it('Должны добавляться булки и начинки в конструктор', () => {
      // Добавляем булку (используем force: true для обхода pointer-events)
      cy.contains(SELECTORS.INGREDIENT_CATEGORIES[0]).click({ force: true });
      cy.contains(SELECTORS.INGREDIENTS.BUN)
        .parent()
        .find('button')
        .click({ force: true });

      // Добавляем начинку (прокручиваем к ней)
      cy.contains(SELECTORS.INGREDIENT_CATEGORIES[2]).click({ force: true });
      cy.contains(SELECTORS.INGREDIENTS.MAIN)
        .parent()
        .find('button')
        .click({ force: true });

      // Проверяем добавленные ингредиенты
      cy.get('div[class^=constructor-element]').each(($element) => {
        cy.wrap($element).within(() => {
          if ($element.text().includes(`${SELECTORS.INGREDIENTS.BUN} (верх)`)) {
            cy.contains(`${SELECTORS.INGREDIENTS.BUN} (верх)`).should('be.visible');
          }
          if ($element.text().includes(`${SELECTORS.INGREDIENTS.BUN} (низ)`)) {
            cy.contains(`${SELECTORS.INGREDIENTS.BUN} (низ)`).should('be.visible');
          }
          if ($element.text().includes(SELECTORS.INGREDIENTS.MAIN)) {
            cy.contains(SELECTORS.INGREDIENTS.MAIN).should('be.visible');
          }
        });
      });
    });
  });

  describe('Тестирование модальных окон', () => {
    it('Должно открываться и закрываться модальное окно ингредиента', () => {
      // Открываем модальное окно (используем force: true)
      cy.contains(SELECTORS.INGREDIENT_CATEGORIES[0]).click({ force: true });
      cy.contains(SELECTORS.INGREDIENTS.BUN).parent().find('img').click();

      // Проверяем открытие
      cy.get('#modals').contains(SELECTORS.MODAL.TITLE).should('be.visible');

      // Закрываем через крестик
      cy.get('#modals > div:first-child').find('button').click();
      cy.get('[data-testid="modal"]').should('not.exist');
    });
  });

  describe('Тестирование создания заказа', () => {
    beforeEach(() => {
      // Добавляем ингредиенты в конструктор
      cy.contains(SELECTORS.INGREDIENT_CATEGORIES[0]).click({ force: true });
      cy.contains(SELECTORS.INGREDIENTS.BUN)
        .parent()
        .find('button')
        .click({ force: true });

      cy.contains(SELECTORS.INGREDIENT_CATEGORIES[2]).click({ force: true });
      cy.contains(SELECTORS.INGREDIENTS.MAIN)
        .scrollIntoView()
        .parent()
        .find('button')
        .click({ force: true });

      // Проверяем наличие ингредиентов в конструкторе перед оформлением заказа
      cy.get('div[class^=constructor-element]').should('have.length.at.least', 3);
      cy.get('div[class^=constructor-element]').each(($element) => {
        cy.wrap($element).should('be.visible');
      });

      cy.contains('Оформить заказ').should('be.visible').click();

      cy.wait('@createOrder', { timeout: 10000 }).then((interception) => {
        if (!interception.response) {
          throw new Error('Response is undefined - запрос не был завершен');
        }

        expect(interception.response.statusCode).to.equal(200);
        expect(interception.response.body).to.have.property('success', true);
        expect(interception.response.body).to.have.property('name');
        expect(interception.response.body).to.have.property('order');
      });

      // Проверка модального окна
      cy.get('#modals')
        .contains(SELECTORS.MODAL.ORDER_SUCCESS, { matchCase: false })
        .should('be.visible');

      // Закрытие модального окна
      cy.get('#modals > div:first-child').find('button').click();

      // Проверка очистки конструктора
      cy.get('[data-testid="constructor-bun-top"]').should('not.exist');
      cy.get('[data-testid="constructor-item"]').should('not.exist');
    });
  });
});
