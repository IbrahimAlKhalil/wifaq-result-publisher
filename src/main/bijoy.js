function isBengaliPreKar(CUni) {
    return CUni === 'ি' || CUni === 'ৈ'
        || CUni === 'ে';
}

function isBengaliPostKar(CUni) {
    return CUni === 'া' || CUni === 'ো'
        || CUni === 'ৌ' || CUni === 'ৗ' || CUni === 'ু'
        || CUni === 'ূ' || CUni === 'ী'
        || CUni === 'ৃ';
}

function isBengaliKar(CUni) {
    return !!(isBengaliPreKar(CUni) || isBengaliPostKar(CUni));
}

function isBengaliBanjonborno(CUni) {
    return CUni === 'ক' || CUni === 'খ' || CUni === 'গ' || CUni === 'ঘ' || CUni === 'ঙ'
        || CUni === 'চ' || CUni === 'ছ' || CUni === 'জ' || CUni === 'ঝ' || CUni === 'ঞ'
        || CUni === 'ট' || CUni === 'ঠ' || CUni === 'ড' || CUni === 'ঢ' || CUni === 'ণ'
        || CUni === 'ত' || CUni === 'থ' || CUni === 'দ' || CUni === 'ধ' || CUni === 'ন'
        || CUni === 'প' || CUni === 'ফ' || CUni === 'ব' || CUni === 'ভ' || CUni === 'ম'
        || CUni === 'শ' || CUni === 'ষ' || CUni === 'স' || CUni === 'হ'
        || CUni === 'য' || CUni === 'র' || CUni === 'ল' || CUni === 'য়'
        || CUni === 'ং' || CUni === 'ঃ' || CUni === 'ঁ'
        || CUni === 'ৎ';
}

function isBengaliNukta(CUni) {
    return CUni === 'ং' || CUni === 'ঃ' || CUni === 'ঁ';


}

function isBengaliHalant(CUni) {
    return CUni === '্';
}

function isSpace(C) {
    return C === ' ' || C === '\t' || C === '\n'
        || C === '\r';
}


