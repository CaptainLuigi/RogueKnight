/*

hovering over weapon
-> return requiresTargeting true/false

false -> highlight enemy with index 0


true -> return min range and max range
        range equals enemy index, able to target enemies from min to max range
        highlight enemies with corresponding index


calculating which enemie takes damage
-> click on enemy
if enemy in range (enemy index corresponds with min range or <= max range)
function calculate damage
+ affectsleft damages enemies left from the target how many depends on variable
+ affectsright damages enemies right from the target how many depends on variable
(possibly calculating with increasing/decreasing index of enemy)



meta progression, startrelic aussuchen

bei einem gegner, diesen centern

succubus soll instant angreifen

gegner glitchen leicht hoch/runter, wahrscheinlich durch neues styling für abstände bei intent + display

tooltip im fight inhalt centern

waffen machen prozentual schaden evtl implementieren

wenn beim final boss im browser zurück -> softlock / nichts mehr auf map auswählbar

upgrade weapon options remove, wenn alle waffen max lvl

wenn gestorben und beim deathscreen im browser zurück gegangen wird -> volle Leben und Kampf ist noch vor dem ersten Fight 
(wenn dieser Kampf gewonnen wird, muss man danach den allerersten Fight machen)

enemy intent nicht sichtbar solange enemy poison damage nimmt

waffen aus der hand ryceln?

zindex in vielen fällen nicht notwendig, ggf rausnehmen

waffen tooltip bei leave weapon behind event anzeigen

anzeige welcher gegner getroffen werden kann überprüfen -> wenn gegner angreift links und rechts gelbe striche sichtbar

wenn gegner mit double strike/triple strike während dem angriff sterben, gehen die restlichen hits trotzdem durch

fallback relic pile of gold einfügen (falls nicht genügend relics für chest oder shop vorhanden)

schadensanzeige stackt überhalb von player

disable end turn button nach elite

nach boss fight wird erst gehealed bevor untouched heart getriggert wird
*/
