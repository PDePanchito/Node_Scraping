const {Builder, By, Key, until} = require('selenium-webdriver');
const fs = require('fs');

(async function webscraper() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get('https://www.jumbo.cl/login');

    // Encuentra los campos de usuario y contraseña y el botón para cerrar el modal.
    let user = await driver.findElement(By.css('#general-portal > div > div.new-modal-content > form > div.new-modal-scroll > div > div:nth-child(1) > label > input'));
    let password = await driver.findElement(By.css('#general-portal > div > div.new-modal-content > form > div.new-modal-scroll > div > div:nth-child(2) > label > input'));

    // Escribe el usuario y la contraseña y presiona enter.
    // Modifica estas variables para incluir tus datos de inicio de sesión.
    await user.sendKeys('');
    await password.sendKeys('', Key.RETURN);

    // Espera hasta que la página se haya cargado después de enviar el formulario.
    await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 2 segundos

    // Navega a la página de 'mis datos'
    await driver.get('https://www.jumbo.cl/mis-datos');

    await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 2 segundos

    // Encuentra los elementos con la clase 'info-row' y extrae su texto.
    let information = await driver.findElements(By.className('info-row'))
    let infoRows = []

    for (let info of information) {
        let infoText = await info.getText()
        infoText = infoText.replace('\n', ': ')
        infoRows.push(infoText)
    }

    // Escribe la información en un archivo JSON
    fs.writeFileSync('clientInformation.json', JSON.stringify(infoRows, null, 2));

    let cookies = await driver.manage().getCookies();

    // Encuentra la cookie 'shopping-list' dentro de las cookies obtenidas
    let shoppingListCookie = cookies.find(cookie => cookie.name === 'shopping-list');

    // Escribe la cookie en un archivo JSON
    fs.writeFileSync('cookies.json', JSON.stringify(shoppingListCookie, null, 2));

  } finally {
    console.log('Revisa las cookies bro!')
  }
})();
