<!--
    var prng;	    	    	    	    // Pseudorandom number generator
    var seed;	    	    	    	    // Current seed array

    //	setSeed  - -  Set seed from seed string

    function setSeed() {
    	if (document.seed.keytype[0].checked) {
    	    var s = encode_utf8(document.seed.text.value);
	    var i, kmd5e, kmd5o;

	    if (s.length == 1) {
	    	s += s;
	    }

	    md5_init();
	    for (i = 0; i < s.length; i += 2) {
	    	md5_update(s.charCodeAt(i));
	    }
	    md5_finish();
	    kmd5e = byteArrayToHex(digestBits);

	    md5_init();
	    for (i = 1; i < s.length; i += 2) {
	    	md5_update(s.charCodeAt(i));
	    }
	    md5_finish();
	    kmd5o = byteArrayToHex(digestBits);

	    var hs = kmd5e + kmd5o;
	    seed =  hexToByteArray(hs);
	} else {    	    // Hexadecimal key
    	    var s = document.seed.text.value;
    	    var hexDigits = "0123456789abcdefABCDEF";
	    var hs = "", i, bogus = false;

	    for (i = 0; i < s.length; i++) {
		var c = s.charAt(i);
		if (hexDigits.indexOf(c) >= 0) {
	    	    hs += c;
		} else {
		    bogus = true;
		}
	    }
	    if (bogus) {
	    	alert("Error: Improper character(s) in hexadecimal key.");
	    }
	    if (hs.length > (keySizeInBits / 4)) {
	    	alert("Warning: hexadecimal key exceeds " +
		      (keySizeInBits / 4) + " digit maximum; truncated.");
		document.seed.text.value = hs = hs.slice(0, 64);
	    } else {
	    	//  If key is fewer than 64 hex digits, fill it with zeroes
	    	while (hs.length < (keySizeInBits / 4)) {
		    hs += "0";
		}
    	    }
	    seed =  hexToByteArray(hs);
    	}
    }

    /*	Determine number of words from current dictionary equivalent to
    	requested number of bits in key.  */

    function bitsWord() {
    	var b = document.results.bits.value;
	if (isNaN(b) || b < 32) {
	    b = document.results.bits.value = 32;
	}
	if (b > 1024) {
	    b = document.results.bits.value = 1024;
	}
	var n;
	for (n = 1; b > Math.floor(Math.LOG2E * Math.log(twords) * n); n++) ;
	document.results.howlong.value = n;
    }

    //	Retrieve word given index in list of words of that length

    function retrieveWord(length, index) {
    	if ((length >= minw) && (length <= maxw) &&
	    (index >= 0) && (index < nwords[length])) {
	    return cwords[length].substring(length * index, length * (index + 1));
	}
	return "";
    }

    //	Obtain word by index in complete dictionary

    function indexWord(index) {
    	if ((index >= 0) && (index < twords)) {
	    var j;

	    for (j = minw; j <= maxw; j++) {
		if (index < nwords[j]) {
		    break;
		}
		index -= nwords[j];
	    }
	    return retrieveWord(j, index);
	}
	return "";
    }

    //	Generate pass phrases

    function GeneratePassPhrases() {
    	var i, j, w, sign = document.results.signatures.checked, sig = "";

	//  Reality check number of phrases and phrase length

	i = document.results.howmany.value;
	if (isNaN(i) || (i < 1)) {
	    i = 1;
	}
	if (i > 100) {
	    i = 100;
	}
	if (i != document.results.howmany.value) {
	    document.results.howmany.value = i;
	}

	i = document.results.howlong.value;
	if (isNaN(i) || (i < 2)) {
	    i = 2;
	}
	if (i > 24) {
	    i = 24;
	}
	if (i != document.results.howlong.value) {
	    document.results.howlong.value = i;
	}

	//  Update number of bits equivalent to phrase words requested

	document.results.bits.value = Math.floor(Math.LOG2E *
	    Math.log(twords) * document.results.howlong.value);

	if (sign) {
	    sig = "\n==========  MD5 Signatures  ==========\n".replace(/=/g,"-");
	}


	setSeed();
	prng = new AESprng(seed);

    	document.results.text.value = "";

    	for (i = 0; i < document.results.howmany.value; i++) {
	    var k = "", nw = 0;
	    while (nw < document.results.howlong.value) {
		if (k.length > 0) {
		    k += " ";
		}
    	    	k += indexWord(prng.nextInt(twords));
		nw++;
	    }

    	    //	If upper case phrases have been requested, so convert this one

    	    if (document.results.uppercase.checked) {
	    	k = k.toUpperCase();
	    }

	    /*	If we're including MD5 signatures of the phrases, compute
	    	the signature of this phrase and append to the list we'll
		tack on to the end of the signature table.  */

	    if (sign) {
		md5_init();
		for (j = 0; j < k.length; j++) {
	    	    md5_update(k.charCodeAt(j));
		}
		md5_finish();
        	var n, hex = "0123456789ABCDEF";

        	for (n = 0; n < 16; n++) {
                    sig += hex.charAt(digestBits[n] >> 4);
                    sig += hex.charAt(digestBits[n] & 0xF);
        	}
        	sig += "\n";
	    }

	    /*	If the user wants the phrases to be numbered, prefix each with
	    	a serial number with enough digits to accommodate them all.  */

    	    if (document.results.number.checked) {
	    	var ndig = Math.floor(Math.LOG10E * Math.log(document.results.howmany.value)) + 1;
		var nu = "" + (i + 1);

		while (nu.length < ndig) {
		    nu = " " + nu;
		}
		k = k;
	    }
    	    document.results.text.value += k + "\n";
	}
	document.results.text.value += sig;
	delete prng;
    }

    //	Generate a pseudorandom seed value

    function Generate_seed() {
    	var i, j, k = "";

	addEntropyTime();
	var seed = keyFromEntropy();

    	var prng = new AESprng(seed);
	if (document.seed.keytype[0].checked) {
	    //	Text key
	    var charA = ("A").charCodeAt(0);

	    for (i = 0; i < 12; i++) {
		if (i > 0) {
	    	    k += "-";
		}
		for (j = 0; j < 5; j++) {
	    	    k += String.fromCharCode(charA + prng.nextInt(25));
		}
	    }
	} else {
	    // Hexadecimal key
	    var hexDigits = "0123456789ABCDEF";

	    for (i = 0; i < 64; i++) {
	    	k += hexDigits.charAt(prng.nextInt(15));
	    }
	}
    	document.seed.text.value = k;
	delete prng;
    }

    /*	This is our onLoad event handler.  If the seed text input field
    	is blank, generate an initial default seed.  This won't be a very
	high entropy value, as at this point the entropy vector will
	contain only the time at which the page began to load and the time
	(very shortly thereafter) which this function was called.  Still,
	it sure beats a blank seed!  */

    function nowLoaded() {
    	ce();	    	    	    	// Add time we got here to entropy
    	mouseMotionEntropy(60);   	// Initialise collection of mouse motion entropy
    	if (document.seed.text.value == '') {
    	    Generate_seed();
    	}
    }

// -->
