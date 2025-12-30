function GraphicManager() {

    // =============================================================
    // GENERA INTERFACCIA MENU (Con input Cliente/Tavolo)
    // =============================================================
    this.generateMenu = function (hashmap) {
        let html = `
            <div class="form-ordine" style="padding:15px; background:#222; border-radius:10px; margin-bottom:20px;">
                <input type="text" id="nomecliente" placeholder="Inserisci il tuo nome">
                <input type="text" id="tavolo" placeholder="Numero tavolo">
                <input type="number" id="coperti" placeholder="Quanti siete?" min="1">
            </div>
        `;

        elencoPrincipale.forEach(cat => {
            const articoli = elencoPietanze[cat] || [];
            html += `<div data-role="collapsible"><h4>${cat}</h4>`;

            articoli.forEach(p => {
                const id = String(p.id);
                const nome = p.descrizione || p.nome || "";
                const prezzo = Number(p.prezzo) || 0;
                const quantita = hashmap.contains(id) ? hashmap.get(id) : 0;

                html += `
                    <div class="content-pietanza-ordine">
                        <div class="left nome-pietanza">${nome}</div>
                        <div class="center prezzo-pietanza-ordine">${prezzo.toFixed(2)} €</div>
                        <div class="right controlli">
                            <button class="ui-btn brown-btn minus-btn" id="minus${id}">−</button>
                            <span id="quantita${id}" class="quantita-span">${quantita}</span>
                            <button class="ui-btn brown-btn plus-btn" id="plus${id}">+</button>
                        </div>
                        <div class="endBlock"></div>
                    </div>
                `;
            });
            html += `</div>`;
        });

        return html;
    };

    // =============================================================
    // GESTIONE PULSANTI + / −
    // =============================================================
    this.setButtonPlusMinus = function (hashmap) {
        elencoPrincipale.forEach(cat => {
            (elencoPietanze[cat] || []).forEach(p => {
                const id = String(p.id);

                $("#plus" + id).off().on("click", function () {
                    let q = parseInt($("#quantita" + id).text(), 10) || 0;
                    q++;
                    $("#quantita" + id).text(q);
                    hashmap.put(id, q);
                    dataManager.saveInstanceHashmap(hashmap);
                });

                $("#minus" + id).off().on("click", function () {
                    let q = parseInt($("#quantita" + id).text(), 10) || 0;
                    q = Math.max(q - 1, 0);
                    $("#quantita" + id).text(q);

                    if (q === 0) hashmap.remove(id);
                    else hashmap.put(id, q);

                    dataManager.saveInstanceHashmap(hashmap);
                });
            });
        });
    };

    // =============================================================
    // GENERA RIEPILOGO TESTUALE
    // =============================================================
    this.popolaResoconto = function () {
        const hashmap = dataManager.getInstanceHashmap();
        const ordine = hashmap.toObject();

        let html = `<h3>Dati Ordine</h3>
                    <p>Nome: ${$("#nomecliente").val()}<br>
                    Tavolo: ${$("#tavolo").val()}<br>
                    Persone: ${$("#coperti").val()}</p><hr>`;
        
        let totale = 0;
        let totaleQta = 0;

        elencoPrincipale.forEach(cat => {
            const articoli = (elencoPietanze[cat] || [])
                .filter(p => ordine[String(p.id)] !== undefined);

            if (articoli.length === 0) return;

            html += `<h4>${cat}</h4>`;

            articoli.forEach(p => {
                const id = String(p.id);
                const q = ordine[id];
                const prezzo = Number(p.prezzo) || 0;
                const subtot = q * prezzo;

                totale += subtot;
                totaleQta += q;

                html += `
                    <div class="riga-resoconto">
                        <div class="left">${p.descrizione}</div>
                        <div class="center">x${q}</div>
                        <div class="right">${subtot.toFixed(2)} €</div>
                        <div class="endBlock"></div>
                    </div>
                `;
            });
        });

        html += `<hr><div class="riga-resoconto">
                    <strong>Totale: ${totale.toFixed(2)} € (${totaleQta} pezzi)</strong>
                 </div>`;

        $("#resoconto").html(html);
    };

    // =============================================================
    // GENERAZIONE QR CODE (Sincronizzato con QRCodeStyling)
    // =============================================================
    this.popolaQRCode = function () {
        console.log("Inizio generazione QR Code...");
        $("#qrcode").empty(); // Pulisce il contenitore precedente
        
        try {
            // Recupera la stringa codificata %7B%22... dal QRCodeManager
            const testoQR = qrcodeManager.generaTestoOrdine();
            console.log("Dati codificati per QR:", testoQR);
            
            // Inizializza QRCodeStyling come richiesto dall'index.html
            const qrCode = new QRCodeStyling({
                width: 280,
                height: 280,
                data: testoQR,
                dotsOptions: {
                    color: "#43b261",
                    type: "rounded"
                },
                cornersSquareOptions: {
                    color: "#178435",
                    type: "extra-rounded"
                },
                backgroundOptions: {
                    color: "#ffffff",
                }
            });
            
            // Appende il canvas al div qrcode
            qrCode.append(document.getElementById("qrcode"));
            console.log("QR Code renderizzato correttamente.");
        } catch (e) {
            console.error("Errore durante la creazione del QR Code:", e);
            alert("Errore tecnico nella generazione del QR.");
        }
    };
}
