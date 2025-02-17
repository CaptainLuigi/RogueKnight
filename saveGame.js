/**
 * Speichert ein Objekt als String
 * @param {*} key Zuordnung eines Names zum Laden
 * @param {*} value Inhalt, Typ bzw. Wert egal
 */
function storeData(key, value) {
  //Erzeugt ein Array mit dem Wert in Value und weißt das der Variablen String zu
  let string = [value];
  //Wert wird in String umgewandelt
  string = JSON.stringify(string);
  //Der Wert von String wird mit dem Namen in key im localStorage abgelegt
  localStorage.setItem(key, string);
}
/**
 *
 * @param {*} key Zuordnung eines Names zum Laden, muss gleicher Name sein
 * @returns gibt den Wert mit gespeicherten Namen zurück
 */
function loadData(key) {
  //der Variablen string wird der Wert zugeordnet, der in localStorage abgelegt wurde (mit Name in key)
  let string = localStorage.getItem(key);
  //Test ob unter dem Namen was abgelegt wurde, wenn null
  if (string == null) {
    //dann null zurück geben
    return null;
    //ansonsten
  } else {
    //String wieder in Objekt umwandeln
    string = JSON.parse(string);
    //1. Wert aus Array zurückgeben
    return string[0];
  }
}

class globalSettings {
  static get isTutorial() {
    return loadData("globalSetting_isTutorial") ?? false;
  }
  static clearTutorial() {
    storeData("globalSetting_isTutorial", false);
  }
  static setTutorial() {
    storeData("globalSetting_isTutorial", true);
  }

  static get difficulty() {
    return loadData("globalSetting_difficulty") ?? 1;
  }
  static set difficulty(value) {
    storeData("globalSetting_difficulty", value);
  }

  static set playerGold(value) {
    storeData("globalSetting_playerGold", value);
  }

  static get playerGold() {
    return loadData("globalSetting_playerGold") ?? 0;
  }
}
