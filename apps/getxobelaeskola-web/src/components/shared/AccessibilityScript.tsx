'use client';

import Script from 'next/script';

export default function AccessibilityScript() {
    return (
        <Script
            id="equalweb-accessibility-script"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
                __html: `
window.interdeal = {
    get sitekey (){ return "3e96e04b894beb42c3121488977be359"} ,
    get domains(){
        return {
            "js": "https://cdn.equalweb.com/",
            "acc": "https://access.equalweb.com/"
        }
    },
    "Position": "left",
    "Menulang": "ES",
    "draggable": true,
    "btnStyle": {
        "vPosition": [
            "99.8%",
            "99.8%"
        ],
        "margin": [
            "10",
            "10"
        ],
        "scale": [
            "0.5",
            "0.5"
        ],
        "color": {
            "main": "#1c4bb6",
            "second": "#ffffff"
        },
        "icon": {
            "outline": false,
            "outlineColor": "#ffffff",
            "type": 2,
            "shape": "circle"
        }
    }
};

(function(doc, head, body){
    var coreCall             = doc.createElement('script');
    coreCall.src             = interdeal.domains.js + 'core/5.3.1/accessibility.js';
    coreCall.defer           = true;
    coreCall.setAttribute('data-cfasync', true );
    body? body.appendChild(coreCall) : head.appendChild(coreCall);
})(document, document.head, document.body);
                `,
            }}
        />
    );
}

