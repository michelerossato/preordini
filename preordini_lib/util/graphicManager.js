this.popolaQRCode = function () {
        console.log("Inizio generazione QR Code...");
        $("#qrcode").empty(); 
        
        try {
            const testoQR = qrcodeManager.generaTestoOrdine();
            console.log("Dati codificati per QR:", testoQR);
            
            const qrCode = new QRCodeStyling({
                width: 300,           // Leggermente più grande
                height: 300,
                data: testoQR,
                type: "svg",          // SVG è più nitido del canvas
                dotsOptions: {
                    color: "#000000", // NERO (Massimo contrasto)
                    type: "square"    // QUADRATO (Standard per scanner)
                },
                cornersSquareOptions: {
                    color: "#000000", // NERO
                    type: "square"    // QUADRATO
                },
                backgroundOptions: {
                    color: "#ffffff", // BIANCO
                }
            });
            
            qrCode.append(document.getElementById("qrcode"));
            console.log("QR Code renderizzato (Versione Alta Compatibilità).");
        } catch (e) {
            console.error("Errore durante la creazione del QR Code:", e);
        }
    };