/**bijoy ekushey and bayanno pro**/
let bijoy_string_conversion_map = {
    // <JUKTAKHKHOR>
    'i¨': 'র‌্য',
    'ª¨': '্র্য',
    '°': 'ক্ক',
    '±': 'ক্ট',
    '³': 'ক্ত',
    'K¡': 'ক্ব',
    '¯Œ': 'স্ক্র',
    'µ': 'ক্র',
    'K¬': 'ক্ল',
    'ÿ': 'ক্ষ',
    '¸': 'গু',
    '»': 'গ্ধ',
    'Mœ': 'গ্ন',
    'M¥': 'গ্ম',
    'Mø': 'গ্ল',
    '¼': 'ঙ্ক',
    '•¶': 'ঙ্ক্ষ',
    '•L': 'ঙ্খ',
    '½': 'ঙ্গ',
    '•N': 'ঙ্ঘ',
    '•': 'ক্স',
    '”P': 'চ্চ',
    '”Q': 'চ্ছ',
    '”Q¡': 'চ্ছ্ব',
    '”T': 'চ্ঞ',
    '¾¡': 'জ্জ্ব',
    '¾': 'জ্জ',
    'À': 'জ্ঝ',
    'Á': 'জ্ঞ',
    'R¡': 'জ্ব',
    'Â': 'ঞ্চ',
    'Ã': 'ঞ্ছ',
    'Ä': 'ঞ্জ',
    'Å': 'ঞ্ঝ',
    'Æ': 'ট্ট',
    'U¡': 'ট্ব',
    'U¥': 'ট্ম',
    'Ç': 'ড্ড',
    'È': 'ণ্ট',
    'É': 'ণ্ঠ',
    'Ý': 'ন্স',
    'Ð': 'ণ্ড',
    'š‘': 'ন্তু',
    'Y^': 'ণ্ব',
    'Ë': 'ত্ত',
    'Ë¡': 'ত্ত্ব',
    'Ì': 'ত্থ',
    'Z¥': 'ত্ম',
    'šÍ¡': 'ন্ত্ব',
    'Z¡': 'ত্ব',
    'Î': 'ত্র',
    '_¡': 'থ্ব',
    '˜M': 'দ্গ',
    '˜N': 'দ্ঘ',
    'Ï': 'দ্দ',
    '×': 'দ্ধ',
    '˜¡': 'দ্ব',
    'Ø': 'দ্ব',
    '™¢': 'দ্ভ',
    'Ù': 'দ্ম',
    '`ªæ': 'দ্রু',
    'aŸ': 'ধ্ব',
    'a¥': 'ধ্ম',
    '›U': 'ন্ট',
    'Ú': 'ন্ঠ',
    'Û': 'ন্ড',
    'šÍ': 'ন্ত',
    'š¿': 'ন্ত্র',
    'š’': 'ন্থ',
    '›`': 'ন্দ',
    '›Ø': 'ন্দ্ব',
    'Ü': 'ন্ধ',
    'bœ': 'ন্ন',
    'š^': 'ন্ব',
    'b¥': 'ন্ম',
    'Þ': 'প্ট',
    'ß': 'প্ত',
    'cœ': 'প্ন',
    'à': 'প্প',
    'cø': 'প্ল',
    'á': 'প্স',
    'd¬': 'ফ্ল',
    'â': 'ব্জ',
    'ã': 'ব্দ',
    'ä': 'ব্ধ',
    'eŸ': 'ব্ব',
    'eø': 'ব্ল',
    'å': 'ভ্র',
    'gœ': 'ম্ন',
    '¤ú': 'ম্প',
    'ç': 'ম্ফ',
    '¤\\^': 'ম্ব', //ম্ব ¤\\^ //¤^
    '¤¢': 'ম্ভ',
    '¤£': 'ম্ভ্র',
    '¤§': 'ম্ম',
    '¤ø': 'ম্ল',
    'iæ': 'রু',
    'iƒ': 'রূ',
    'é': 'ল্ক',
    'ê': 'ল্গ',
    'ë': 'ল্ট',
    'ì': 'ল্ড',
    'í': 'ল্প',
    'î': 'ল্ফ',
    'j¦': 'ল্ব',
    'j¥': 'ল্ম',
    'jø': 'ল্ল',
    'ï': 'শু',
    'ð': 'শ্চ',
    'kœ': 'শ্ন',
    'k¦': 'শ্ব',
    'k¥': 'শ্ম',
    'kø': 'শ্ল',
    '®‹': 'ষ্ক',
    '®Œ': 'ষ্ক্র',
    'ó': 'ষ্ট',
    'ô': 'ষ্ঠ',
    'ò': 'ষ্ণ',
    '®ú': 'ষ্প',
    'õ': 'ষ্ফ',
    '®§': 'ষ্ম',
    '¯‹': 'স্ক',
    '÷': 'স্ট',
    'ö': 'স্খ',
    '¯Í': 'স্ত',
    '¯‘': 'স্তু',
    '¯¿': 'স্ত্র',
    '¯’': 'স্থ',
    'mœ': 'স্ন',
    '¯ú': 'স্প',
    'ù': 'স্ফ',
    '¯^': 'স্ব',
    '¯§': 'স্ম',
    'mø': 'স্ল',
    'û': 'হু',
    'nè': 'হ্ণ',
    'ý': 'হ্ন',
    'þ': 'হ্ম',
    'n¬': 'হ্ল',
    'ü': 'হৃ',
    '©': 'র্',

    // <VOWELS>
    'Av': 'আ',
    'A': 'অ',
    'B': 'ই',
    'C': 'ঈ',
    'D': 'উ',
    'E': 'ঊ',
    'F': 'ঋ',
    'G': 'এ',
    'H': 'ঐ',
    'I': 'ও',
    'J': 'ঔ',

    // <CONSONANTS>
    'K': 'ক',
    'L': 'খ',
    'M': 'গ',
    'N': 'ঘ',
    'O': 'ঙ',
    'P': 'চ',
    'Q': 'ছ',
    'R': 'জ',
    'S': 'ঝ',
    'T': 'ঞ',
    'U': 'ট',
    'V': 'ঠ',
    'W': 'ড',
    'X': 'ঢ',
    'Y': 'ণ',
    'Z': 'ত',
    '_': 'থ',
    '`': 'দ',
    'a': 'ধ',
    'b': 'ন',
    'c': 'প',
    'd': 'ফ',
    'e': 'ব',
    'f': 'ভ',
    'g': 'ম',
    'h': 'য',
    'i': 'র',
    'j': 'ল',
    'k': 'শ',
    'l': 'ষ',
    'm': 'স',
    'n': 'হ',
    'o': 'ড়',
    'p': 'ঢ়',
    'q': 'য়',
    'r': 'ৎ',

    // <DIGITS>
    '0': '০',
    '1': '১',
    '2': '২',
    '3': '৩',
    '4': '৪',
    '5': '৫',
    '6': '৬',
    '7': '৭',
    '8': '৮',
    '9': '৯',

    // Kars
    'v': 'া',
    'w': 'ি',
    'x': 'ী',
    'y': 'ু',
    'z': 'ু',
    '~': 'ূ',
    '„': 'ৃ',
    '‡': 'ে',
    '†': 'ে',
    '‰': 'ৈ',
    'ˆ': 'ৈ',
    'Š': 'ৗ',

    // signs
    'Ô': '‘',
    'Õ': '’',
    '\\|': '।',
    'Ò': '“',
    'Ó': '”',

    // Complex
    's': 'ং',
    't': 'ঃ',
    'u': 'ঁ',
    'ª': '্র',
    'Ö': '্র',
    '«': '্র',
    '¨': '্য',
    '\\&': '্',
    '…': 'ৃ'
};

