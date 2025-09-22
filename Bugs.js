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

more players with different starting weapons

aliensrock überarbeiten -> waffen die alle treffen keinen gegner auswählen, wenn nur ein gegner übrig -> keinen gegner auswählen

Lexikon mit Waffen, Relics und Gegnern

wenn beim final boss im browser zurück -> softlock / nichts mehr auf map auswählbar

upgrade weapon options remove, wenn alle waffen max lvl

wenn gestorben und beim deathscreen im browser zurück gegangen wird -> volle Leben und Kampf ist noch vor dem ersten Fight 
(wenn dieser Kampf gewonnen wird, muss man danach den allerersten Fight machen)

rewards einbauen, wenn man forest boss besiegt hat

damage display in event anpassen

player sprite, healthbar, energy, block, status container alles in ein div
positionieren höhe wie energy, left wie healthbar
player sprite noch in eigenen wrapper
absolute positioning von block, energy und healthbar entfernen

*/
