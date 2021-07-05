import styles from './style.css' assert { type: 'css' };
import data from './data/info.json' assert { type: 'json' };

document.adoptedStyleSheets = [styles];

console.log(data.name.first);
