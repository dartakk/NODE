const fs = require('fs');

const content = 'Esercizio numero 8';

fs.writeFile('ex8.txt', content, (error,) => {
    if (error) {
        console.error("Errore nella scrittura del file", error);
    } else {
        console.log('File scritto con successo');
    }
});