function ReArrangeUnicodeConvertedText(str) {
    for (let i = 0; i < str.length; i++) {
        // for 'Vowel + HALANT + Consonant'
        // it should be 'HALANT + Consonant + Vowel'
        if (i > 0 && str.charAt(i) === '\u09CD' && (isBengaliKar(str.charAt(i - 1)) || isBengaliNukta(str.charAt(i - 1))) && i < str.length - 1) {
            let temp = str.substring(0, i - 1);
            temp += str.charAt(i);
            temp += str.charAt(i + 1);
            temp += str.charAt(i - 1);
            temp += str.substring(i + 2, str.length);
            str = temp;
        }

        // for 'RA (\u09B0) + HALANT + Vowel'
        // it should be 'Vowel + RA (\u09B0) + HALANT'
        if (i > 0 && i < str.length - 1 && str.charAt(i) === '\u09CD' && str.charAt(i - 1) === '\u09B0'
            && str.charAt(i - 2) !== '\u09CD' && isBengaliKar(str.charAt(i + 1))) {
            let temp = str.substring(0, i - 1);
            temp += str.charAt(i + 1);
            temp += str.charAt(i - 1);
            temp += str.charAt(i);
            temp += str.substring(i + 2, str.length);
            str = temp;
        }

        // Change refs
        if (i < str.length - 1 && str.charAt(i) === 'র' && isBengaliHalant(str.charAt(i + 1)) && !isBengaliHalant(str.charAt(i - 1))) {
            let j = 1;
            while (true) {
                if (i - j < 0)
                    break;
                if (isBengaliBanjonborno(str.charAt(i - j)) && isBengaliHalant(str.charAt(i - j - 1)))
                    j += 2;
                else if (j === 1 && isBengaliKar(str.charAt(i - j)))
                    j++;
                else
                    break;
            }
            let temp = str.substring(0, i - j);
            temp += str.charAt(i);
            temp += str.charAt(i + 1);
            temp += str.substring(i - j, i);
            temp += str.substring(i + 2, str.length);
            str = temp;
            i += 1;
            continue;
        }

        // Change pre-kar to post format suitable for unicode
        if (i < str.length - 1 && isBengaliPreKar(str.charAt(i)) && isSpace(str.charAt(i + 1)) === false) {
            let temp = str.substring(0, i);
            let j = 1;

            while (isBengaliBanjonborno(str.charAt(i + j))) {
                if (isBengaliHalant(str.charAt(i + j + 1)))
                    j += 2;
                else
                    break;
            }
            temp += str.substring(i + 1, i + j + 1);

            let l = 0;
            if (str.charAt(i) === 'ে' && str.charAt(i + j + 1) === 'া') {
                temp += 'ো';
                l = 1;
            } else if (str.charAt(i) === 'ে' && str.charAt(i + j + 1) === 'ৗ') {
                temp += 'ৌ';
                l = 1;
            } else
                temp += str.charAt(i);
            temp += str.substring(i + j + l + 1, str.length);
            str = temp;
            i += j;
        }

        // nukta should be placed after kars
        // if(i<str.length-1 && isBengaliNukta(str.charAt(i)) && isBengaliPostKar(str.charAt(i+1)))
        if (i < str.length - 1 && str.charAt(i) === 'ঁ' && isBengaliPostKar(str.charAt(i + 1))) {
            let temp = str.substring(0, i);
            temp += str.charAt(i + 1);
            temp += str.charAt(i);
            temp += str.substring(i + 2, str.length);
            str = temp;
        }
    }

    return str;
}

export default function (str) {
    let conversion_map = bijoy_string_conversion_map;
    for (let ascii in conversion_map) {
        let myRegExp = new RegExp(ascii, 'g');
        str = str.replace(myRegExp, conversion_map[ascii]);
    }

    str = ReArrangeUnicodeConvertedText(str);

    let myRegExp = new RegExp('অা', 'g');
    str = str.replace(myRegExp, 'আ');

    return str;
}
